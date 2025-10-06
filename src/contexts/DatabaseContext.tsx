import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocalDatabase } from '../utils/database';
import type { Professor, Email, Application, Profile, ApplicationStatus } from '../utils/database';

// Initialize the database
const localDB = new LocalDatabase();

interface DatabaseContextType {
  // Data
  professors: Professor[];
  emails: Email[];
  applications: Application[];
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  // Professor operations
  addProfessor: (professor: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProfessor: (id: string, professor: Partial<Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteProfessor: (id: string) => Promise<void>;

  // Email operations
  addEmail: (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmail: (id: string, email: Partial<Omit<Email, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteEmail: (id: string) => Promise<void>;

  // Application operations
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplication: (id: string, application: Partial<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;

  // Profile operations
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  
  // Statistics
  getStatistics: () => any;
  
  // Refresh data
  refreshData: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = () => {
    setProfessors(localDB.getProfessors());
    setEmails(localDB.getEmails());
    setApplications(localDB.getApplications());
    setProfile(localDB.getProfile());
  };

  useEffect(() => {
    refreshData();
    
    // Add some mock data if empty (for demo purposes)
    if (localDB.getProfessors().length === 0) {
      const mockProfessors = [
        {
          name: 'Dr. John Smith',
          email: 'john.smith@mit.edu',
          university: 'MIT',
          department: 'Computer Science',
          researchArea: 'Machine Learning',
          status: 'contacted' as const,
          notes: 'Interested in AI research',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.j@stanford.edu',
          university: 'Stanford University',
          department: 'Computer Science',
          researchArea: 'Computer Vision',
          status: 'responded' as const,
          notes: 'Positive response, interested in collaboration',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      mockProfessors.forEach(prof => {
        localDB.addProfessor(prof);
      });

      // Add mock emails
      const professors = localDB.getProfessors();
      if (professors.length > 0) {
        localDB.addEmail({
          professorId: professors[0].id,
          subject: 'Research Collaboration Inquiry',
          content: 'Dear Dr. Smith, I am interested in your research on machine learning...',
          sentDate: new Date().toISOString(),
          status: 'sent',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        localDB.addEmail({
          professorId: professors[1].id,
          subject: 'Follow-up on Previous Discussion',
          content: 'Dear Dr. Johnson, Thank you for your positive response...',
          sentDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'replied',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Add mock applications
      localDB.addApplication({
        university: 'MIT',
        program: 'PhD in Computer Science',
        deadline: '2024-12-15',
        status: 'in-progress',
        documents: ['CV', 'Statement of Purpose', 'Transcripts'],
        notes: 'Strong program in AI research',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      localDB.addApplication({
        university: 'Stanford University',
        program: 'MS in Computer Science',
        deadline: '2024-12-01',
        status: 'submitted',
        documents: ['CV', 'Statement of Purpose', 'Transcripts', 'Recommendation Letters'],
        notes: 'Applied early, waiting for response',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      refreshData();
    }
  }, []);

  // Professor operations
  const addProfessor = async (professor: Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.addProfessor({
        ...professor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to add professor');
    } finally {
      setLoading(false);
    }
  };

  const updateProfessor = async (id: string, professor: Partial<Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.updateProfessor(id, {
        ...professor,
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to update professor');
    } finally {
      setLoading(false);
    }
  };

  const deleteProfessor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      localDB.deleteProfessor(id);
      refreshData();
    } catch (err) {
      setError('Failed to delete professor');
    } finally {
      setLoading(false);
    }
  };

  // Email operations
  const addEmail = async (email: Omit<Email, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.addEmail({
        ...email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to add email');
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async (id: string, email: Partial<Omit<Email, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.updateEmail(id, {
        ...email,
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      localDB.deleteEmail(id);
      refreshData();
    } catch (err) {
      setError('Failed to delete email');
    } finally {
      setLoading(false);
    }
  };

  // Application operations
  const addApplication = async (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.addApplication({
        ...application,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id: string, application: Partial<Omit<Application, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.updateApplication(id, {
        ...application,
        updatedAt: new Date().toISOString()
      });
      refreshData();
    } catch (err) {
      setError('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      localDB.deleteApplication(id);
      refreshData();
    } catch (err) {
      setError('Failed to delete application');
    } finally {
      setLoading(false);
    }
  };

  // Profile operations
  const updateProfile = async (profileData: Partial<Profile>) => {
    setLoading(true);
    setError(null);
    try {
      localDB.updateProfile(profileData);
      refreshData();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = () => {
    return localDB.getStatistics();
  };

  const value: DatabaseContextType = {
    professors,
    emails,
    applications,
    profile,
    loading,
    error,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    addEmail,
    updateEmail,
    deleteEmail,
    addApplication,
    updateApplication,
    deleteApplication,
    updateProfile,
    getStatistics,
    refreshData,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};