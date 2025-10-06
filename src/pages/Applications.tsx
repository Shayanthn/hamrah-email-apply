import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  GraduationCap,
  MapPin,
  Star,
  Filter,
  Search
} from 'lucide-react';

const Applications: React.FC = () => {
  const { t } = useLanguage();
  const { applications, addApplication, updateApplication, deleteApplication } = useDatabase();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    university: '',
    program: '',
    deadline: '',
    status: 'not-started' as const,
    documents: '',
    notes: ''
  });

  const statusColors = {
    'not-started': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'submitted': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'accepted': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'waitlisted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
  };

  const statusLabels = {
    'not-started': 'شروع نشده',
    'in-progress': 'در حال انجام',
    'submitted': 'ارسال شده',
    'accepted': 'پذیرفته شده',
    'rejected': 'رد شده',
    'waitlisted': 'لیست انتظار'
  };

  const statusIcons = {
    'not-started': Clock,
    'in-progress': AlertCircle,
    'submitted': CheckCircle2,
    'accepted': CheckCircle2,
    'rejected': XCircle,
    'waitlisted': Clock
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const applicationData = {
      ...formData,
      documents: formData.documents.split(',').map(doc => doc.trim()).filter(doc => doc),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingApp) {
      await updateApplication(editingApp.id, applicationData);
    } else {
      await addApplication(applicationData);
    }

    setFormData({
      university: '',
      program: '',
      deadline: '',
      status: 'not-started',
      documents: '',
      notes: ''
    });
    setShowAddModal(false);
    setEditingApp(null);
  };

  const handleEdit = (app: any) => {
    setEditingApp(app);
    setFormData({
      university: app.university,
      program: app.program,
      deadline: app.deadline,
      status: app.status,
      documents: Array.isArray(app.documents) ? app.documents.join(', ') : app.documents,
      notes: app.notes || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این درخواست مطمئن هستید؟')) {
      await deleteApplication(id);
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatistics = () => {
    const total = applications.length;
    const submitted = applications.filter(app => app.status === 'submitted').length;
    const accepted = applications.filter(app => app.status === 'accepted').length;
    const inProgress = applications.filter(app => app.status === 'in-progress').length;
    
    return { total, submitted, accepted, inProgress };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-persian">
            مدیریت درخواست‌ها
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-persian">درخواست جدید</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-persian">کل درخواست‌ها</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-persian">در حال انجام</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-persian">ارسال شده</p>
              <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-persian">پذیرفته شده</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
            </div>
            <Star className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در دانشگاه‌ها و برنامه‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
            >
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-persian">
              {searchQuery || statusFilter !== 'all' 
                ? 'هیچ درخواستی با این فیلترها یافت نشد' 
                : 'هنوز درخواستی اضافه نشده است'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredApplications.map((app) => {
              const StatusIcon = statusIcons[app.status];
              const daysUntilDeadline = getDaysUntilDeadline(app.deadline);
              
              return (
                <div key={app.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
                            {app.university}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 font-persian">
                            {app.program}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                            <StatusIcon className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
                            {statusLabels[app.status]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Calendar className="w-4 h-4" />
                          <span className="font-persian">
                            ددلاین: {new Date(app.deadline).toLocaleDateString('fa-IR')}
                          </span>
                          {daysUntilDeadline >= 0 && (
                            <span className={`mr-2 rtl:ml-2 rtl:mr-0 ${
                              daysUntilDeadline <= 7 ? 'text-red-600' : 
                              daysUntilDeadline <= 30 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              ({daysUntilDeadline} روز باقی‌مانده)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {app.documents && app.documents.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 font-persian mb-1">مدارک:</p>
                          <div className="flex flex-wrap gap-1">
                            {app.documents.map((doc: string, index: number) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded font-persian"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {app.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 font-persian">
                          {app.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:mr-4 rtl:ml-0">
                      <button
                        onClick={() => handleEdit(app)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-persian mb-4">
                {editingApp ? 'ویرایش درخواست' : 'درخواست جدید'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    دانشگاه
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
                    placeholder="نام دانشگاه..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    برنامه تحصیلی
                  </label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
                    placeholder="نام برنامه تحصیلی..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    ددلاین
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    وضعیت
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                    مدارک (با کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    name="documents"
                    value={formData.documents}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
                    placeholder="CV, SOP, Transcripts, ..."
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 font-persian"
                    placeholder="یادداشت‌های اضافی..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-persian"
                  >
                    {editingApp ? 'ذخیره تغییرات' : 'افزودن درخواست'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingApp(null);
                      setFormData({
                        university: '',
                        program: '',
                        deadline: '',
                        status: 'not-started',
                        documents: '',
                        notes: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-persian"
                  >
                    لغو
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

export default Applications;