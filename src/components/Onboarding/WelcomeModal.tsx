import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Star, 
  Github, 
  MessageSquare, 
  Mail, 
  GraduationCap,
  Users,
  Database,
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '👋 به همراه ایمیل اپلای خوش آمدید!',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-persian leading-relaxed">
              این برنامه کاملاً <strong>رایگان</strong> و <strong>آفلاین</strong> است و برای کمک به دانشجویان ایرانی 
              در مدیریت فرآیند اپلای تحصیلات تکمیلی طراحی شده است. 🎓
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-persian text-sm">
              💡 تمام اطلاعات شما روی دستگاه خودتان ذخیره می‌شود و هیچ‌گاه به اینترنت ارسال نمی‌شود!
            </p>
          </div>
        </div>
      )
    },
    {
      title: '✨ ویژگی‌های کلیدی',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Users className="w-6 h-6 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-persian">مدیریت پروفایل استاد</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-persian">
                  ذخیره اطلاعات اساتید، تخصص‌ها و اطلاعات تماس
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Mail className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-persian">پیگیری ایمیل‌ها</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-persian">
                  ثبت و دسته‌بندی ایمیل‌های ارسالی و دریافتی
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <GraduationCap className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-persian">مدیریت درخواست‌ها</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-persian">
                  پیگیری وضعیت درخواست‌ها و ددلاین‌ها
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Shield className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white font-persian">امنیت و حریم خصوصی</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-persian">
                  اطلاعات شما کاملاً محلی و ایمن ذخیره می‌شود
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '🚀 نحوه شروع',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="font-persian text-gray-800 dark:text-gray-200">
                ابتدا پروفایل شخصی خود را تکمیل کنید
              </span>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="font-persian text-gray-800 dark:text-gray-200">
                اطلاعات اساتید مورد نظر را اضافه کنید
              </span>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="font-persian text-gray-800 dark:text-gray-200">
                شروع به ثبت ایمیل‌ها و پیگیری پاسخ‌ها کنید
              </span>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="font-persian text-gray-800 dark:text-gray-200">
                درخواست‌های خود را اضافه و مدیریت کنید
              </span>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-persian text-sm">
              💡 <strong>نکته:</strong> همه‌چیز به صورت خودکار ذخیره می‌شود و نیازی به نگرانی از دست رفتن اطلاعات نیست!
            </p>
          </div>
        </div>
      )
    },
    {
      title: '👨‍💻 درباره سازنده',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-white font-bold">🧑‍💻</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-2">
              سلام! من توسعه‌دهنده این برنامه هستم 👋
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-persian leading-relaxed">
              این پروژه با ❤️ و امید به کمک به همه دانشجویان ایرانی ساخته شده است.
              اگر این برنامه به شما کمک کرد، می‌تونید:
            </p>
          </div>
          
          <div className="space-y-3">
            <a
              href="https://github.com/username/applyhelper"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 rtl:space-x-reverse p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="font-persian">⭐ به پروژه در گیت‌هاب ستاره بدید</span>
            </a>
            
            <button
              onClick={() => {
                // Open GitHub issues page
                if ((window as any).electron?.openExternal) {
                  (window as any).electron.openExternal('https://github.com/username/applyhelper/issues');
                } else {
                  window.open('https://github.com/username/applyhelper/issues', '_blank');
                }
              }}
              className="flex items-center justify-center space-x-3 rtl:space-x-reverse p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-persian">🐛 مشکل یا پیشنهاد گزارش کنید</span>
            </button>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 font-persian text-sm text-center">
              🙏 حمایت شما انگیزه من برای بهبود این برنامه است!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-persian">
              راهنمای شروع
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-persian mb-2">
            <span>قدم {currentStep + 1} از {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-persian mb-6 text-center">
            {steps[currentStep].title}
          </h3>
          <div className="text-gray-600 dark:text-gray-300">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-colors font-persian ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>قبلی</span>
          </button>

          <div className="flex space-x-2 rtl:space-x-reverse">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleClose}
              className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-persian"
            >
              <Heart className="w-4 h-4" />
              <span>شروع کنیم! 🚀</span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-persian"
            >
              <span>بعدی</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;