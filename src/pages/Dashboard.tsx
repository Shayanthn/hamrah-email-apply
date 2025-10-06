import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  Users,
  BarChart3,
  Calendar,
  TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { professors, emails, applications } = useDatabase();
  const navigate = useNavigate();

  // Calculate statistics
  const stats = {
    totalEmails: emails.length,
    totalProfessors: professors.length,
    responses: emails.filter(email => email.status === 'replied').length,
    pending: emails.filter(email => email.status === 'sent').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
  };

  const responseRate = stats.totalEmails > 0 ? (stats.responses / stats.totalEmails * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-royal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold font-persian mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-primary-100 font-persian">
          خوش آمدید! وضعیت اپلای‌های خود را مدیریت کنید
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('dashboard.totalEmails')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalEmails}
              </p>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
              <Mail className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('dashboard.responses')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.responses}
              </p>
              <p className="text-xs text-primary-500 font-persian">
                {responseRate}% نرخ پاسخ
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('dashboard.pending')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('dashboard.accepted')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.accepted}
              </p>
            </div>
            <div className="p-3 bg-royal-50 dark:bg-royal-900/50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-royal-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Emails */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
              آخرین ایمیل‌ها
            </h3>
          </div>
          <div className="p-6">
            {emails.slice(0, 5).map((email) => {
              const professor = professors.find(p => p.id === email.professorId);
              return (
                <div key={email.id} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    email.status === 'replied' ? 'bg-green-500' : 
                    email.status === 'sent' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white font-persian truncate">
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-persian">
                      {professor?.name} - {professor?.university}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(email.sentDate).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              );
            })}
            {emails.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-persian">
                هنوز ایمیلی ارسال نکرده‌اید
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
              اقدامات سریع
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={() => navigate('/professors')}
              className="w-full flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors"
            >
              <Users className="w-5 h-5 text-primary-500" />
              <div className="text-right">
                <div className="text-sm font-medium text-primary-700 dark:text-primary-300 font-persian">
                  افزودن استاد جدید
                </div>
                <div className="text-xs text-primary-500 font-persian">
                  استاد جدید به دیتابیس اضافه کنید
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/emails')}
              className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/70 transition-colors"
            >
              <Mail className="w-5 h-5 text-green-500" />
              <div className="text-right">
                <div className="text-sm font-medium text-green-700 dark:text-green-300 font-persian">
                  ارسال ایمیل جدید
                </div>
                <div className="text-xs text-green-500 font-persian">
                  ایمیل جدید به اساتید ارسال کنید
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/applications')}
              className="w-full flex items-center gap-3 p-4 bg-royal-50 dark:bg-royal-900/50 border border-royal-200 dark:border-royal-800 rounded-lg hover:bg-royal-100 dark:hover:bg-royal-900/70 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-royal-500" />
              <div className="text-right">
                <div className="text-sm font-medium text-royal-700 dark:text-royal-300 font-persian">
                  مشاهده گزارش‌ها
                </div>
                <div className="text-xs text-royal-500 font-persian">
                  آمار و گزارش کامل اپلای‌ها
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
          پیشرفت کلی اپلای
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {responseRate}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
              نرخ پاسخ‌گویی
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalProfessors}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
              تعداد اساتید
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-royal-100 dark:bg-royal-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-royal-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
              درخواست‌های فعال
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;