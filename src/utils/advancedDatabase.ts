// Advanced Database Operations and Optimizations
// عملیات‌های پیشرفته پایگاه داده و بهینه‌سازی‌ها

import { 
  secureStorageSet, 
  secureStorageGet, 
  generateDataChecksum,
  performanceMonitor 
} from './security';

// Database indexes for faster queries
interface DatabaseIndex {
  [key: string]: { [value: string]: string[] };
}

// Search index for full-text search
interface SearchIndex {
  terms: { [term: string]: string[] };
  documents: { [id: string]: string };
}

// Cache management
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private maxSize: number = 100;

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default TTL
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // TODO: Implement hit rate tracking
    };
  }
}

// Advanced database operations
export class AdvancedDatabase {
  private cache = new CacheManager();
  private indexes: DatabaseIndex = {};
  private searchIndex: SearchIndex = { terms: {}, documents: {} };

  // Initialize indexes
  initializeIndexes(): void {
    performanceMonitor.start('indexInitialization');
    
    // Professor indexes
    this.buildIndex('professors', 'university');
    this.buildIndex('professors', 'department'); 
    this.buildIndex('professors', 'status');
    
    // Email indexes
    this.buildIndex('emails', 'status');
    this.buildIndex('emails', 'professorId');
    
    // Application indexes
    this.buildIndex('applications', 'status');
    this.buildIndex('applications', 'university');
    
    // Build search index
    this.buildSearchIndex();
    
    performanceMonitor.end('indexInitialization');
  }

  private buildIndex(collection: string, field: string): void {
    const indexKey = `${collection}_${field}`;
    this.indexes[indexKey] = {};

    const data = secureStorageGet(`applyhelper_${collection}`) || [];
    
    data.forEach((item: any) => {
      const value = item[field];
      if (value) {
        if (!this.indexes[indexKey][value]) {
          this.indexes[indexKey][value] = [];
        }
        this.indexes[indexKey][value].push(item.id);
      }
    });
  }

  private buildSearchIndex(): void {
    const collections = ['professors', 'emails', 'applications'];
    
    collections.forEach(collection => {
      const data = secureStorageGet(`applyhelper_${collection}`) || [];
      
      data.forEach((item: any) => {
        // Create searchable text from all string fields
        const searchableText = Object.values(item)
          .filter(value => typeof value === 'string')
          .join(' ')
          .toLowerCase()
          .replace(/[^\w\u0600-\u06FF\s]/g, '') // Keep alphanumeric, Persian, and spaces
          .split(/\s+/)
          .filter(term => term.length > 2); // Only index terms longer than 2 characters

        // Store document text
        this.searchIndex.documents[item.id] = searchableText.join(' ');

        // Index terms
        searchableText.forEach(term => {
          if (!this.searchIndex.terms[term]) {
            this.searchIndex.terms[term] = [];
          }
          if (!this.searchIndex.terms[term].includes(item.id)) {
            this.searchIndex.terms[term].push(item.id);
          }
        });
      });
    });
  }

  // Fast filtered queries using indexes
  queryByIndex(collection: string, field: string, value: string): any[] {
    const cacheKey = `query_${collection}_${field}_${value}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    performanceMonitor.start('indexedQuery');

    const indexKey = `${collection}_${field}`;
    const ids = this.indexes[indexKey]?.[value] || [];
    
    const allData = secureStorageGet(`applyhelper_${collection}`) || [];
    const result = allData.filter((item: any) => ids.includes(item.id));

    this.cache.set(cacheKey, result);
    performanceMonitor.end('indexedQuery');

    return result;
  }

  // Advanced search with multiple criteria
  advancedSearch(criteria: {
    collection: string;
    filters: { [field: string]: any };
    textSearch?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): { results: any[]; total: number; facets: { [field: string]: { [value: string]: number } } } {
    performanceMonitor.start('advancedSearch');

    let results: any[] = [];
    
    // Start with full dataset
    const allData = secureStorageGet(`applyhelper_${criteria.collection}`) || [];
    results = [...allData];

    // Apply filters using indexes when possible
    Object.entries(criteria.filters).forEach(([field, value]) => {
      if (this.indexes[`${criteria.collection}_${field}`]) {
        // Use index for fast filtering
        const indexedResults = this.queryByIndex(criteria.collection, field, value);
        results = results.filter(item => indexedResults.some(indexed => indexed.id === item.id));
      } else {
        // Fallback to linear search
        results = results.filter(item => item[field] === value);
      }
    });

    // Apply text search
    if (criteria.textSearch) {
      const searchTerms = criteria.textSearch
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 2);

      const matchingIds = new Set<string>();
      
      searchTerms.forEach(term => {
        // Fuzzy search - find terms that start with the search term
        Object.keys(this.searchIndex.terms)
          .filter(indexedTerm => indexedTerm.includes(term))
          .forEach(matchedTerm => {
            this.searchIndex.terms[matchedTerm].forEach(id => matchingIds.add(id));
          });
      });

      results = results.filter(item => matchingIds.has(item.id));
    }

    const total = results.length;

    // Calculate facets (for filtering UI)
    const facets: { [field: string]: { [value: string]: number } } = {};
    const facetFields = ['status', 'university', 'department'];
    
    facetFields.forEach(field => {
      facets[field] = {};
      results.forEach(item => {
        const value = item[field];
        if (value) {
          facets[field][value] = (facets[field][value] || 0) + 1;
        }
      });
    });

    // Apply sorting
    if (criteria.sortBy) {
      results.sort((a, b) => {
        const aValue = a[criteria.sortBy!];
        const bValue = b[criteria.sortBy!];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        return criteria.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    if (criteria.offset || criteria.limit) {
      const start = criteria.offset || 0;
      const end = criteria.limit ? start + criteria.limit : undefined;
      results = results.slice(start, end);
    }

    performanceMonitor.end('advancedSearch');

    return { results, total, facets };
  }

  // Auto-complete suggestions
  getAutocompleteSuggestions(field: string, query: string, limit: number = 10): string[] {
    const cacheKey = `autocomplete_${field}_${query}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Get suggestions from search index
    if (field === 'search') {
      Object.keys(this.searchIndex.terms)
        .filter(term => term.startsWith(queryLower))
        .sort()
        .slice(0, limit)
        .forEach(term => suggestions.push(term));
    } else {
      // Get suggestions from field values
      const collections = ['professors', 'emails', 'applications'];
      const values = new Set<string>();

      collections.forEach(collection => {
        const data = secureStorageGet(`applyhelper_${collection}`) || [];
        data.forEach((item: any) => {
          const value = item[field];
          if (value && typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
            values.add(value);
          }
        });
      });

      suggestions.push(...Array.from(values).slice(0, limit));
    }

    this.cache.set(cacheKey, suggestions, 60000); // 1 minute cache
    return suggestions;
  }

  // Database maintenance and optimization
  optimizeDatabase(): Promise<{
    success: boolean;
    stats: {
      indexesRebuilt: number;
      cacheCleared: boolean;
      dataIntegrityChecked: boolean;
      duplicatesRemoved: number;
    };
  }> {
    return new Promise((resolve) => {
      performanceMonitor.start('databaseOptimization');
      
      const stats = {
        indexesRebuilt: 0,
        cacheCleared: false,
        dataIntegrityChecked: false,
        duplicatesRemoved: 0
      };

      // Clear cache
      this.cache.clear();
      stats.cacheCleared = true;

      // Rebuild indexes
      this.initializeIndexes();
      stats.indexesRebuilt = Object.keys(this.indexes).length;

      // Check data integrity and remove duplicates
      const collections = ['professors', 'emails', 'applications'];
      
      collections.forEach(collection => {
        const data = secureStorageGet(`applyhelper_${collection}`) || [];
        const seen = new Set();
        const deduped = data.filter((item: any) => {
          if (seen.has(item.id)) {
            stats.duplicatesRemoved++;
            return false;
          }
          seen.add(item.id);
          return true;
        });

        if (deduped.length !== data.length) {
          secureStorageSet(`applyhelper_${collection}`, deduped);
        }
      });

      stats.dataIntegrityChecked = true;

      performanceMonitor.end('databaseOptimization');
      
      resolve({ success: true, stats });
    });
  }

  // Export with compression simulation
  async exportOptimizedData(): Promise<string> {
    performanceMonitor.start('dataExport');

    const collections = ['professors', 'emails', 'applications', 'profile'];
    const exportData: any = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      metadata: {
        totalRecords: 0,
        checksum: ''
      }
    };

    collections.forEach(collection => {
      const data = secureStorageGet(`applyhelper_${collection}`) || [];
      exportData[collection] = data;
      exportData.metadata.totalRecords += data.length;
    });

    // Generate checksum
    exportData.metadata.checksum = generateDataChecksum(exportData);

    performanceMonitor.end('dataExport');

    return JSON.stringify(exportData);
  }

  // Performance monitoring
  getPerformanceStats(): any {
    return {
      cache: this.cache.getStats(),
      indexes: {
        count: Object.keys(this.indexes).length,
        searchTerms: Object.keys(this.searchIndex.terms).length
      },
      performance: {
        indexInitialization: performanceMonitor.getStats('indexInitialization'),
        indexedQuery: performanceMonitor.getStats('indexedQuery'),
        advancedSearch: performanceMonitor.getStats('advancedSearch'),
        databaseOptimization: performanceMonitor.getStats('databaseOptimization')
      }
    };
  }
}

// Singleton instance
export const advancedDB = new AdvancedDatabase();

export default AdvancedDatabase;