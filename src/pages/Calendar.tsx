import React, { useState, useEffect } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar as CalendarIcon, Clock, AlertCircle, Plus, X, Edit2, Check } from 'lucide-react';
import type { Application } from '../utils/database';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'reminder' | 'meeting';
  description?: string;
  applicationId?: string;
  completed: boolean;
}

const Calendar: React.FC = () => {
  const { applications, getStatistics } = useDatabase();
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'reminder' as 'deadline' | 'reminder' | 'meeting',
    description: ''
  });

  // Convert applications to calendar events
  useEffect(() => {
    const deadlineEvents: CalendarEvent[] = applications.map(app => ({
      id: `deadline-${app.id}`,
      title: `${app.university} - ${app.program}`,
      date: app.deadline,
      type: 'deadline',
      description: `ددلاین درخواست برای ${app.program}`,
      applicationId: app.id,
      completed: app.status === 'submitted' || app.status === 'accepted'
    }));

    // Load custom events from localStorage
    const customEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
    
    setEvents([...deadlineEvents, ...customEvents]);
  }, [applications]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: CalendarEvent = {
      id: `custom-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type,
      description: newEvent.description,
      completed: false
    };

    const customEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
    customEvents.push(event);
    localStorage.setItem('calendar_events', JSON.stringify(customEvents));

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: '', date: '', type: 'reminder', description: '' });
    setShowAddEvent(false);
  };

  const toggleEventCompletion = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));

    // Update localStorage for custom events
    if (eventId.startsWith('custom-')) {
      const customEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
      const updatedEvents = customEvents.map((event: CalendarEvent) => 
        event.id === eventId ? { ...event, completed: !event.completed } : event
      );
      localStorage.setItem('calendar_events', JSON.stringify(updatedEvents));
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events
      .filter(event => new Date(event.date) >= today && !event.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const stats = getStatistics();
  const upcomingEvents = getUpcomingEvents();

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const hasEvents = dayEvents.length > 0;

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          {hasEvents && (
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 2).map(event => (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded truncate ${
                    event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  } ${event.completed ? 'opacity-50 line-through' : ''}`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{dayEvents.length - 2} بیشتر
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            تقویم و یادآوری‌ها
          </h1>
        </div>
        <button
          onClick={() => setShowAddEvent(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن یادآوری</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentDate.toLocaleDateString('fa-IR', {
                  year: 'numeric',
                  month: 'long'
                })}
              </h2>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={prevMonth}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  ←
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
                <div key={day} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                  {day}
                </div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              رویدادهای پیش رو
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                رویداد آینده‌ای وجود ندارد
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        event.type === 'deadline' ? 'bg-red-500' :
                        event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {event.title}
                        </h4>
                        <button
                          onClick={() => toggleEventCompletion(event.id)}
                          className="text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        >
                          {event.completed ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(event.date).toLocaleDateString('fa-IR')}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                      {event.type === 'deadline' ? 'ددلاین' :
                       event.type === 'meeting' ? 'ملاقات' :
                       'یادآوری'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              آمار
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  کل درخواست‌ها:
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stats.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ارسال شده:
                </span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {stats.submitted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  در حال انجام:
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {stats.inProgress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  یادآوری‌های فعال:
                </span>
                <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {upcomingEvents.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                افزودن یادآوری جدید
              </h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  عنوان
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="عنوان یادآوری..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  تاریخ
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نوع
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="reminder">یادآوری</option>
                  <option value="meeting">ملاقات</option>
                  <option value="deadline">ددلاین</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  توضیحات
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="توضیحات اضافی..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 rtl:space-x-reverse mt-6">
              <button
                onClick={addEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                افزودن
              </button>
              <button
                onClick={() => setShowAddEvent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedDate.toLocaleDateString('fa-IR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  رویدادی برای این روز وجود ندارد
                </p>
              ) : (
                getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        event.type === 'deadline' ? 'bg-red-500' :
                        event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${event.completed ? 'line-through opacity-50' : ''}`}>
                          {event.title}
                        </h4>
                        <button
                          onClick={() => toggleEventCompletion(event.id)}
                          className="text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        >
                          {event.completed ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded" />}
                        </button>
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      event.type === 'deadline' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    }`}>
                      {event.type === 'deadline' ? 'ددلاین' :
                       event.type === 'meeting' ? 'ملاقات' :
                       'یادآوری'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;