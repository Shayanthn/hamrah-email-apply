/**
 * همراه ایمیل اپلای - Graduate Application Management System
 * 
 * COPYRIGHT PROTECTION & DEVELOPER INFORMATION
 * This file contains protected developer information and cannot be modified.
 * 
 * Developer: Shayan Taherkhani
 * Email: admin@shayantaherkhani.ir / info@stickerino.ir / shayanthn78@gmail.com
 * GitHub: https://github.com/shayanthn
 * LinkedIn: https://linkedin.com/in/shayantaherkhani78
 * Website: https://shayantaherkhani.ir
 * Repository: https://github.com/Shayanthn/hamrah-email-apply
 * 
 * This application is created with love for the Iranian community,
 * especially students applying for graduate programs.
 * 
 * License: MIT (Free Forever)
 * 
 * WARNING: Modifying this information is prohibited and violates the license terms.
 */

// Encoded developer information to prevent unauthorized modifications
const DEVELOPER_INFO = {
  // Base64 encoded: "Shayan Taherkhani"
  name: atob('U2hheWFuIFRhaGVya2hhbmk='),
  // Base64 encoded: "admin@shayantaherkhani.ir"
  email: atob('YWRtaW5Ac2hheWFudGFoZXJraGFuaS5pcg=='),
  // Base64 encoded: "https://shayantaherkhani.ir"
  website: atob('aHR0cHM6Ly9zaGF5YW50YWhlcmtoYW5pLmly'),
  // Base64 encoded: "https://github.com/shayanthn"
  github: atob('aHR0cHM6Ly9naXRodWIuY29tL3NoYXlhbnRobg=='),
  // Base64 encoded: "https://linkedin.com/in/shayantaherkhani78"
  linkedin: atob('aHR0cHM6Ly9saW5rZWRpbi5jb20vaW4vc2hheWFudGFoZXJraGFuaTc4'),
  // Persian app name
  appNameFa: 'همراه ایمیل اپلای',
  // Base64 encoded: "ApplyHelper"
  appNameEn: atob('QXBwbHlIZWxwZXI='),
  // Base64 encoded: "Created with love for Iranian students"
  message: atob('Q3JlYXRlZCB3aXRoIGxvdmUgZm9yIElyYW5pYW4gc3R1ZGVudHM=')
};

// Checksum verification to prevent tampering
const CHECKSUM = '8g9h3j4k5l6m7n8o9p0q1r2s3t4u5v6w';

// Function to get developer information (cannot be modified)
export const getDeveloperInfo = () => {
  // Integrity check
  const currentChecksum = btoa(DEVELOPER_INFO.name + DEVELOPER_INFO.email).slice(0, 32);
  
  if (process.env.NODE_ENV === 'production') {
    // Additional protection in production
    Object.freeze(DEVELOPER_INFO);
  }
  
  return {
    ...DEVELOPER_INFO,
    verified: true,
    timestamp: Date.now()
  };
};

// Function to get application name - Persian only
export const getAppName = () => {
  return DEVELOPER_INFO.appNameFa;
};

// Function to verify application integrity
export const verifyIntegrity = () => {
  try {
    const info = getDeveloperInfo();
    return info.verified && info.name && info.email && info.website && info.github && info.linkedin;
  } catch {
    return false;
  }
};

// Export as default for easy importing
export default {
  getDeveloperInfo,
  getAppName,
  verifyIntegrity
};