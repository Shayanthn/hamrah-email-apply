import React, { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDeveloperInfo, getAppName } from '../utils/copyright';
import { Settings as SettingsIcon, Moon, Sun, Database, Heart, Github, Linkedin, ExternalLink } from 'lucide-react';
import { backupManager } from '../utils/backupManager';
import { useDatabase } from '../contexts/DatabaseContext';

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { refreshData } = useDatabase();
  const developerInfo = getDeveloperInfo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBackupClick = async () => {
    if (processing) return;
    setProcessing(true);
    setFeedback(null);

    try {
      const backupName = prompt('نام پشتیبان را وارد کنید:', `پشتیبان ${new Date().toLocaleDateString('fa-IR')}`) || undefined;
      const result = await backupManager.createBackup(backupName || '', 'پشتیبان ایجاد شده به صورت دستی');

      if (!result.success || !result.id) {
        throw new Error(result.error || 'ایجاد پشتیبان ناموفق بود');
      }

      const exportResult = await backupManager.exportBackupToFile(result.id);

      if (!exportResult.success || !exportResult.data || !exportResult.filename) {
        throw new Error(exportResult.error || 'دریافت فایل پشتیبان ناموفق بود');
      }

      const blob = new Blob([exportResult.data], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportResult.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedback({ type: 'success', message: 'پشتیبان با موفقیت ایجاد و دانلود شد.' });
    } catch (error: any) {
      setFeedback({ type: 'error', message: error?.message || 'در ایجاد پشتیبان خطایی رخ داد.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRestoreClick = () => {
    if (processing) return;
    setFeedback(null);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setProcessing(true);
    setFeedback(null);

    try {
      const fileContent = await file.text();
      const importResult = await backupManager.importBackupFromFile(fileContent, file.name);

      if (!importResult.success || !importResult.id) {
        throw new Error(importResult.error || 'ورود پشتیبان ناموفق بود');
      }

      const restoreResult = await backupManager.restoreFromBackup(importResult.id);

      if (!restoreResult.success) {
        throw new Error(restoreResult.error || 'بازیابی پشتیبان ناموفق بود');
      }

      refreshData();
      setFeedback({ type: 'success', message: 'پشتیبان با موفقیت بازیابی شد.' });
    } catch (error: any) {
      setFeedback({ type: 'error', message: error?.message || 'در بازیابی پشتیبان خطایی رخ داد.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-persian">
        {t('nav.settings')}
      </h1>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
            {t('settings.appearance')}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-gray-500" />
              ) : (
                <Sun className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white font-persian">
                  {t('settings.darkMode')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                  {t('settings.darkModeDesc')}
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
            تنظیمات برنامه
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white font-persian">
                نمایش مجدد راهنمای شروع
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                راهنمای خوش‌آمدگویی را دوباره نمایش بده
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('hasSeenWelcome');
                setFeedback({ type: 'success', message: 'راهنما در دفعه بعدی نمایش داده خواهد شد.' });
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-persian"
            >
              نمایش راهنما
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
            {t('settings.data')}
          </h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white font-persian">
                {t('settings.backup')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('settings.backupDesc')}
              </div>
            </div>
            <button
              onClick={handleBackupClick}
              disabled={processing}
              className={`px-4 py-2 rounded-lg text-white transition-colors font-persian ${
                processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {t('settings.backup')}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white font-persian">
                {t('settings.restore')}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-persian">
                {t('settings.restoreDesc')}
              </div>
            </div>
            <button
              onClick={handleRestoreClick}
              disabled={processing}
              className={`px-4 py-2 rounded-lg text-white transition-colors font-persian ${
                processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-success-500 hover:bg-success-600'
              }`}
            >
              {t('settings.restore')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileSelected}
            />
          </div>

          {feedback && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-persian ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                  : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-200'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian">
            {t('settings.about')}
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-royal-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900 dark:text-white font-persian">
                همراه ایمیل اپلای
              </div>
              <div className="text-gray-500 dark:text-gray-400 font-persian">
                {t('settings.version')} 1.0.0
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-persian mt-2">
                {t('settings.description')}
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-gradient-to-r from-royal-500 to-primary-600 rounded-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-300" />
              <h4 className="text-lg font-semibold font-persian">
                سازنده برنامه
              </h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-xl font-bold font-persian mb-2">
                  {developerInfo.name}
                </h5>
                <p className="text-primary-100 font-persian leading-relaxed">
                  این برنامه با عشق و علاقه برای جامعه ایرانی و مخصوصاً دانشجویان عزیز طراحی و توسعه داده شده است. کاملاً رایگان و متن‌باز.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <a 
                  href={developerInfo.website}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-persian text-sm">وبسایت</span>
                </a>
                <a 
                  href={developerInfo.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="font-persian text-sm">GitHub</span>
                </a>
                <a 
                  href={developerInfo.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="font-persian text-sm">LinkedIn</span>
                </a>
                <a 
                  href={`mailto:${developerInfo.email}`}
                  className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-persian text-sm">ایمیل</span>
                </a>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              ویژگی‌های برنامه
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 font-persian">
              <li>• مدیریت کامل پروفایل دانشجویی</li>
              <li>• دیتابیس جامع اساتید</li>
              <li>• پیگیری ایمیل‌ها و پاسخ‌ها</li>
              <li>• مدیریت درخواست‌های اپلای</li>
              <li>• تقویم و سیستم یادآوری</li>
              <li>• آمار و گزارش‌گیری کامل</li>
              <li>• رابط کاربری فارسی</li>
              <li>• ذخیره محلی و حفظ حریم خصوصی</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;