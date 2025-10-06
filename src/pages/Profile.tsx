import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { User, Mail, Phone, GraduationCap, Edit, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { profile, updateProfile } = useDatabase();

  const arrayToString = (value: string[] | string | undefined): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || '';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    gpa: profile?.gpa || 0,
    degree: profile?.degree || '',
    university: profile?.university || '',
    graduationYear: profile?.graduationYear || new Date().getFullYear(),
    researchInterests: arrayToString(profile?.researchInterests),
    skills: profile?.skills || '',
    experience: profile?.experience || '',
    publications: arrayToString(profile?.publications),
    awards: arrayToString(profile?.awards),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gpa' || name === 'graduationYear' ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    const profileData = {
      ...formData,
      researchInterests: formData.researchInterests.split(',').map(item => item.trim()).filter(item => item),
      publications: formData.publications.split(',').map(item => item.trim()).filter(item => item),
      awards: formData.awards.split(',').map(item => item.trim()).filter(item => item),
    };
    await updateProfile(profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      gpa: profile?.gpa || 0,
      degree: profile?.degree || '',
      university: profile?.university || '',
      graduationYear: profile?.graduationYear || new Date().getFullYear(),
      researchInterests: arrayToString(profile?.researchInterests),
      skills: profile?.skills || '',
      experience: profile?.experience || '',
      publications: arrayToString(profile?.publications),
      awards: arrayToString(profile?.awards),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-persian">
          {t('profile.title')}
        </h1>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="font-persian">{t('common.save')}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="font-persian">{t('common.cancel')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-royal-500 text-white rounded-lg hover:bg-royal-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="font-persian">{t('common.edit')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-royal-400 to-royal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('profile.firstName')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian text-center"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('profile.lastName')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian text-center"
                  />
                </div>
              ) : (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-persian">
                  {formData.firstName} {formData.lastName || 'نام کاربر'}
                </h2>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('profile.email')}
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian text-sm"
                  />
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.email || 'ایمیل وارد نشده'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('profile.phone')}
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian text-sm"
                  />
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.phone || 'تلفن وارد نشده'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-persian">
                  معدل: {formData.gpa ? formData.gpa.toFixed(2) : 'وارد نشده'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Academic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              اطلاعات تحصیلی
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                  مقطع تحصیلی
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-persian">
                    {formData.degree || 'وارد نشده'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                  دانشگاه
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-persian">
                    {formData.university || 'وارد نشده'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                  سال فارغ التحصیلی
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-persian">
                    {formData.graduationYear || 'وارد نشده'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-persian mb-1">
                  معدل کل (GPA)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-persian">
                    {formData.gpa ? formData.gpa.toFixed(2) : 'وارد نشده'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Research Interests */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              علایق تحقیقاتی
            </h3>
            {isEditing ? (
              <textarea
                name="researchInterests"
                value={formData.researchInterests}
                onChange={handleInputChange}
                placeholder="علایق تحقیقاتی خود را با کاما جدا کنید"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-persian">
                {formData.researchInterests || 'علایق تحقیقاتی وارد نشده'}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              مهارت‌ها
            </h3>
            {isEditing ? (
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="مهارت‌های خود را وارد کنید"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-persian">
                {formData.skills || 'مهارت‌ها وارد نشده'}
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              تجربه کاری
            </h3>
            {isEditing ? (
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="تجربه کاری خود را وارد کنید"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-persian">
                {formData.experience || 'تجربه کاری وارد نشده'}
              </p>
            )}
          </div>

          {/* Publications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              مقالات و انتشارات
            </h3>
            {isEditing ? (
              <textarea
                name="publications"
                value={formData.publications}
                onChange={handleInputChange}
                placeholder="مقالات و انتشارات خود را با کاما جدا کنید"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-persian">
                {formData.publications || 'مقالات وارد نشده'}
              </p>
            )}
          </div>

          {/* Awards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-persian mb-4">
              جوایز و افتخارات
            </h3>
            {isEditing ? (
              <textarea
                name="awards"
                value={formData.awards}
                onChange={handleInputChange}
                placeholder="جوایز و افتخارات خود را با کاما جدا کنید"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-persian"
              />
            ) : (
              <p className="text-gray-900 dark:text-white font-persian">
                {formData.awards || 'جوایز وارد نشده'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;