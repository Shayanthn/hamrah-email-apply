import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getAppName } from '../../utils/copyright';
import { 
  Home, 
  User, 
  Users, 
  Mail, 
  FileText, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Crown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();

  const menuItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/profile', icon: User, label: t('nav.profile') },
    { path: '/professors', icon: Users, label: t('nav.professors') },
    { path: '/emails', icon: Mail, label: t('nav.emails') },
    { path: '/applications', icon: FileText, label: t('nav.applications') },
    { path: '/calendar', icon: Calendar, label: t('nav.calendar') },
    { path: '/guide', icon: BookOpen, label: t('nav.guide') },
    { path: '/premium', icon: Crown, label: 'پریمیوم', isPremium: true },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  const ChevronIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div className={`${
      isOpen ? 'w-64' : 'w-16'
    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white font-persian">
                {getAppName()}
              </span>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item: any) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.isPremium
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                        : isActive
                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium font-persian text-sm">
                      {item.label}
                    </span>
                  )}
                  {item.isPremium && isOpen && (
                    <span className="mr-auto bg-white/30 px-2 py-0.5 rounded-full text-xs">
                      AI
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-persian">
            نسخه 1.0.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;