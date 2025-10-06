// Backup and Restore System
// سیستم پشتیبان‌گیری و بازیابی

import { secureExportData, secureImportData } from './security';

interface BackupMetadata {
  id: string;
  name: string;
  description?: string;
  timestamp: string;
  version: string;
  size: number;
  checksum: string;
  collections: string[];
  recordCounts: { [collection: string]: number };
}

interface BackupFile {
  metadata: BackupMetadata;
  data: any;
}

export class BackupManager {
  private static readonly BACKUP_STORAGE_KEY = 'applyhelper_backups';
  private static readonly MAX_BACKUPS = 10;

  // Create backup
  async createBackup(name: string, description?: string): Promise<{ success: boolean; id: string; error?: string }> {
    try {
      const collections = ['professors', 'emails', 'applications', 'profile'];
      const data: any = {};
      const recordCounts: { [collection: string]: number } = {};
      
      // Collect data from all collections
      collections.forEach(collection => {
        const collectionData = JSON.parse(localStorage.getItem(`applyhelper_${collection}`) || '[]');
        data[collection] = collectionData;
        recordCounts[collection] = Array.isArray(collectionData) ? collectionData.length : 1;
      });

      // Add settings and preferences
      data.settings = JSON.parse(localStorage.getItem('applyhelper_settings') || '{}');
      data.analytics = JSON.parse(localStorage.getItem('analytics_events') || '[]');

      // Create backup with security
      const secureBackupData = secureExportData(data);
      
      // Generate metadata
      const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const metadata: BackupMetadata = {
        id: backupId,
        name: name || `پشتیبان ${new Date().toLocaleDateString('fa-IR')}`,
        description,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        size: secureBackupData.length,
        checksum: this.generateChecksum(secureBackupData),
        collections,
        recordCounts
      };

      const backupFile: BackupFile = {
        metadata,
        data: secureBackupData
      };

      // Save backup
      await this.saveBackup(backupFile);

      return { success: true, id: backupId };
    } catch (error) {
      console.error('خطا در ایجاد پشتیبان:', error);
      return { success: false, id: '', error: 'خطا در ایجاد پشتیبان' };
    }
  }

  // Save backup to storage
  private async saveBackup(backup: BackupFile): Promise<void> {
    const existingBackups = this.getBackupsList();
    
    // Add new backup
    existingBackups.push(backup.metadata);
    
    // Remove oldest backups if limit exceeded
    if (existingBackups.length > BackupManager.MAX_BACKUPS) {
      const toRemove = existingBackups
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(0, existingBackups.length - BackupManager.MAX_BACKUPS);
      
      toRemove.forEach(backup => {
        localStorage.removeItem(`backup_${backup.id}`);
      });
      
      existingBackups.splice(0, toRemove.length);
    }

    // Save backup data
    localStorage.setItem(`backup_${backup.metadata.id}`, backup.data);
    
    // Update backups list
    localStorage.setItem(BackupManager.BACKUP_STORAGE_KEY, JSON.stringify(existingBackups));
  }

  // Get list of available backups
  getBackupsList(): BackupMetadata[] {
    const backups = localStorage.getItem(BackupManager.BACKUP_STORAGE_KEY);
    return backups ? JSON.parse(backups) : [];
  }

  // Get backup details
  getBackupDetails(backupId: string): BackupMetadata | null {
    const backups = this.getBackupsList();
    return backups.find(backup => backup.id === backupId) || null;
  }

  // Restore from backup
  async restoreFromBackup(backupId: string): Promise<{ success: boolean; error?: string; restored: string[] }> {
    try {
      // Get backup data
      const backupData = localStorage.getItem(`backup_${backupId}`);
      if (!backupData) {
        return { success: false, error: 'پشتیبان مورد نظر یافت نشد', restored: [] };
      }

      // Verify and import data
      const importResult = secureImportData(backupData);
      if (!importResult.success) {
        return { success: false, error: importResult.error, restored: [] };
      }

      const data = importResult.data;
      const restored: string[] = [];

      // Restore each collection
      const collections = ['professors', 'emails', 'applications', 'profile'];
      collections.forEach(collection => {
        if (data[collection]) {
          localStorage.setItem(`applyhelper_${collection}`, JSON.stringify(data[collection]));
          restored.push(collection);
        }
      });

      // Restore settings
      if (data.settings) {
        localStorage.setItem('applyhelper_settings', JSON.stringify(data.settings));
        restored.push('settings');
      }

      return { success: true, restored };
    } catch (error) {
      console.error('خطا در بازیابی پشتیبان:', error);
      return { success: false, error: 'خطا در بازیابی پشتیبان', restored: [] };
    }
  }

  // Delete backup
  deleteBackup(backupId: string): boolean {
    try {
      // Remove backup data
      localStorage.removeItem(`backup_${backupId}`);
      
      // Update backups list
      const backups = this.getBackupsList();
      const updatedBackups = backups.filter(backup => backup.id !== backupId);
      localStorage.setItem(BackupManager.BACKUP_STORAGE_KEY, JSON.stringify(updatedBackups));
      
      return true;
    } catch (error) {
      console.error('خطا در حذف پشتیبان:', error);
      return false;
    }
  }

  // Export backup to file
  async exportBackupToFile(backupId: string): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      const backupData = localStorage.getItem(`backup_${backupId}`);
      const metadata = this.getBackupDetails(backupId);
      
      if (!backupData || !metadata) {
        return { success: false, error: 'پشتیبان مورد نظر یافت نشد' };
      }

      const filename = `نظم_دهنده_ایمیل_اپلای_${metadata.name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
      return {
        success: true,
        data: backupData,
        filename
      };
    } catch (error) {
      console.error('خطا در صدور پشتیبان:', error);
      return { success: false, error: 'خطا در صدور پشتیبان' };
    }
  }

  // Import backup from file
  async importBackupFromFile(fileData: string, name?: string): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Verify data integrity
      const importResult = secureImportData(fileData);
      if (!importResult.success) {
        return { success: false, error: importResult.error };
      }

      // Create new backup entry
      const backupId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const metadata: BackupMetadata = {
        id: backupId,
        name: name || `پشتیبان وارد شده ${new Date().toLocaleDateString('fa-IR')}`,
        description: 'پشتیبان وارد شده از فایل',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        size: fileData.length,
        checksum: this.generateChecksum(fileData),
        collections: ['professors', 'emails', 'applications', 'profile'],
        recordCounts: this.calculateRecordCounts(importResult.data)
      };

      const backupFile: BackupFile = {
        metadata,
        data: fileData
      };

      await this.saveBackup(backupFile);

      return { success: true, id: backupId };
    } catch (error) {
      console.error('خطا در وارد کردن پشتیبان:', error);
      return { success: false, error: 'خطا در وارد کردن پشتیبان' };
    }
  }

  // Auto backup (scheduled)
  async createAutoBackup(): Promise<{ success: boolean; id?: string }> {
    const name = `پشتیبان خودکار ${new Date().toLocaleDateString('fa-IR')} ${new Date().toLocaleTimeString('fa-IR')}`;
    const description = 'پشتیبان ایجاد شده به صورت خودکار';
    
    return await this.createBackup(name, description);
  }

  // Backup comparison
  compareBackups(backupId1: string, backupId2: string): {
    success: boolean;
    differences?: {
      collections: { [collection: string]: { added: number; removed: number; modified: number } };
      summary: { totalChanges: number };
    };
    error?: string;
  } {
    try {
      const backup1Data = localStorage.getItem(`backup_${backupId1}`);
      const backup2Data = localStorage.getItem(`backup_${backupId2}`);
      
      if (!backup1Data || !backup2Data) {
        return { success: false, error: 'یکی از پشتیبان‌ها یافت نشد' };
      }

      const data1 = secureImportData(backup1Data);
      const data2 = secureImportData(backup2Data);
      
      if (!data1.success || !data2.success) {
        return { success: false, error: 'خطا در خواندن داده‌های پشتیبان' };
      }

      const differences: any = { collections: {}, summary: { totalChanges: 0 } };
      const collections = ['professors', 'emails', 'applications'];

      collections.forEach(collection => {
        const items1 = data1.data[collection] || [];
        const items2 = data2.data[collection] || [];
        
        const ids1 = new Set(items1.map((item: any) => item.id));
        const ids2 = new Set(items2.map((item: any) => item.id));
        
        const added = Array.from(ids2).filter(id => !ids1.has(id)).length;
        const removed = Array.from(ids1).filter(id => !ids2.has(id)).length;
        
        // Simple modification check (could be enhanced)
        const modified = items2.filter((item: any) => {
          const item1 = items1.find((i: any) => i.id === item.id);
          return item1 && JSON.stringify(item1) !== JSON.stringify(item);
        }).length;

        differences.collections[collection] = { added, removed, modified };
        differences.summary.totalChanges += added + removed + modified;
      });

      return { success: true, differences };
    } catch (error) {
      console.error('خطا در مقایسه پشتیبان‌ها:', error);
      return { success: false, error: 'خطا در مقایسه پشتیبان‌ها' };
    }
  }

  // Utilities
  private generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private calculateRecordCounts(data: any): { [collection: string]: number } {
    const counts: { [collection: string]: number } = {};
    const collections = ['professors', 'emails', 'applications', 'profile'];
    
    collections.forEach(collection => {
      const collectionData = data[collection];
      counts[collection] = Array.isArray(collectionData) ? collectionData.length : (collectionData ? 1 : 0);
    });
    
    return counts;
  }

  // Get storage usage
  getStorageStats(): {
    totalBackups: number;
    totalSize: number;
    oldestBackup?: string;
    newestBackup?: string;
    averageSize: number;
  } {
    const backups = this.getBackupsList();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    
    const sorted = [...backups].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: sorted[0]?.timestamp,
      newestBackup: sorted[sorted.length - 1]?.timestamp,
      averageSize: backups.length > 0 ? totalSize / backups.length : 0
    };
  }
}

// Singleton instance
export const backupManager = new BackupManager();

export default BackupManager;