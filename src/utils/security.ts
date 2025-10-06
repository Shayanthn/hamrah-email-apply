// Security and Validation Utilities
// سیستم امنیتی و اعتبارسنجی ورودی‌ها

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Persian/Iranian phone number validation
  const iranPhoneRegex = /^(\+98|0)?9\d{9}$/;
  return iranPhoneRegex.test(phone.replace(/\s|-/g, ''));
};

export const validateURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Input sanitization
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove potential HTML tags and dangerous characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 10000); // Limit length to prevent memory issues
};

export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// SQL Injection prevention (even though we use localStorage)
export const sanitizeForQuery = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/['"`;\\]/g, '') // Remove SQL special characters
    .replace(/\s*(OR|AND|DROP|DELETE|INSERT|UPDATE|SELECT|UNION|EXEC|EXECUTE)\s*/gi, '')
    .trim();
};

// Data validation for complex objects
export const validateProfessorData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('نام استاد باید حداقل 2 کاراکتر باشد');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('ایمیل معتبر نیست');
  }
  
  if (!data.university || typeof data.university !== 'string' || data.university.trim().length < 2) {
    errors.push('نام دانشگاه باید حداقل 2 کاراکتر باشد');
  }
  
  if (!data.department || typeof data.department !== 'string' || data.department.trim().length < 2) {
    errors.push('نام دانشکده باید حداقل 2 کاراکتر باشد');
  }
  
  if (!data.researchArea || typeof data.researchArea !== 'string' || data.researchArea.trim().length < 2) {
    errors.push('حوزه تحقیقاتی باید حداقل 2 کاراکتر باشد');
  }
  
  return errors;
};

export const validateApplicationData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.university || typeof data.university !== 'string' || data.university.trim().length < 2) {
    errors.push('نام دانشگاه باید حداقل 2 کاراکتر باشد');
  }
  
  if (!data.program || typeof data.program !== 'string' || data.program.trim().length < 2) {
    errors.push('نام برنامه تحصیلی باید حداقل 2 کاراکتر باشد');
  }
  
  if (!data.deadline || !validateDate(data.deadline)) {
    errors.push('تاریخ ددلاین معتبر نیست');
  }
  
  const now = new Date();
  const deadline = new Date(data.deadline);
  if (deadline < now) {
    errors.push('تاریخ ددلاین نمی‌تواند در گذشته باشد');
  }
  
  return errors;
};

export const validateEmailData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length < 1) {
    errors.push('موضوع ایمیل الزامی است');
  }
  
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 10) {
    errors.push('متن ایمیل باید حداقل 10 کاراکتر باشد');
  }
  
  return errors;
};

// Security utilities
export const isValidJSONString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const secureStorageSet = (key: string, value: any): boolean => {
  try {
    const sanitizedKey = sanitizeText(key);
    const jsonValue = JSON.stringify(value);
    
    // Check storage quota (approximate)
    const estimatedSize = jsonValue.length;
    if (estimatedSize > 5 * 1024 * 1024) { // 5MB limit
      console.warn('Data size too large for localStorage');
      return false;
    }
    
    localStorage.setItem(sanitizedKey, jsonValue);
    return true;
  } catch (error) {
    console.error('Failed to store data:', error);
    return false;
  }
};

export const secureStorageGet = (key: string): any => {
  try {
    const sanitizedKey = sanitizeText(key);
    const value = localStorage.getItem(sanitizedKey);
    
    if (value === null) return null;
    
    if (!isValidJSONString(value)) {
      console.warn('Invalid JSON data in storage');
      return null;
    }
    
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return null;
  }
};

// Rate limiting for actions (prevents spam)
const actionTimestamps: { [key: string]: number[] } = {};

export const isRateLimited = (action: string, maxRequests: number = 10, timeWindow: number = 60000): boolean => {
  const now = Date.now();
  
  if (!actionTimestamps[action]) {
    actionTimestamps[action] = [];
  }
  
  // Remove old timestamps
  actionTimestamps[action] = actionTimestamps[action].filter(
    timestamp => now - timestamp < timeWindow
  );
  
  if (actionTimestamps[action].length >= maxRequests) {
    return true; // Rate limited
  }
  
  actionTimestamps[action].push(now);
  return false;
};

// Data integrity checks
export const generateDataChecksum = (data: any): string => {
  const jsonString = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
};

export const verifyDataIntegrity = (data: any, expectedChecksum: string): boolean => {
  const actualChecksum = generateDataChecksum(data);
  return actualChecksum === expectedChecksum;
};

// Export/Import security
export const secureExportData = (data: any): string => {
  const exportData = {
    ...data,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checksum: generateDataChecksum(data)
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const secureImportData = (jsonData: string): { success: boolean; data?: any; error?: string } => {
  try {
    if (!isValidJSONString(jsonData)) {
      return { success: false, error: 'فرمت JSON معتبر نیست' };
    }
    
    const importData = JSON.parse(jsonData);
    
    if (!importData.checksum) {
      return { success: false, error: 'فایل فاقد اطلاعات امنیتی است' };
    }
    
    const { checksum, timestamp, version, ...actualData } = importData;
    
    if (!verifyDataIntegrity(actualData, checksum)) {
      return { success: false, error: 'یکپارچگی داده‌ها تأیید نشد' };
    }
    
    return { success: true, data: actualData };
  } catch (error) {
    return { success: false, error: 'خطا در پردازش فایل' };
  }
};

// Performance monitoring
export const performanceMonitor = {
  measurements: {} as { [key: string]: number[] },
  
  start: (operation: string): void => {
    if (!performanceMonitor.measurements[operation]) {
      performanceMonitor.measurements[operation] = [];
    }
    performance.mark(`${operation}-start`);
  },
  
  end: (operation: string): number => {
    performance.mark(`${operation}-end`);
    performance.measure(operation, `${operation}-start`, `${operation}-end`);
    
    const measures = performance.getEntriesByName(operation);
    const latestMeasure = measures[measures.length - 1];
    const duration = latestMeasure.duration;
    
    performanceMonitor.measurements[operation].push(duration);
    
    // Keep only last 100 measurements
    if (performanceMonitor.measurements[operation].length > 100) {
      performanceMonitor.measurements[operation] = performanceMonitor.measurements[operation].slice(-100);
    }
    
    return duration;
  },
  
  getStats: (operation: string) => {
    const measurements = performanceMonitor.measurements[operation] || [];
    if (measurements.length === 0) return null;
    
    const sum = measurements.reduce((a, b) => a + b, 0);
    const avg = sum / measurements.length;
    const max = Math.max(...measurements);
    const min = Math.min(...measurements);
    
    return { avg, max, min, count: measurements.length };
  }
};

export default {
  validateEmail,
  validatePhoneNumber,
  validateURL,
  validateDate,
  sanitizeText,
  sanitizeHTML,
  validateProfessorData,
  validateApplicationData,
  validateEmailData,
  secureStorageSet,
  secureStorageGet,
  isRateLimited,
  generateDataChecksum,
  verifyDataIntegrity,
  secureExportData,
  secureImportData,
  performanceMonitor
};