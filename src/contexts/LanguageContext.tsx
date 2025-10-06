import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys - Persian Only
const translations = {
  // Navigation
  'nav.dashboard': 'داشبورد',
  'nav.profile': 'پروفایل',
  'nav.professors': 'اساتید',
  'nav.emails': 'ایمیل‌ها',
  'nav.applications': 'درخواست‌ها',
  'nav.calendar': 'تقویم',
  'nav.guide': 'راهنما',
  'nav.settings': 'تنظیمات',
  
  // Dashboard
  'dashboard.title': 'داشبورد همراه ایمیل اپلای',
  'dashboard.totalEmails': 'کل ایمیل‌ها',
  'dashboard.responses': 'پاسخ‌ها',
  'dashboard.pending': 'در انتظار',
  'dashboard.accepted': 'قبول شده',
  
  // Common
  'common.save': 'ذخیره',
  'common.cancel': 'لغو',
  'common.edit': 'ویرایش',
  'common.delete': 'حذف',
  'common.add': 'افزودن',
  'common.search': 'جستجو',
  'common.filter': 'فیلتر',
  'common.export': 'خروجی',
  
  // Settings
  'settings.appearance': 'تنظیمات ظاهری',
  'settings.darkMode': 'حالت تیره',
  'settings.darkModeDesc': 'تغییر ظاهر برنامه به حالت تیره یا روشن',
  'settings.language': 'تنظیمات زبان',
  'settings.languageDesc': 'زبان برنامه به صورت فارسی',
  'settings.data': 'مدیریت داده‌ها',
  'settings.backup': 'پشتیبان‌گیری',
  'settings.backupDesc': 'تهیه نسخه پشتیبان از اطلاعات',
  'settings.restore': 'بازیابی داده‌ها',
  'settings.restoreDesc': 'بازیابی اطلاعات از فایل پشتیبان',
  'settings.about': 'درباره برنامه',
  'settings.version': 'نسخه',
  'settings.description': 'همراه ایمیل اپلای - مدیریت درخواست‌های تحصیلات تکمیلی بین‌المللی',
  'settings.developer': 'سازنده برنامه',
  'settings.features': 'ویژگی‌های برنامه',
  
  // Profile
  'profile.title': 'پروفایل شخصی',
  'profile.firstName': 'نام',
  'profile.lastName': 'نام خانوادگی',
  'profile.email': 'ایمیل',
  'profile.phone': 'تلفن',
  'profile.education': 'تحصیلات',
  'profile.gpa': 'معدل',
  'profile.research': 'علاقه‌مندی‌های تحقیقاتی',
  
  // Professors
  'professors.title': 'مدیریت اساتید',
  'professors.addNew': 'افزودن استاد جدید',
  'professors.name': 'نام استاد',
  'professors.university': 'دانشگاه',
  'professors.department': 'دانشکده',
  'professors.email': 'ایمیل',
  'professors.research': 'زمینه تحقیقاتی',
  'professors.status': 'وضعیت',
  
  // Emails
  'emails.title': 'مدیریت ایمیل‌ها',
  'emails.compose': 'نوشتن ایمیل',
  'emails.sentDate': 'تاریخ ارسال',
  'emails.subject': 'موضوع',
  'emails.status': 'وضعیت',
  'emails.response': 'پاسخ',
  
  // Applications
  'applications.title': 'مدیریت درخواست‌ها',
  'applications.university': 'دانشگاه',
  'applications.program': 'رشته تحصیلی',
  'applications.deadline': 'مهلت ارسال',
  'applications.status': 'وضعیت',
  
  // Calendar
  'calendar.title': 'تقویم مهلت‌ها',
  'calendar.events': 'رویدادها',
  'calendar.deadline': 'مهلت',
  'calendar.reminder': 'یادآوری',
  
  // Guide
  'guide.title': 'راهنمای استفاده',
  'guide.gettingStarted': 'شروع کار',
  'guide.features': 'ویژگی‌ها',
  'guide.tips': 'نکات مفید',
  
  // Status
  'status.pending': 'در انتظار',
  'status.responded': 'پاسخ داده',
  'status.accepted': 'قبول',
  'status.rejected': 'رد',
  'status.interview': 'مصاحبه',
  'status.notContacted': 'تماس نگرفته',
  'status.contacted': 'تماس گرفته',
  'status.draft': 'پیش‌نویس',
  'status.sent': 'ارسال شده',
  'status.replied': 'پاسخ داده شده',
  'status.bounced': 'برگشت خورده',
  'status.notStarted': 'شروع نشده',
  'status.inProgress': 'در حال انجام',
  'status.submitted': 'ارسال شده',
  'status.waitlisted': 'در لیست انتظار'
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  useEffect(() => {
    // Set Persian as default and only language
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'fa';
  }, []);

  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  const isRTL = true; // Always RTL for Persian

  return (
    <LanguageContext.Provider value={{ t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};