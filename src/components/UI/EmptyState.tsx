import React from 'react';
import { Plus, Search, FolderOpen, Inbox, Calendar, Users, Mail, FileText, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'professors' | 'emails' | 'applications' | 'calendar' | 'search' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const getDefaultContent = (type: string) => {
  const defaults = {
    professors: {
      icon: <Users className="w-20 h-20" />,
      title: 'هنوز استادی اضافه نکرده‌اید',
      description: 'با افزودن اساتید، می‌توانید اطلاعات تماس و زمینه تحقیقاتی آن‌ها را مدیریت کنید.',
      actionLabel: 'افزودن استاد اول',
    },
    emails: {
      icon: <Mail className="w-20 h-20" />,
      title: 'هیچ ایمیلی ثبت نشده است',
      description: 'ایمیل‌های ارسالی به اساتید را اینجا پیگیری کنید و از وضعیت آن‌ها مطلع شوید.',
      actionLabel: 'ثبت ایمیل اول',
    },
    applications: {
      icon: <FileText className="w-20 h-20" />,
      title: 'لیست درخواست‌ها خالی است',
      description: 'درخواست‌های خود را ثبت کنید و فرآیند اپلای را به صورت منظم پیگیری کنید.',
      actionLabel: 'ثبت درخواست اول',
    },
    calendar: {
      icon: <Calendar className="w-20 h-20" />,
      title: 'هیچ یادآوری ثبت نشده',
      description: 'برای مدیریت بهتر زمان، ددلاین‌ها و یادآورهای مهم خود را اضافه کنید.',
      actionLabel: 'افزودن یادآوری',
    },
    search: {
      icon: <Search className="w-20 h-20" />,
      title: 'نتیجه‌ای یافت نشد',
      description: 'متأسفانه موردی مطابق با جستجوی شما پیدا نشد. لطفاً کلمات دیگری امتحان کنید.',
      actionLabel: 'پاک کردن جستجو',
    },
    generic: {
      icon: <FolderOpen className="w-20 h-20" />,
      title: 'هیچ داده‌ای موجود نیست',
      description: 'برای شروع، اطلاعات خود را اضافه کنید.',
      actionLabel: 'شروع کنید',
    },
  };

  return defaults[type as keyof typeof defaults] || defaults.generic;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  const defaults = getDefaultContent(type);
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-6 text-gray-300 dark:text-gray-600 opacity-50">
        {icon || defaults.icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3 font-persian">
        {title || defaults.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md font-persian leading-relaxed">
        {description || defaults.description}
      </p>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-persian font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>{actionLabel || defaults.actionLabel}</span>
        </button>
      )}

      {/* Decorative elements */}
      <div className="mt-12 flex gap-4 opacity-20">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

// Specialized empty states
export const NoResultsState: React.FC<{ searchQuery: string; onClear: () => void }> = ({
  searchQuery,
  onClear,
}) => (
  <EmptyState
    type="search"
    title={`نتیجه‌ای برای "${searchQuery}" یافت نشد`}
    description="با تغییر کلمات جستجو یا فیلترها مجدداً تلاش کنید."
    actionLabel="پاک کردن جستجو"
    onAction={onClear}
  />
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <EmptyState
    icon={<AlertCircle className="w-20 h-20" />}
    title="مشکلی پیش آمده است"
    description={message || 'لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.'}
    actionLabel="تلاش مجدد"
    onAction={onRetry}
  />
);

export default EmptyState;
