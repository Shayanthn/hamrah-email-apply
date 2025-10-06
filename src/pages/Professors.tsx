import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../contexts/DatabaseContext';
import type { Professor } from '../utils/database';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Building,
  User,
  Filter
} from 'lucide-react';

const Professors: React.FC = () => {
  const { t } = useLanguage();
  const { professors, addProfessor, updateProfessor, deleteProfessor } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    department: '',
    researchArea: '',
    status: 'contacted' as Professor['status'],
    notes: '',
  });

  // Filter professors
  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = 
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.researchArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || professor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfessor) {
      await updateProfessor(editingProfessor.id!, formData);
      setEditingProfessor(null);
    } else {
      await addProfessor(formData);
    }
    
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      university: '',
      department: '',
      researchArea: '',
      status: 'contacted',
      notes: '',
    });
  };

  const handleEdit = (professor: Professor) => {
    setFormData({
      name: professor.name,
      email: professor.email,
      university: professor.university,
      department: professor.department,
      researchArea: professor.researchArea,
      status: professor.status,
      notes: professor.notes || '',
    });
    setEditingProfessor(professor);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این استاد اطمینان دارید؟')) {
      await deleteProfessor(id);
    }
  };

  const getStatusColor = (status: Professor['status']) => {
    switch (status) {
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Professor['status']) => {
    switch (status) {
      case 'not-contacted': return 'تماس گرفته نشده';
      case 'contacted': return 'تماس گرفته شده';
      case 'responded': return 'پاسخ داده';
      case 'rejected': return 'رد شده';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-persian">
          {t('professors.title')}
        </h1>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-persian">{t('professors.addNew')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در اساتید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="contacted">تماس گرفته شده</option>
              <option value="responded">پاسخ داده</option>
              <option value="accepted">قبول شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
        </div>
      </div>

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map((professor) => (
          <div key={professor.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white font-persian">
                    {professor.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-persian ${getStatusColor(professor.status)}`}>
                    {getStatusText(professor.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(professor)}
                  className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(professor.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4" />
                <span className="font-persian">{professor.university}</span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 font-persian">
                دانشکده: {professor.department}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 font-persian">
                تحقیقات: {professor.researchArea}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{professor.email}</span>
              </div>
            </div>

            {professor.notes && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400 font-persian">
                {professor.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProfessors.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white font-persian mb-2">
            استادی یافت نشد
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-persian">
            هنوز استادی اضافه نکرده‌اید یا فیلتر شما نتیجه‌ای ندارد.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-persian mb-4">
                {editingProfessor ? 'ویرایش استاد' : t('professors.addNew')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.university')}
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.department')}
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.research')}
                  </label>
                  <input
                    type="text"
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    {t('professors.status')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  >
                    <option value="contacted">تماس گرفته شده</option>
                    <option value="responded">پاسخ داده</option>
                    <option value="accepted">قبول شده</option>
                    <option value="rejected">رد شده</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    یادداشت‌ها
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                    placeholder="یادداشت‌های اضافی..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors font-persian"
                  >
                    {editingProfessor ? 'ویرایش' : 'افزودن'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProfessor(null);
                      setFormData({
                        name: '',
                        email: '',
                        university: '',
                        department: '',
                        researchArea: '',
                        status: 'contacted',
                        notes: '',
                      });
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-persian"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professors;