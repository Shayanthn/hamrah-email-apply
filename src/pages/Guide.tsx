import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, 
  Users, 
  Mail, 
  FileText, 
  Calendar,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Shield,
  Database,
  Clock,
  Target,
  BookOpen,
  Settings,
  Globe,
  Smartphone,
  Download,
  Heart,
  Github,
  ExternalLink,
  Linkedin
} from 'lucide-react';

const Guide: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: 'تکمیل پروفایل شخصی',
      description: 'ابتدا اطلاعات شخصی، تحصیلی و تجربیات خود را در بخش پروفایل تکمیل کنید',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      title: 'افزودن اساتید',
      description: 'اساتید مورد نظر خود را با اطلاعات کامل به دیتابیس اضافه کنید',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'ارسال ایمیل‌ها',
      description: 'ایمیل‌های معرفی خود را به اساتید ارسال کرده و وضعیت آن‌ها را پیگیری کنید',
      icon: Mail,
      color: 'bg-yellow-500'
    },
    {
      title: 'مدیریت اپلیکیشن‌ها',
      description: 'وضعیت اپلیکیشن‌های خود را ثبت کرده و مراحل آن‌ها را پیگیری کنید',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'برنامه‌ریزی زمانی',
      description: 'از تقویم برای یادآوری ددلاین‌ها و مهلت‌های مهم استفاده کنید',
      icon: Calendar,
      color: 'bg-indigo-500'
    }
  ];

  const features = [
    {
      title: 'پیگیری کامل اساتید',
      description: 'ذخیره اطلاعات کامل اساتید شامل زمینه تحقیقاتی، ایمیل و وضعیت تماس',
      icon: Users
    },
    {
      title: 'مدیریت ایمیل‌ها',
      description: 'ثبت و پیگیری تمام ایمیل‌های ارسالی به اساتید و پاسخ‌های دریافتی',
      icon: Mail
    },
    {
      title: 'آمار و گزارش',
      description: 'مشاهده آمار کامل درباره نرخ پاسخ، وضعیت اپلیکیشن‌ها و پیشرفت',
      icon: BarChart3
    },
    {
      title: 'تقویم و یادآوری',
      description: 'مدیریت ددلاین‌ها و رویدادهای مهم با سیستم تقویم پیشرفته',
      icon: Calendar
    },
    {
      title: 'ذخیره محلی',
      description: 'تمام اطلاعات شما به صورت محلی ذخیره شده و حریم خصوصی کامل دارید',
      icon: Shield
    },
    {
      title: 'رابط فارسی',
      description: 'رابط کاربری کاملاً فارسی با پشتیبانی از RTL و فونت‌های زیبای فارسی',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-persian mb-4">
          راهنمای استفاده از همراه ایمیل اپلای
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-persian max-w-3xl mx-auto">
          این راهنما به شما کمک می‌کند تا به بهترین شکل از امکانات برنامه استفاده کنید و فرآیند اپلای خود را مدیریت کنید.
        </p>
      </div>

      {/* Getting Started Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-persian mb-6">
          شروع کار
        </h2>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-persian leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-persian mb-6">
          ویژگی‌های کلیدی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 font-persian">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary-500 to-royal-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold font-persian mb-6">
          نکات مفید
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold font-persian mb-1">منظم باشید</h3>
              <p className="text-primary-100 font-persian text-sm">
                روزانه اطلاعات خود را به روزرسانی کنید و پیگیری‌های لازم را انجام دهید.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold font-persian mb-1">پشتیبان‌گیری</h3>
              <p className="text-primary-100 font-persian text-sm">
                به طور مرتب از اطلاعات خود پشتیبان‌گیری کنید تا در صورت نیاز قابل بازیابی باشد.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold font-persian mb-1">پیگیری مداوم</h3>
              <p className="text-primary-100 font-persian text-sm">
                ایمیل‌های ارسالی را پیگیری کنید و در صورت عدم پاسخ، مجدداً تماس بگیرید.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold font-persian mb-1">آمار را بررسی کنید</h3>
              <p className="text-primary-100 font-persian text-sm">
                از بخش آمار برای بررسی عملکرد خود و بهبود استراتژی اپلای استفاده کنید.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-persian mb-6">
          پشتیبانی و کمک
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              سوالات متداول
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white font-persian">
                  چگونه از اطلاعات خود پشتیبان‌گیری کنم؟
                </h4>
                <p className="text-gray-600 dark:text-gray-300 font-persian text-sm mt-1">
                  از منوی تنظیمات، گزینه "پشتیبان‌گیری" را انتخاب کنید و فایل پشتیبان را ذخیره کنید.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white font-persian">
                  آیا اطلاعات من امن است؟
                </h4>
                <p className="text-gray-600 dark:text-gray-300 font-persian text-sm mt-1">
                  بله، تمام اطلاعات به صورت محلی در دستگاه شما ذخیره می‌شود و هیچ اطلاعاتی به سرور خارجی ارسال نمی‌شود.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              تماس با سازنده
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-gray-500" />
                <a 
                  href="https://github.com/shayanthn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-persian"
                >
                  پروفایل گیت‌هاب
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-gray-500" />
                <a 
                  href="https://linkedin.com/in/shayantaherkhani78" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-persian"
                >
                  پروفایل لینکدین
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-gray-500" />
                <a 
                  href="https://shayantaherkhani.ir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-persian"
                >
                  وبسایت
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="font-persian">ساخته شده با عشق برای جامعه ایرانی</span>
        </div>
      </div>
    </div>
  );
};

export default Guide;