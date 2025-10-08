/**
 * CORE WEB VITALS OPTIMIZER - SOCIAL MEDIA CLUB
 * Sistema completo de otimização de performance para melhorar LCP, FID, CLS
 * 
 * Otimizações incluídas:
 * - Lazy loading inteligente
 * - Preload de recursos críticos
 * - Otimização de imagens
 * - Redução de JavaScript bloqueante
 * - Melhoria de Core Web Vitals
 */

class CoreWebVitalsOptimizer {
    constructor() {
        this.intersectionObserver = null;
        this.performanceMetrics = {};
        this.isOptimized = false;
        
        this.init();
    }
    
    init() {
        // Run optimizations in order of priority
        this.optimizeCLS();
        this.optimizeLCP();
        this.optimizeFID();
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.optimizeImages();
        this.measurePerformance();
        
        this.isOptimized = true;
        console.log('🚀 Core Web Vitals Optimizer initialized');
    }
    
    // Cumulative Layout Shift (CLS) Optimization
    optimizeCLS() {
        // Reserve space for dynamic content
        this.reserveSpaceForAsyncContent();
        
        // Stabilize hero section dimensions
        this.stabilizeHeroSection();
        
        // Prevent font loading shifts
        this.optimizeFontLoading();
        
        // Monitor layout shifts
        this.monitorLayoutShifts();
    }
    
    reserveSpaceForAsyncContent() {
        const asyncElements = document.querySelectorAll('.lazy-load, .async-content');
        
        asyncElements.forEach(element => {
            if (!element.style.minHeight) {
                // Set minimum dimensions to prevent shifts
                const computedStyle = window.getComputedStyle(element);
                const aspectRatio = element.dataset.aspectRatio || '16:9';
                
                if (aspectRatio && element.offsetWidth > 0) {
                    const [width, height] = aspectRatio.split(':').map(Number);
                    const calculatedHeight = (element.offsetWidth * height) / width;
                    element.style.minHeight = `${calculatedHeight}px`;
                }
            }
        });
    }
    
    stabilizeHeroSection() {
        const hero = document.querySelector('.hero');
        if (hero && !hero.style.minHeight) {
            // Set minimum height for hero to prevent shifts
            hero.style.minHeight = '100vh';
        }
    }
    
    optimizeFontLoading() {
        // Use font-display: swap for custom fonts
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        
        fontLinks.forEach(link => {
            if (!link.href.includes('display=swap')) {
                const url = new URL(link.href);
                url.searchParams.set('display', 'swap');
                link.href = url.toString();
            }
        });
        
        // Preload critical fonts
        this.preloadCriticalFonts();
    }
    
    preloadCriticalFonts() {
        const criticalFonts = [
            'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
    }
    
    monitorLayoutShifts() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.hadRecentInput) continue;
                    
                    console.log('Layout shift detected:', entry.value);
                    
                    // Track significant layout shifts
                    if (entry.value > 0.1) {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'layout_shift_significant', {
                                event_category: 'Core Web Vitals',
                                value: Math.round(entry.value * 1000),
                                non_interaction: true
                            });
                        }
                    }
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    // Largest Contentful Paint (LCP) Optimization
    optimizeLCP() {
        // Optimize hero image/content
        this.optimizeHeroContent();
        
        // Preload LCP resources
        this.preloadLCPResources();
        
        // Optimize critical CSS
        this.inlineCriticalCSS();
        
        // Monitor LCP
        this.monitorLCP();
    }
    
    optimizeHeroContent() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Mark hero as LCP candidate
        hero.setAttribute('data-lcp-element', 'true');
        
        // Optimize hero background if it exists
        const heroBackground = hero.querySelector('.hero-background, canvas');
        if (heroBackground) {
            heroBackground.style.willChange = 'transform';
            heroBackground.loading = 'eager';
        }
        
        // Prioritize hero text rendering
        const heroText = hero.querySelector('.hero-title, h1');
        if (heroText) {
            heroText.style.fontDisplay = 'swap';
        }
    }
    
    preloadLCPResources() {
        // Preload hero background image or critical images
        const criticalImages = document.querySelectorAll('[data-lcp-element] img, .hero img');
        
        criticalImages.forEach(img => {
            if (img.src) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            }
        });
    }
    
    inlineCriticalCSS() {
        // Critical CSS is already inlined in the HTML head
        // This function ensures non-critical CSS is loaded async
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        stylesheets.forEach(link => {
            // Convert to preload then apply
            if (!link.onload) {
                const href = link.href;
                link.rel = 'preload';
                link.as = 'style';
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
                
                // Fallback for browsers that don't support preload
                const noscript = document.createElement('noscript');
                noscript.innerHTML = `<link rel="stylesheet" href="${href}">`;
                link.parentNode.insertBefore(noscript, link.nextSibling);
            }
        });
    }
    
    monitorLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.performanceMetrics.lcp = entry.startTime;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'LCP', {
                            event_category: 'Core Web Vitals',
                            value: Math.round(entry.startTime),
                            non_interaction: true
                        });
                    }
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    // First Input Delay (FID) Optimization
    optimizeFID() {
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Split long tasks
        this.optimizeLongTasks();
        
        // Use passive event listeners
        this.optimizeEventListeners();
        
        // Monitor FID
        this.monitorFID();
    }
    
    deferNonCriticalJS() {
        // Non-critical scripts are already deferred in HTML
        // This ensures any dynamically added scripts are also deferred
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'SCRIPT' && !node.async && !node.defer) {
                        if (!node.src.includes('gtag') && !node.src.includes('gtm')) {
                            node.defer = true;
                        }
                    }
                });
            });
        });
        
        observer.observe(document.head, { childList: true });
    }
    
    optimizeLongTasks() {
        // Break up long tasks using requestIdleCallback
        this.scheduleWork(() => {
            // Non-critical work that can be postponed
            this.optimizeNonCriticalFeatures();
        });
    }
    
    scheduleWork(callback) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 5000 });
        } else {
            setTimeout(callback, 100);
        }
    }
    
    optimizeNonCriticalFeatures() {
        // Initialize non-critical features after main thread is free
        this.initializeAnimations();
        this.setupAdvancedInteractions();
    }
    
    initializeAnimations() {
        // Use CSS animations instead of JavaScript where possible
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            element.style.animation = element.dataset.animate;
        });
    }
    
    setupAdvancedInteractions() {
        // Setup complex interactions that aren't immediately needed
        this.setupParallaxEffects();
        this.setupAdvancedHovers();
    }
    
    optimizeEventListeners() {
        // Use passive listeners for scroll events
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'scroll' || type === 'touchmove' || type === 'wheel') {
                if (typeof options === 'boolean') {
                    options = { capture: options, passive: true };
                } else if (typeof options === 'object') {
                    options.passive = true;
                } else {
                    options = { passive: true };
                }
            }
            
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
    
    monitorFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'FID', {
                            event_category: 'Core Web Vitals',
                            value: Math.round(entry.processingStart - entry.startTime),
                            non_interaction: true
                        });
                    }
                }
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    // Lazy Loading System
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                }
            );
            
            // Observe lazy-loadable elements
            const lazyElements = document.querySelectorAll('.lazy-load, [data-src], [data-bg]');
            lazyElements.forEach(el => this.intersectionObserver.observe(el));
        } else {
            // Fallback for older browsers
            this.loadAllContent();
        }
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadContent(entry.target);
                this.intersectionObserver.unobserve(entry.target);
            }
        });
    }
    
    loadContent(element) {
        // Load images
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
        }
        
        // Load background images
        if (element.dataset.bg) {
            element.style.backgroundImage = `url(${element.dataset.bg})`;
            element.removeAttribute('data-bg');
        }
        
        // Load iframe content
        if (element.dataset.iframe) {
            const iframe = document.createElement('iframe');
            iframe.src = element.dataset.iframe;
            iframe.loading = 'lazy';
            element.replaceWith(iframe);
        }
        
        // Trigger loaded class for animations
        element.classList.add('loaded');
    }
    
    loadAllContent() {
        const lazyElements = document.querySelectorAll('.lazy-load, [data-src], [data-bg]');
        lazyElements.forEach(el => this.loadContent(el));
    }
    
    // Resource Preloading
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'styles.css', as: 'style' },
            { href: 'script-optimized.js', as: 'script' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.as;
            link.href = resource.href;
            
            if (resource.as === 'script') {
                link.crossOrigin = 'anonymous';
            }
            
            document.head.appendChild(link);
        });
    }
    
    // Image Optimization
    optimizeImages() {
        const images = document.querySelectorAll('img:not([loading])');
        
        images.forEach(img => {
            // Add lazy loading to non-critical images
            if (!img.closest('[data-lcp-element]')) {
                img.loading = 'lazy';
            }
            
            // Add decoding hint
            img.decoding = 'async';
            
            // Optimize for mobile
            if (window.innerWidth < 768 && img.dataset.mobile) {
                img.src = img.dataset.mobile;
            }
        });
    }
    
    // Performance Measurement
    measurePerformance() {
        // Measure and report Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.measureAllMetrics();
        }
        
        // Report performance after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.reportPerformanceMetrics();
            }, 5000);
        });
    }
    
    measureAllMetrics() {
        // FCP (First Contentful Paint)
        const fcpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.performanceMetrics.fcp = entry.startTime;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'FCP', {
                        event_category: 'Core Web Vitals',
                        value: Math.round(entry.startTime),
                        non_interaction: true
                    });
                }
            }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        
        // TTFB (Time to First Byte)
        const ttfbObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.performanceMetrics.ttfb = entry.responseStart - entry.requestStart;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'TTFB', {
                        event_category: 'Core Web Vitals',
                        value: Math.round(entry.responseStart - entry.requestStart),
                        non_interaction: true
                    });
                }
            }
        });
        ttfbObserver.observe({ entryTypes: ['navigation'] });
    }
    
    reportPerformanceMetrics() {
        const metrics = {
            ...this.performanceMetrics,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        
        console.log('📊 Performance Metrics:', metrics);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_report', {
                event_category: 'Performance',
                custom_metric_1: Math.round(metrics.domContentLoaded || 0),
                custom_metric_2: Math.round(metrics.loadComplete || 0),
                non_interaction: true
            });
        }
    }
    
    // Utility methods
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            this.scheduleWork(() => {
                // Initialize parallax with requestAnimationFrame
                let ticking = false;
                
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            this.updateParallax(parallaxElements);
                            ticking = false;
                        });
                        ticking = true;
                    }
                }, { passive: true });
            });
        }
    }
    
    updateParallax(elements) {
        const scrollY = window.pageYOffset;
        
        elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    setupAdvancedHovers() {
        // Use CSS hover states instead of JavaScript where possible
        const hoverElements = document.querySelectorAll('[data-hover-effect]');
        
        hoverElements.forEach(element => {
            const effect = element.dataset.hoverEffect;
            element.classList.add(`hover-${effect}`);
        });
    }
    
    // Public methods
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    
    optimizeNewContent(container) {
        // Optimize newly added content
        const newImages = container.querySelectorAll('img:not([loading])');
        newImages.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
        
        const newLazyElements = container.querySelectorAll('.lazy-load, [data-src], [data-bg]');
        newLazyElements.forEach(el => this.intersectionObserver?.observe(el));
    }
}

// Initialize Core Web Vitals Optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
    });
} else {
    window.coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
}

// Export for external use
window.optimizeNewContent = (container) => {
    if (window.coreWebVitalsOptimizer) {
        window.coreWebVitalsOptimizer.optimizeNewContent(container);
    }
};