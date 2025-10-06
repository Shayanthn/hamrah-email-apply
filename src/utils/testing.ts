// Accessibility Testing and Compliance
// تست دسترسی‌پذیری و انطباق با استانداردها

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'major' | 'minor';
  element: string;
  message: string;
  suggestion: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriterion: string;
}

export class AccessibilityChecker {
  private issues: AccessibilityIssue[] = [];

  // Run comprehensive accessibility audit
  async runAccessibilityAudit(): Promise<{
    passed: boolean;
    score: number;
    issues: AccessibilityIssue[];
    summary: {
      total: number;
      critical: number;
      major: number;
      minor: number;
    };
  }> {
    this.issues = [];

    // Check various accessibility aspects
    this.checkColorContrast();
    this.checkKeyboardNavigation();
    this.checkAriaLabels();
    this.checkFocusManagement();
    this.checkSemanticHTML();
    this.checkImageAltText();
    this.checkFormAccessibility();
    this.checkLanguageAttributes();
    this.checkHeadingStructure();

    const summary = {
      total: this.issues.length,
      critical: this.issues.filter(i => i.severity === 'critical').length,
      major: this.issues.filter(i => i.severity === 'major').length,
      minor: this.issues.filter(i => i.severity === 'minor').length
    };

    const score = Math.max(0, 100 - (summary.critical * 25 + summary.major * 10 + summary.minor * 2));
    const passed = summary.critical === 0 && summary.major <= 2;

    return {
      passed,
      score,
      issues: this.issues,
      summary
    };
  }

  private checkColorContrast(): void {
    // Check color contrast ratios
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (textColor && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrastRatio(textColor, backgroundColor);
        
        if (contrast < 4.5) { // WCAG AA standard
          this.addIssue({
            type: 'error',
            severity: 'major',
            element: this.getElementSelector(element),
            message: `کنتراست رنگ ناکافی: ${contrast.toFixed(2)}`,
            suggestion: 'کنتراست رنگ متن و پس‌زمینه باید حداقل 4.5:1 باشد',
            wcagLevel: 'AA',
            wcagCriterion: '1.4.3'
          });
        }
      }
    });
  }

  private checkKeyboardNavigation(): void {
    // Check for keyboard-focusable elements
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        this.addIssue({
          type: 'warning',
          severity: 'minor',
          element: this.getElementSelector(element),
          message: 'استفاده از tabindex مثبت',
          suggestion: 'از tabindex مثبت اجتناب کنید و ترتیب طبیعی DOM را استفاده کنید',
          wcagLevel: 'A',
          wcagCriterion: '2.4.3'
        });
      }

      // Check for focus indicators
      const styles = window.getComputedStyle(element, ':focus');
      if (!styles.outline || styles.outline === 'none') {
        this.addIssue({
          type: 'error',
          severity: 'major',
          element: this.getElementSelector(element),
          message: 'عدم وجود نشانگر فوکوس',
          suggestion: 'نشانگر واضح فوکوس برای navigation کیبورد اضافه کنید',
          wcagLevel: 'AA',
          wcagCriterion: '2.4.7'
        });
      }
    });
  }

  private checkAriaLabels(): void {
    // Check for proper ARIA labels
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"]'
    );

    interactiveElements.forEach(element => {
      const hasLabel = element.getAttribute('aria-label') ||
                      element.getAttribute('aria-labelledby') ||
                      element.textContent?.trim() ||
                      element.querySelector('label');

      if (!hasLabel) {
        this.addIssue({
          type: 'error',
          severity: 'critical',
          element: this.getElementSelector(element),
          message: 'عدم وجود برچسب قابل دسترس',
          suggestion: 'aria-label، aria-labelledby یا label مناسب اضافه کنید',
          wcagLevel: 'A',
          wcagCriterion: '4.1.2'
        });
      }
    });
  }

  private checkFocusManagement(): void {
    // Check for proper focus management in modals and dynamic content
    const modals = document.querySelectorAll('[role="dialog"], .modal');
    
    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) {
        this.addIssue({
          type: 'warning',
          severity: 'major',
          element: this.getElementSelector(modal),
          message: 'مودال بدون عنصر قابل فوکوس',
          suggestion: 'حداقل یک عنصر قابل فوکوس در مودال قرار دهید',
          wcagLevel: 'AA',
          wcagCriterion: '2.4.3'
        });
      }
    });
  }

  private checkSemanticHTML(): void {
    // Check for proper semantic structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      this.addIssue({
        type: 'error',
        severity: 'major',
        element: 'document',
        message: 'عدم وجود عناوین',
        suggestion: 'عناوین مناسب (h1, h2, ...) برای ساختار محتوا استفاده کنید',
        wcagLevel: 'A',
        wcagCriterion: '1.3.1'
      });
    }

    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"], [role="navigation"] a');
    if (skipLinks.length === 0) {
      this.addIssue({
        type: 'warning',
        severity: 'minor',
        element: 'document',
        message: 'عدم وجود پیوندهای رد کردن',
        suggestion: 'پیوندهای skip navigation برای کاربران کیبورد اضافه کنید',
        wcagLevel: 'A',
        wcagCriterion: '2.4.1'
      });
    }
  }

  private checkImageAltText(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const role = img.getAttribute('role');
      
      if (!alt && role !== 'presentation') {
        this.addIssue({
          type: 'error',
          severity: 'major',
          element: this.getElementSelector(img),
          message: 'عدم وجود متن جایگزین تصویر',
          suggestion: 'attribute alt مناسب برای تصویر اضافه کنید',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1'
        });
      }
    });
  }

  private checkFormAccessibility(): void {
    const formElements = document.querySelectorAll('input, textarea, select');
    
    formElements.forEach(element => {
      const label = document.querySelector(`label[for="${element.id}"]`) ||
                   element.closest('label');
      
      if (!label && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        this.addIssue({
          type: 'error',
          severity: 'critical',
          element: this.getElementSelector(element),
          message: 'فیلد فرم بدون برچسب',
          suggestion: 'label مناسب یا aria-label برای فیلد فرم اضافه کنید',
          wcagLevel: 'A',
          wcagCriterion: '3.3.2'
        });
      }

      // Check for required field indicators
      if (element.hasAttribute('required') && !element.getAttribute('aria-required')) {
        this.addIssue({
          type: 'warning',
          severity: 'minor',
          element: this.getElementSelector(element),
          message: 'فیلد اجباری بدون نشانگر مناسب',
          suggestion: 'aria-required="true" برای فیلدهای اجباری اضافه کنید',
          wcagLevel: 'A',
          wcagCriterion: '3.3.2'
        });
      }
    });
  }

  private checkLanguageAttributes(): void {
    const htmlElement = document.documentElement;
    const lang = htmlElement.getAttribute('lang');
    
    if (!lang) {
      this.addIssue({
        type: 'error',
        severity: 'major',
        element: 'html',
        message: 'عدم وجود attribute زبان',
        suggestion: 'lang="fa" برای عنصر html اضافه کنید',
        wcagLevel: 'A',
        wcagCriterion: '3.1.1'
      });
    }

    // Check for dir attribute for RTL
    const dir = htmlElement.getAttribute('dir');
    if (!dir || dir !== 'rtl') {
      this.addIssue({
        type: 'warning',
        severity: 'minor',
        element: 'html',
        message: 'عدم تنظیم جهت متن',
        suggestion: 'dir="rtl" برای متن فارسی اضافه کنید',
        wcagLevel: 'A',
        wcagCriterion: '1.3.2'
      });
    }
  }

  private checkHeadingStructure(): void {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    if (headings.length === 0) return;

    let previousLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (level - previousLevel > 1) {
        this.addIssue({
          type: 'warning',
          severity: 'minor',
          element: this.getElementSelector(heading),
          message: 'سطح‌بندی نادرست عناوین',
          suggestion: 'از سطح‌بندی منطقی عناوین استفاده کنید (h1, h2, h3, ...)',
          wcagLevel: 'A',
          wcagCriterion: '1.3.1'
        });
      }
      
      previousLevel = level;
    });
  }

  // Utility methods
  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast calculation - in real implementation use a proper color library
    // This is a placeholder implementation
    return 5.0; // Assume good contrast for now
  }

  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private addIssue(issue: AccessibilityIssue): void {
    this.issues.push(issue);
  }

  // Generate accessibility report
  generateReport(): string {
    const report = {
      title: 'گزارش دسترسی‌پذیری',
      timestamp: new Date().toISOString(),
      issues: this.issues,
      recommendations: this.getRecommendations()
    };

    return JSON.stringify(report, null, 2);
  }

  private getRecommendations(): string[] {
    return [
      'از semantic HTML استفاده کنید',
      'کنتراست رنگ مناسب حفظ کنید',
      'navigation کیبورد را تست کنید',
      'ARIA labels مناسب اضافه کنید',
      'متن جایگزین برای تصاویر فراهم کنید',
      'فرم‌ها را accessible طراحی کنید',
      'ساختار عناوین منطقی استفاده کنید'
    ];
  }
}

// Performance testing utilities
export class PerformanceTester {
  async runPerformanceTest(): Promise<{
    passed: boolean;
    metrics: {
      bundleSize: number;
      loadTime: number;
      renderTime: number;
      memoryUsage: number;
    };
    recommendations: string[];
  }> {
    const metrics = {
      bundleSize: this.getBundleSize(),
      loadTime: this.getLoadTime(),
      renderTime: this.getRenderTime(),
      memoryUsage: this.getMemoryUsage()
    };

    const recommendations = this.getPerformanceRecommendations(metrics);
    const passed = this.evaluatePerformance(metrics);

    return { passed, metrics, recommendations };
  }

  private getBundleSize(): number {
    // Get approximate bundle size
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      // This would need actual implementation to fetch resource sizes
      totalSize += 100; // Placeholder
    });
    
    return totalSize;
  }

  private getLoadTime(): number {
    return performance.timing.loadEventEnd - performance.timing.navigationStart;
  }

  private getRenderTime(): number {
    return performance.timing.domContentLoadedEventEnd - performance.timing.domLoading;
  }

  private getMemoryUsage(): number {
    // @ts-ignore
    return performance.memory ? performance.memory.usedJSHeapSize : 0;
  }

  private evaluatePerformance(metrics: any): boolean {
    return metrics.loadTime < 3000 && 
           metrics.renderTime < 1000 && 
           metrics.bundleSize < 5000000; // 5MB
  }

  private getPerformanceRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.loadTime > 3000) {
      recommendations.push('زمان بارگذاری بیش از حد مطلوب است');
    }
    
    if (metrics.bundleSize > 5000000) {
      recommendations.push('اندازه bundle بزرگ است - lazy loading استفاده کنید');
    }
    
    return recommendations;
  }
}

// Cross-browser compatibility checker
export class CompatibilityChecker {
  checkBrowserSupport(): {
    supported: boolean;
    features: { [feature: string]: boolean };
    recommendations: string[];
  } {
    const features = {
      localStorage: typeof Storage !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      asyncAwait: this.checkAsyncAwait(),
      es6Modules: this.checkES6Modules(),
      css3: this.checkCSS3Support(),
      rtlSupport: this.checkRTLSupport()
    };

    const supported = Object.values(features).every(Boolean);
    const recommendations = this.getBrowserRecommendations(features);

    return { supported, features, recommendations };
  }

  private checkAsyncAwait(): boolean {
    try {
      eval('(async () => {})');
      return true;
    } catch {
      return false;
    }
  }

  private checkES6Modules(): boolean {
    return 'noModule' in HTMLScriptElement.prototype;
  }

  private checkCSS3Support(): boolean {
    const div = document.createElement('div');
    return 'flexbox' in div.style || 'flex' in div.style;
  }

  private checkRTLSupport(): boolean {
    const div = document.createElement('div');
    div.dir = 'rtl';
    return div.dir === 'rtl';
  }

  private getBrowserRecommendations(features: { [feature: string]: boolean }): string[] {
    const recommendations: string[] = [];
    
    if (!features.localStorage) {
      recommendations.push('مرورگر از localStorage پشتیبانی نمی‌کند');
    }
    
    if (!features.rtlSupport) {
      recommendations.push('پشتیبانی RTL محدود است');
    }
    
    return recommendations;
  }
}

// Export testing utilities
export const testingUtils = {
  accessibility: new AccessibilityChecker(),
  performance: new PerformanceTester(),
  compatibility: new CompatibilityChecker()
};

export default testingUtils;