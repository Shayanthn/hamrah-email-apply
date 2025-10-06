// Analytics and User Behavior Tracking
// تحلیل آمار و رفتار کاربر

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: string[];
  events: AnalyticsEvent[];
  userAgent: string;
  language: string;
}

class AnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private session: UserSession;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.session = this.initSession();
    this.startHeartbeat();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  private initSession(): UserSession {
    const existingSession = sessionStorage.getItem('current_session');
    if (existingSession) {
      return JSON.parse(existingSession);
    }

    const newSession: UserSession = {
      id: this.sessionId,
      startTime: Date.now(),
      pageViews: [],
      events: [],
      userAgent: navigator.userAgent,
      language: navigator.language
    };

    sessionStorage.setItem('current_session', JSON.stringify(newSession));
    return newSession;
  }

  // Track page views
  trackPageView(page: string): void {
    if (!this.isEnabled) return;

    this.session.pageViews.push(page);
    this.trackEvent('page_view', 'navigation', page);
    this.saveSession();
  }

  // Track custom events
  trackEvent(action: string, category: string, label?: string, value?: number): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.session.events.push(event);
    this.saveSession();

    // Also save to localStorage for persistence
    this.saveEventToStorage(event);
  }

  // Track user actions
  trackUserAction(action: string, details?: any): void {
    this.trackEvent(action, 'user_action', JSON.stringify(details));
  }

  // Track application usage patterns
  trackFeatureUsage(feature: string, action: 'start' | 'end' | 'interaction'): void {
    this.trackEvent(`feature_${action}`, 'feature_usage', feature);
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, category: string = 'performance'): void {
    this.trackEvent(`performance_${metric}`, category, metric, value);
  }

  // Track errors
  trackError(error: Error, context?: string): void {
    this.trackEvent('error', 'application', context, 1);
    
    // Store error details separately
    const errorEvent = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href
    };

    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push(errorEvent);
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors));
  }

  // Session management
  private saveSession(): void {
    sessionStorage.setItem('current_session', JSON.stringify(this.session));
  }

  private saveEventToStorage(event: AnalyticsEvent): void {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    
    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  private startHeartbeat(): void {
    // Update session every 30 seconds
    setInterval(() => {
      if (this.isEnabled) {
        this.session.endTime = Date.now();
        this.saveSession();
      }
    }, 30000);
  }

  // Data retrieval and reporting
  getSessionData(): UserSession {
    return this.session;
  }

  getAllEvents(): AnalyticsEvent[] {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  }

  getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.getAllEvents().filter(event => event.category === category);
  }

  getEventsByAction(action: string): AnalyticsEvent[] {
    return this.getAllEvents().filter(event => event.action === action);
  }

  // Feature usage statistics
  getFeatureUsageStats(): { [feature: string]: number } {
    const events = this.getEventsByCategory('feature_usage');
    const stats: { [feature: string]: number } = {};

    events.forEach(event => {
      if (event.label && event.action === 'feature_start') {
        stats[event.label] = (stats[event.label] || 0) + 1;
      }
    });

    return stats;
  }

  // Performance analytics
  getPerformanceMetrics(): { [metric: string]: { avg: number; max: number; min: number; count: number } } {
    const events = this.getEventsByCategory('performance');
    const metrics: { [metric: string]: number[] } = {};

    events.forEach(event => {
      if (event.label && event.value !== undefined) {
        if (!metrics[event.label]) {
          metrics[event.label] = [];
        }
        metrics[event.label].push(event.value);
      }
    });

    const result: { [metric: string]: { avg: number; max: number; min: number; count: number } } = {};
    
    Object.keys(metrics).forEach(metric => {
      const values = metrics[metric];
      result[metric] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length
      };
    });

    return result;
  }

  // User journey analysis
  getUserJourney(): { page: string; timestamp: number; duration?: number }[] {
    const pageViewEvents = this.getEventsByAction('page_view');
    const journey: { page: string; timestamp: number; duration?: number }[] = [];

    pageViewEvents.forEach((event, index) => {
      const nextEvent = pageViewEvents[index + 1];
      journey.push({
        page: event.label || 'unknown',
        timestamp: event.timestamp,
        duration: nextEvent ? nextEvent.timestamp - event.timestamp : undefined
      });
    });

    return journey;
  }

  // Privacy controls
  enableAnalytics(): void {
    this.isEnabled = true;
    localStorage.setItem('analytics_enabled', 'true');
  }

  disableAnalytics(): void {
    this.isEnabled = false;
    localStorage.setItem('analytics_enabled', 'false');
  }

  isAnalyticsEnabled(): boolean {
    const setting = localStorage.getItem('analytics_enabled');
    return setting !== 'false'; // Default to enabled
  }

  // Data export
  exportAnalyticsData(): string {
    const data = {
      session: this.session,
      events: this.getAllEvents(),
      featureUsage: this.getFeatureUsageStats(),
      performance: this.getPerformanceMetrics(),
      userJourney: this.getUserJourney(),
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  // Clear data
  clearAnalyticsData(): void {
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('app_errors');
    sessionStorage.removeItem('current_session');
    
    // Reset current session
    this.session = this.initSession();
  }
}

// Create singleton instance
const analytics = new AnalyticsManager();

// React hook for using analytics
export const useAnalytics = () => {
  const trackPageView = (page: string) => analytics.trackPageView(page);
  const trackEvent = (action: string, category: string, label?: string, value?: number) => 
    analytics.trackEvent(action, category, label, value);
  const trackUserAction = (action: string, details?: any) => analytics.trackUserAction(action, details);
  const trackFeatureUsage = (feature: string, action: 'start' | 'end' | 'interaction') => 
    analytics.trackFeatureUsage(feature, action);
  const trackError = (error: Error, context?: string) => analytics.trackError(error, context);

  return {
    trackPageView,
    trackEvent,
    trackUserAction,
    trackFeatureUsage,
    trackError,
    getStats: () => ({
      featureUsage: analytics.getFeatureUsageStats(),
      performance: analytics.getPerformanceMetrics(),
      userJourney: analytics.getUserJourney()
    }),
    exportData: () => analytics.exportAnalyticsData(),
    clearData: () => analytics.clearAnalyticsData(),
    isEnabled: () => analytics.isAnalyticsEnabled(),
    enable: () => analytics.enableAnalytics(),
    disable: () => analytics.disableAnalytics()
  };
};

export default analytics;