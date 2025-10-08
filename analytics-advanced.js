/**
 * ANALYTICS E TRACKING AVANÇADO - SOCIAL MEDIA CLUB
 * Sistema completo de eventos e conversões para GA4, Facebook Pixel e LinkedIn
 * 
 * Eventos rastreados:
 * - Visualizações de página e seções
 * - Interações (cliques, scroll, tempo)
 * - Conversões (formulários, botões CTA)
 * - Engajamento social (compartilhamentos)
 * - Performance e Core Web Vitals
 */

class AdvancedAnalytics {
    constructor() {
        this.initialized = false;
        this.sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0,
            scrollDepth: 0,
            timeOnPage: 0
        };
        
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        // Wait for DOM and analytics to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTracking());
        } else {
            this.setupTracking();
        }
        
        this.initialized = true;
    }
    
    setupTracking() {
        this.trackPageView();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackFormSubmissions();
        this.trackCTAClicks();
        this.trackSocialShares();
        this.trackOutboundLinks();
        this.trackFileDownloads();
        this.trackCoreWebVitals();
        this.trackUserEngagement();
        
        console.log('🎯 Advanced Analytics initialized successfully');
    }
    
    // Core tracking methods
    trackPageView() {
        this.sessionData.pageViews++;
        
        // GA4 Enhanced Ecommerce
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                content_group1: 'Marketing Digital',
                content_group2: 'Home Page',
                custom_parameter_1: 'website',
                custom_parameter_2: 'organic'
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: document.title,
                content_category: 'Marketing Digital',
                content_type: 'website'
            });
        }
        
        // LinkedIn Insight
        if (typeof lintrk !== 'undefined') {
            lintrk('track', { conversion_id: 'LINKEDIN_CONVERSION_ID' });
        }
    }
    
    trackFormSubmissions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const service = formData.get('service') || 'unknown';
                const source = this.getLeadSource();
                
                // GA4 Lead Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        event_category: 'Form Submission',
                        event_label: service,
                        value: 1,
                        currency: 'BRL',
                        lead_source: source,
                        service_type: service
                    });
                }
                
                // Facebook Pixel Lead Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Contact Form',
                        content_category: service,
                        value: 150.00, // Estimated lead value
                        currency: 'BRL',
                        lead_source: source
                    });
                }
                
                // LinkedIn Lead Event
                if (typeof lintrk !== 'undefined') {
                    lintrk('track', { conversion_id: 'LINKEDIN_LEAD_CONVERSION' });
                }
                
                console.log('🎯 Lead conversion tracked:', { service, source });
            });
        });
    }
    
    trackCTAClicks() {
        // Track all CTA buttons
        const ctaButtons = document.querySelectorAll('.btn, .cta-button, [href="#contact"]');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                const buttonType = button.classList.contains('btn-primary') ? 'primary' : 'secondary';
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        event_category: 'CTA Interaction',
                        event_label: buttonText,
                        cta_type: buttonType,
                        page_location: window.location.href
                    });
                }
                
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'InitiateCheckout', {
                        content_name: buttonText,
                        content_category: 'CTA Click'
                    });
                }
                
                console.log('🎯 CTA click tracked:', buttonText);
            });
        });
    }
    
    trackSocialShares() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(button);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        method: platform,
                        content_type: 'website',
                        item_id: window.location.href
                    });
                }
                
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Share', {
                        content_name: document.title,
                        method: platform
                    });
                }
                
                console.log('🎯 Social share tracked:', platform);
            });
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const tracked = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.sessionData.scrollDepth = maxScroll;
            }
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            event_category: 'Engagement',
                            event_label: `${milestone}%`,
                            value: milestone
                        });
                    }
                }
            });
        });
    }
    
    trackTimeOnPage() {
        const intervals = [30, 60, 120, 300, 600]; // seconds
        const tracked = new Set();
        
        setInterval(() => {
            this.sessionData.timeOnPage = Math.round((Date.now() - this.sessionData.startTime) / 1000);
            
            intervals.forEach(interval => {
                if (this.sessionData.timeOnPage >= interval && !tracked.has(interval)) {
                    tracked.add(interval);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'user_engagement', {
                            engagement_time_msec: interval * 1000,
                            event_category: 'Engagement',
                            event_label: `${interval}s`
                        });
                    }
                }
            });
        }, 10000); // Check every 10 seconds
    }
    
    trackCoreWebVitals() {
        if ('web-vital' in window) {
            return; // Already loaded
        }
        
        // Load Web Vitals library
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
        script.onload = () => {
            const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;
            
            getCLS((metric) => this.sendWebVital(metric));
            getFID((metric) => this.sendWebVital(metric));
            getFCP((metric) => this.sendWebVital(metric));
            getLCP((metric) => this.sendWebVital(metric));
            getTTFB((metric) => this.sendWebVital(metric));
        };
        document.head.appendChild(script);
    }
    
    sendWebVital(metric) {
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                non_interaction: true
            });
        }
        
        console.log('📊 Web Vital tracked:', metric.name, metric.value);
    }
    
    trackUserEngagement() {
        let interactionCount = 0;
        const events = ['click', 'scroll', 'keydown', 'mousemove'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                interactionCount++;
                this.sessionData.interactions = interactionCount;
                
                // Track high engagement users
                if (interactionCount === 50) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'high_engagement', {
                            event_category: 'User Behavior',
                            event_label: 'Active User',
                            value: 1
                        });
                    }
                }
            }, { passive: true });
        });
    }
    
    trackOutboundLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.href;
            if (href && !href.includes(window.location.hostname)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Outbound Link',
                        event_label: href,
                        transport_type: 'beacon'
                    });
                }
            }
        });
    }
    
    trackFileDownloads() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.href;
            const fileExtensions = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|jpg|png|gif)$/i;
            
            if (href && fileExtensions.test(href)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'file_download', {
                        event_category: 'Downloads',
                        event_label: href,
                        transport_type: 'beacon'
                    });
                }
            }
        });
    }
    
    // Utility methods
    getLeadSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const referrer = document.referrer;
        
        if (utmSource) return `${utmSource}_${utmMedium || 'unknown'}`;
        if (referrer.includes('google')) return 'google_organic';
        if (referrer.includes('facebook')) return 'facebook_social';
        if (referrer.includes('linkedin')) return 'linkedin_social';
        if (referrer.includes('instagram')) return 'instagram_social';
        if (referrer) return 'referral';
        return 'direct';
    }
    
    getSocialPlatform(button) {
        if (button.classList.contains('whatsapp')) return 'whatsapp';
        if (button.classList.contains('linkedin')) return 'linkedin';
        if (button.classList.contains('facebook')) return 'facebook';
        if (button.classList.contains('copy')) return 'copy_link';
        return 'unknown';
    }
    
    // Enhanced ecommerce for service inquiries
    trackServiceInterest(serviceName, value = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', {
                currency: 'BRL',
                value: value,
                items: [{
                    item_id: serviceName.toLowerCase().replace(/\s+/g, '_'),
                    item_name: serviceName,
                    item_category: 'Digital Marketing Service',
                    quantity: 1,
                    price: value
                }]
            });
        }
    }
    
    // Custom conversion tracking
    trackCustomEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Custom',
                ...parameters,
                timestamp: Date.now()
            });
        }
        
        console.log('🎯 Custom event tracked:', eventName, parameters);
    }
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.advancedAnalytics = new AdvancedAnalytics();
    });
} else {
    window.advancedAnalytics = new AdvancedAnalytics();
}

// Export for external use
window.trackCustomEvent = (name, params) => {
    if (window.advancedAnalytics) {
        window.advancedAnalytics.trackCustomEvent(name, params);
    }
};