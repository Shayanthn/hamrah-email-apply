// Local Storage Database Manager
// این سیستم مثل SQLite کار می‌کند اما با localStorage

import { 
  validateProfessorData, 
  validateApplicationData, 
  validateEmailData,
  sanitizeText,
  secureStorageSet,
  secureStorageGet,
  isRateLimited,
  performanceMonitor
} from './security';

// Types and interfaces
export interface Professor {
  id: string;
  name: string;
  email: string;
  university: string;
  department: string;
  researchArea: string;
  status: 'not-contacted' | 'contacted' | 'responded' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  professorId: string;
  subject: string;
  content: string;
  sentDate: string;
  responseDate?: string;
  status: 'draft' | 'sent' | 'replied' | 'bounced';
  responseType?: 'positive' | 'negative' | 'neutral';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  university: string;
  program: string;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted';
  documents: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  currentDegree?: string;
  currentUniversity?: string;
  degree?: string;
  university?: string;
  graduationYear?: number;
  gpa?: number;
  skills?: string;
  experience?: string;
  gre?: {
    verbal: number;
    quantitative: number;
    writing: number;
  };
  toefl?: {
    total: number;
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  ielts?: {
    overall: number;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  researchInterests?: string[];
  workExperience?: string;
  publications?: string[];
  awards?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type ProfessorStatus = 'not-contacted' | 'contacted' | 'responded' | 'rejected';
export type EmailStatus = 'draft' | 'sent' | 'replied' | 'bounced';
export type ApplicationStatus = 'not-started' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted';

// Utility function to generate unique IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export class LocalDatabase {
  private static readonly STORAGE_KEYS = {
    PROFESSORS: 'applyhelper_professors',
    EMAILS: 'applyhelper_emails',
    APPLICATIONS: 'applyhelper_applications',
    PROFILE: 'applyhelper_profile',
    SETTINGS: 'applyhelper_settings'
  };

  // Professor CRUD operations
  addProfessor(professor: Omit<Professor, 'id'>): Professor {
    // Security checks
    if (isRateLimited('addProfessor', 10, 60000)) {
      throw new Error('درخواست‌های زیادی ارسال شده. لطفاً کمی صبر کنید.');
    }

    performanceMonitor.start('addProfessor');

    // Validate input
    const validationErrors = validateProfessorData(professor);
    if (validationErrors.length > 0) {
      throw new Error(`خطاهای اعتبارسنجی: ${validationErrors.join(', ')}`);
    }

    // Sanitize inputs
    const sanitizedProfessor = {
      ...professor,
      name: sanitizeText(professor.name),
      email: sanitizeText(professor.email),
      university: sanitizeText(professor.university),
      department: sanitizeText(professor.department),
      researchArea: sanitizeText(professor.researchArea),
      notes: professor.notes ? sanitizeText(professor.notes) : undefined
    };

    const professors = this.getProfessors();
    const newProfessor: Professor = {
      ...sanitizedProfessor,
      id: generateId()
    };
    professors.push(newProfessor);
    
    if (!secureStorageSet(LocalDatabase.STORAGE_KEYS.PROFESSORS, professors)) {
      throw new Error('خطا در ذخیره داده‌ها');
    }

    performanceMonitor.end('addProfessor');
    return newProfessor;
  }

  getProfessors(): Professor[] {
    const data = secureStorageGet(LocalDatabase.STORAGE_KEYS.PROFESSORS);
    return Array.isArray(data) ? data : [];
  }

  getProfessor(id: string): Professor | null {
    const professors = this.getProfessors();
    return professors.find(p => p.id === id) || null;
  }

  updateProfessor(id: string, updates: Partial<Omit<Professor, 'id'>>): Professor | null {
    const professors = this.getProfessors();
    const index = professors.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    professors[index] = { ...professors[index], ...updates };
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.PROFESSORS, JSON.stringify(professors));
    return professors[index];
  }

  deleteProfessor(id: string): boolean {
    const professors = this.getProfessors();
    const filteredProfessors = professors.filter(p => p.id !== id);
    
    if (filteredProfessors.length === professors.length) return false;
    
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.PROFESSORS, JSON.stringify(filteredProfessors));
    
    // Also delete related emails
    const emails = this.getEmails().filter(e => e.professorId !== id);
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    
    return true;
  }

  // Email CRUD operations
  addEmail(email: Omit<Email, 'id'>): Email {
    const emails = this.getEmails();
    const newEmail: Email = {
      ...email,
      id: generateId()
    };
    emails.push(newEmail);
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    return newEmail;
  }

  getEmails(): Email[] {
    const data = localStorage.getItem(LocalDatabase.STORAGE_KEYS.EMAILS);
    return data ? JSON.parse(data) : [];
  }

  getEmail(id: string): Email | null {
    const emails = this.getEmails();
    return emails.find(e => e.id === id) || null;
  }

  getEmailsByProfessor(professorId: string): Email[] {
    return this.getEmails().filter(e => e.professorId === professorId);
  }

  updateEmail(id: string, updates: Partial<Omit<Email, 'id'>>): Email | null {
    const emails = this.getEmails();
    const index = emails.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    emails[index] = { ...emails[index], ...updates };
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    return emails[index];
  }

  deleteEmail(id: string): boolean {
    const emails = this.getEmails();
    const filteredEmails = emails.filter(e => e.id !== id);
    
    if (filteredEmails.length === emails.length) return false;
    
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.EMAILS, JSON.stringify(filteredEmails));
    return true;
  }

  // Application CRUD operations
  addApplication(application: Omit<Application, 'id'>): Application {
    const applications = this.getApplications();
    const newApplication: Application = {
      ...application,
      id: generateId()
    };
    applications.push(newApplication);
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return newApplication;
  }

  getApplications(): Application[] {
    const data = localStorage.getItem(LocalDatabase.STORAGE_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : [];
  }

  getApplication(id: string): Application | null {
    const applications = this.getApplications();
    return applications.find(a => a.id === id) || null;
  }

  updateApplication(id: string, updates: Partial<Omit<Application, 'id'>>): Application | null {
    const applications = this.getApplications();
    const index = applications.findIndex(a => a.id === id);
    
    if (index === -1) return null;
    
    applications[index] = { ...applications[index], ...updates };
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    return applications[index];
  }

  deleteApplication(id: string): boolean {
    const applications = this.getApplications();
    const filteredApplications = applications.filter(a => a.id !== id);
    
    if (filteredApplications.length === applications.length) return false;
    
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.APPLICATIONS, JSON.stringify(filteredApplications));
    return true;
  }

  // Profile operations
  getProfile(): Profile | null {
    const data = localStorage.getItem(LocalDatabase.STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }

  updateProfile(profile: Partial<Profile>): Profile {
    const existingProfile = this.getProfile();
    const updatedProfile: Profile = {
      ...existingProfile,
      ...profile,
      id: existingProfile?.id || generateId(),
      updatedAt: new Date().toISOString()
    };
    
    if (!existingProfile) {
      updatedProfile.createdAt = new Date().toISOString();
    }
    
    localStorage.setItem(LocalDatabase.STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
    return updatedProfile;
  }

  // Search operations
  searchProfessors(query: string): Professor[] {
    const professors = this.getProfessors();
    const searchTerm = query.toLowerCase();
    
    return professors.filter(professor => 
      professor.name.toLowerCase().includes(searchTerm) ||
      professor.email.toLowerCase().includes(searchTerm) ||
      professor.university.toLowerCase().includes(searchTerm) ||
      professor.department.toLowerCase().includes(searchTerm) ||
      professor.researchArea.toLowerCase().includes(searchTerm)
    );
  }

  searchEmails(query: string): Email[] {
    const emails = this.getEmails();
    const searchTerm = query.toLowerCase();
    
    return emails.filter(email => 
      email.subject.toLowerCase().includes(searchTerm) ||
      email.content.toLowerCase().includes(searchTerm)
    );
  }

  searchApplications(query: string): Application[] {
    const applications = this.getApplications();
    const searchTerm = query.toLowerCase();
    
    return applications.filter(application => 
      application.university.toLowerCase().includes(searchTerm) ||
      application.program.toLowerCase().includes(searchTerm) ||
      (application.notes && application.notes.toLowerCase().includes(searchTerm))
    );
  }

  // Filter operations
  filterProfessorsByStatus(status: ProfessorStatus): Professor[] {
    return this.getProfessors().filter(p => p.status === status);
  }

  filterEmailsByStatus(status: EmailStatus): Email[] {
    return this.getEmails().filter(e => e.status === status);
  }

  filterApplicationsByStatus(status: ApplicationStatus): Application[] {
    return this.getApplications().filter(a => a.status === status);
  }

  // Statistics and analytics
  getStatistics() {
    const professors = this.getProfessors();
    const emails = this.getEmails();
    const applications = this.getApplications();

    return {
      professors: {
        total: professors.length,
        contacted: professors.filter(p => p.status === 'contacted').length,
        responded: professors.filter(p => p.status === 'responded').length,
        rejected: professors.filter(p => p.status === 'rejected').length,
        notContacted: professors.filter(p => p.status === 'not-contacted').length
      },
      emails: {
        total: emails.length,
        sent: emails.filter(e => e.status === 'sent').length,
        replied: emails.filter(e => e.status === 'replied').length,
        drafts: emails.filter(e => e.status === 'draft').length,
        bounced: emails.filter(e => e.status === 'bounced').length
      },
      applications: {
        total: applications.length,
        notStarted: applications.filter(a => a.status === 'not-started').length,
        inProgress: applications.filter(a => a.status === 'in-progress').length,
        submitted: applications.filter(a => a.status === 'submitted').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        waitlisted: applications.filter(a => a.status === 'waitlisted').length
      }
    };
  }

  // Utility operations
  exportData(): string {
    const data = {
      professors: this.getProfessors(),
      emails: this.getEmails(),
      applications: this.getApplications(),
      profile: this.getProfile(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.professors) {
        localStorage.setItem(LocalDatabase.STORAGE_KEYS.PROFESSORS, JSON.stringify(data.professors));
      }
      if (data.emails) {
        localStorage.setItem(LocalDatabase.STORAGE_KEYS.EMAILS, JSON.stringify(data.emails));
      }
      if (data.applications) {
        localStorage.setItem(LocalDatabase.STORAGE_KEYS.APPLICATIONS, JSON.stringify(data.applications));
      }
      if (data.profile) {
        localStorage.setItem(LocalDatabase.STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAllData(): boolean {
    try {
      Object.values(LocalDatabase.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  // Backup and restore
  createBackup(): string {
    return this.exportData();
  }

  restoreFromBackup(backupData: string): boolean {
    return this.importData(backupData);
  }

  // Get upcoming deadlines
  getUpcomingDeadlines(days: number = 30): Application[] {
    const applications = this.getApplications();
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return applications.filter(app => {
      const deadline = new Date(app.deadline);
      return deadline >= now && deadline <= futureDate && 
             (app.status === 'not-started' || app.status === 'in-progress');
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }

  // Recent activity
  getRecentActivity(days: number = 7): (Professor | Email | Application)[] {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const recentItems: (Professor | Email | Application)[] = [];
    
    // Recent professors
    const professors = this.getProfessors().filter(p => 
      new Date(p.updatedAt) >= pastDate
    );
    recentItems.push(...professors);
    
    // Recent emails
    const emails = this.getEmails().filter(e => 
      new Date(e.updatedAt) >= pastDate
    );
    recentItems.push(...emails);
    
    // Recent applications
    const applications = this.getApplications().filter(a => 
      new Date(a.updatedAt) >= pastDate
    );
    recentItems.push(...applications);
    
    // Sort by update date
    return recentItems.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

// Create and export a singleton instance
export const localDB = new LocalDatabase();

// Export as default for easier importing
export default LocalDatabase;