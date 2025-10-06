import React, { useState, useMemo } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import type { Email } from '../utils/database';
import { 
  Plus, 
  Search, 
  Mail, 
  Send, 
  FileText, 
  AlertTriangle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

type EmailStatus = Email['status'];
type EmailResponseType = Exclude<Email['responseType'], undefined>;

const Emails: React.FC = () => {
  const { emails, professors, addEmail, updateEmail, deleteEmail, loading } = useDatabase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EmailStatus>('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingEmail, setEditingEmail] = useState<Email | null>(null);
  const [formData, setFormData] = useState({
    professorId: '',
    subject: '',
    content: '',
    sentDate: new Date().toISOString().split('T')[0],
    status: 'draft' as EmailStatus,
    responseDate: '',
    responseType: 'neutral' as EmailResponseType,
    notes: ''
  });

  const toISODate = (date?: string) => {
    if (!date) {
      return new Date().toISOString();
    }
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  };

  const resetForm = () => {
    setFormData({
      professorId: professors[0]?.id || '',
      subject: '',
      content: '',
      sentDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      responseDate: '',
      responseType: 'neutral',
      notes: ''
    });
    setEditingEmail(null);
  };

  const handleOpenModal = (email?: Email) => {
    if (email) {
      setEditingEmail(email);
      setFormData({
        professorId: email.professorId,
        subject: email.subject,
        content: email.content,
        sentDate: email.sentDate ? email.sentDate.split('T')[0] : new Date().toISOString().split('T')[0],
        status: email.status,
        responseDate: email.responseDate ? email.responseDate.split('T')[0] : '',
        responseType: (email.responseType || 'neutral') as EmailResponseType,
        notes: email.notes || ''
      });
    } else {
      resetForm();
    }
    setShowEmailModal(true);
  };

  const handleCloseModal = () => {
    setShowEmailModal(false);
    resetForm();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      if (field === 'status') {
        const newStatus = value as EmailStatus;
        return {
          ...prev,
          status: newStatus,
          responseDate: newStatus === 'replied' ? prev.responseDate : '',
          responseType: newStatus === 'replied' ? prev.responseType : 'neutral'
        };
      }

      if (field === 'responseType') {
        return {
          ...prev,
          responseType: value as EmailResponseType
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.professorId || !formData.subject.trim() || !formData.content.trim()) {
      return;
    }

    const payload = {
      professorId: formData.professorId,
      subject: formData.subject.trim(),
      content: formData.content.trim(),
      sentDate: toISODate(formData.sentDate),
      status: formData.status,
      responseDate: formData.responseDate ? toISODate(formData.responseDate) : undefined,
      responseType: formData.status === 'replied' ? formData.responseType : undefined,
      notes: formData.notes?.trim() ? formData.notes.trim() : undefined
    };

    if (editingEmail) {
      await updateEmail(editingEmail.id, payload);
    } else {
      await addEmail(payload);
    }

    handleCloseModal();
  };

  const isSubmitDisabled = useMemo(() => {
    return (
      !formData.professorId ||
      !formData.subject.trim() ||
      !formData.content.trim() ||
      (formData.status === 'replied' && !formData.responseType)
    );
  }, [formData]);

  const getStatusText = (status: Email['status']) => {
    switch(status) {
      case 'sent': return 'ارسال شده';
      case 'replied': return 'پاسخ داده شده';
      case 'draft': return 'پیش‌نویس';
      case 'bounced': return 'برگشت خورده';
      default: return status;
    }
  };

  const getStatusColor = (status: Email['status']) => {
    switch(status) {
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'bounced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredEmails = emails.filter((email: Email) => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProfessorName = (professorId: string) => {
    const professor = professors.find((p: any) => p.id === professorId);
    return professor ? professor.name : 'نامشخص';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-persian">
          مدیریت ایمیل‌ها
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>ایمیل جدید</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-persian">
                کل ایمیل‌ها
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-persian">
                پاسخ داده شده
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter((e: Email) => e.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-persian">
                ارسال شده
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter((e: Email) => e.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 font-persian">
                پیش‌نویس
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {emails.filter((e: Email) => e.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در ایمیل‌ها..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="sent">ارسال شده</option>
            <option value="replied">پاسخ داده شده</option>
            <option value="bounced">برگشت خورده</option>
          </select>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-persian">
                  استاد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-persian">
                  موضوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-persian">
                  تاریخ ارسال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-persian">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider font-persian">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmails.map((email: Email) => (
                <tr key={email.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white font-persian">
                      {getProfessorName(email.professorId)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white font-persian">
                      {email.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                      {new Date(email.sentDate || email.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-persian ${getStatusColor(email.status)}`}>
                      {getStatusText(email.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(email)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEmail(email.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white font-persian">
              ایمیلی یافت نشد
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-persian">
              {searchTerm || statusFilter !== 'all' 
                ? 'با فیلترهای انتخاب شده ایمیلی پیدا نشد.'
                : 'شروع کنید با ایجاد اولین ایمیل خود.'
              }
            </p>
          </div>
        )}
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
                  {editingEmail ? 'ویرایش ایمیل' : 'ایمیل جدید'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-persian mt-1">
                  {editingEmail ? 'جزئیات ایمیل انتخاب‌شده را به‌روزرسانی کنید.' : 'ایمیل جدیدی برای یکی از اساتید بسازید.'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    انتخاب استاد
                  </label>
                  <select
                    value={formData.professorId}
                    onChange={(event) => handleChange('professorId', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                  >
                    {professors.length === 0 && (
                      <option value="" disabled>
                        استادی ثبت نشده است
                      </option>
                    )}
                    {professors.map((professor) => (
                      <option key={professor.id} value={professor.id}>
                        {professor.name} • {professor.university}
                      </option>
                    ))}
                  </select>
                  {professors.length === 0 && (
                    <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-amber-600 dark:text-amber-300 font-persian text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      برای ایجاد ایمیل ابتدا یک استاد ثبت کنید.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    وضعیت ایمیل
                  </label>
                  <select
                    value={formData.status}
                    onChange={(event) => handleChange('status', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="sent">ارسال شده</option>
                    <option value="replied">پاسخ داده شده</option>
                    <option value="bounced">برگشت خورده</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    تاریخ ارسال
                  </label>
                  <input
                    type="date"
                    value={formData.sentDate}
                    onChange={(event) => handleChange('sentDate', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                  />
                </div>

                {formData.status === 'replied' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                      تاریخ پاسخ
                    </label>
                    <input
                      type="date"
                      value={formData.responseDate}
                      onChange={(event) => handleChange('responseDate', event.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                  موضوع ایمیل
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(event) => handleChange('subject', event.target.value)}
                  placeholder="موضوع ایمیل را وارد کنید"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                  متن ایمیل
                </label>
                <textarea
                  value={formData.content}
                  onChange={(event) => handleChange('content', event.target.value)}
                  rows={6}
                  placeholder="متن ایمیل را بنویسید"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                />
              </div>

              {formData.status === 'replied' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                    نوع پاسخ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'positive', label: 'پاسخ مثبت' },
                      { value: 'neutral', label: 'پاسخ خنثی' },
                      { value: 'negative', label: 'پاسخ منفی' }
                    ].map(option => (
                      <label
                        key={option.value}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-colors font-persian text-sm ${
                          formData.responseType === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-200'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        <input
                          type="radio"
                          name="responseType"
                          value={option.value}
                          checked={formData.responseType === option.value}
                          onChange={(event) => handleChange('responseType', event.target.value)}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-persian">
                  یادداشت‌ها (اختیاری)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                  rows={3}
                  placeholder="نکات مهم یا پیگیری‌های آینده را یادداشت کنید"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-3 text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-persian"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitDisabled || loading || professors.length === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors font-persian ${
                    isSubmitDisabled || loading || professors.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {editingEmail ? 'ذخیره تغییرات' : 'ثبت ایمیل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emails;