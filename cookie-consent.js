/**
 * COOKIE CONSENT E LGPD COMPLIANCE - SOCIAL MEDIA CLUB
 * Sistema completo de consentimento para cookies e tracking
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'smc_cookie_consent';
        this.consentData = {
            analytics: false,
            marketing: false,
            functional: true, // Always true for basic functionality
            timestamp: null
        };
        
        this.init();
    }
    
    init() {
        this.loadConsent();
        this.createConsentBanner();
        this.setupEventListeners();
    }
    
    loadConsent() {
        const saved = localStorage.getItem(this.cookieName);
        if (saved) {
            this.consentData = { ...this.consentData, ...JSON.parse(saved) };
            this.applyConsent();
        } else {
            this.showConsentBanner();
        }
    }
    
    createConsentBanner() {
        if (document.getElementById('cookie-consent-banner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-banner">
                <div class="cookie-content">
                    <div class="cookie-text">
                        <h3>🍪 Consentimento de Cookies e Dados</h3>
                        <p>Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o desempenho do site e personalizar conteúdo. Seus dados são processados conforme nossa <a href="#privacy" target="_blank">Política de Privacidade</a> e a LGPD.</p>
                    </div>
                    <div class="cookie-buttons">
                        <button class="btn-accept-all" onclick="cookieConsent.acceptAll()">Aceitar Todos</button>
                        <button class="btn-customize" onclick="cookieConsent.showCustomization()">Personalizar</button>
                        <button class="btn-reject" onclick="cookieConsent.rejectAll()">Rejeitar Opcionais</button>
                    </div>
                </div>
                
                <div class="cookie-customization" style="display: none;">
                    <h4>Personalizar Cookies</h4>
                    <div class="cookie-options">
                        <div class="cookie-option">
                            <label>
                                <input type="checkbox" checked disabled>
                                <span class="cookie-type">Funcionais (Obrigatórios)</span>
                                <small>Necessários para o funcionamento básico do site</small>
                            </label>
                        </div>
                        <div class="cookie-option">
                            <label>
                                <input type="checkbox" id="analytics-consent">
                                <span class="cookie-type">Analytics</span>
                                <small>Google Analytics, métricas de performance e melhorias</small>
                            </label>
                        </div>
                        <div class="cookie-option">
                            <label>
                                <input type="checkbox" id="marketing-consent">
                                <span class="cookie-type">Marketing</span>
                                <small>Facebook Pixel, LinkedIn Insight, remarketing</small>
                            </label>
                        </div>
                    </div>
                    <div class="cookie-buttons">
                        <button class="btn-save" onclick="cookieConsent.saveCustomization()">Salvar Preferências</button>
                        <button class="btn-back" onclick="cookieConsent.hideCustomization()">Voltar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        this.addConsentStyles();
    }
    
    addConsentStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease;
                border-top: 2px solid var(--primary-color, #667eea);
            }
            
            #cookie-consent-banner.show {
                transform: translateY(0);
            }
            
            .cookie-banner {
                max-width: 1200px;
                margin: 0 auto;
                padding: 1.5rem;
                color: white;
            }
            
            .cookie-content {
                display: flex;
                align-items: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .cookie-text {
                flex: 1;
                min-width: 300px;
            }
            
            .cookie-text h3 {
                margin: 0 0 0.5rem 0;
                font-size: 1.2rem;
                color: var(--primary-color, #667eea);
            }
            
            .cookie-text p {
                margin: 0;
                line-height: 1.5;
                opacity: 0.9;
            }
            
            .cookie-text a {
                color: var(--primary-color, #667eea);
                text-decoration: underline;
            }
            
            .cookie-buttons {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .cookie-buttons button {
                padding: 0.7rem 1.2rem;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            .btn-accept-all {
                background: var(--primary-color, #667eea);
                color: white;
            }
            
            .btn-accept-all:hover {
                background: var(--primary-color-dark, #5a67d8);
            }
            
            .btn-customize {
                background: transparent;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .btn-customize:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .btn-reject {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            
            .btn-reject:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .cookie-customization {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .cookie-customization h4 {
                margin: 0 0 1rem 0;
                color: var(--primary-color, #667eea);
            }
            
            .cookie-options {
                display: grid;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .cookie-option label {
                display: flex;
                align-items: flex-start;
                gap: 0.8rem;
                cursor: pointer;
                padding: 0.8rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                transition: background 0.3s ease;
            }
            
            .cookie-option label:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .cookie-option input[type="checkbox"] {
                margin-top: 0.2rem;
            }
            
            .cookie-type {
                font-weight: 600;
                display: block;
                margin-bottom: 0.3rem;
            }
            
            .cookie-option small {
                opacity: 0.8;
                font-size: 0.85rem;
                line-height: 1.4;
            }
            
            .btn-save {
                background: var(--primary-color, #667eea);
                color: white;
            }
            
            .btn-back {
                background: transparent;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 1rem;
                }
                
                .cookie-buttons {
                    justify-content: stretch;
                }
                
                .cookie-buttons button {
                    flex: 1;
                    min-width: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    showConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            setTimeout(() => banner.classList.add('show'), 1000);
        }
    }
    
    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }
    
    showCustomization() {
        const customization = document.querySelector('.cookie-customization');
        const content = document.querySelector('.cookie-content');
        
        if (customization && content) {
            content.style.display = 'none';
            customization.style.display = 'block';
            
            // Set current preferences
            document.getElementById('analytics-consent').checked = this.consentData.analytics;
            document.getElementById('marketing-consent').checked = this.consentData.marketing;
        }
    }
    
    hideCustomization() {
        const customization = document.querySelector('.cookie-customization');
        const content = document.querySelector('.cookie-content');
        
        if (customization && content) {
            customization.style.display = 'none';
            content.style.display = 'flex';
        }
    }
    
    acceptAll() {
        this.consentData = {
            analytics: true,
            marketing: true,
            functional: true,
            timestamp: Date.now()
        };
        
        this.saveConsent();
        this.applyConsent();
        this.hideConsentBanner();
    }
    
    rejectAll() {
        this.consentData = {
            analytics: false,
            marketing: false,
            functional: true,
            timestamp: Date.now()
        };
        
        this.saveConsent();
        this.applyConsent();
        this.hideConsentBanner();
    }
    
    saveCustomization() {
        this.consentData = {
            analytics: document.getElementById('analytics-consent').checked,
            marketing: document.getElementById('marketing-consent').checked,
            functional: true,
            timestamp: Date.now()
        };
        
        this.saveConsent();
        this.applyConsent();
        this.hideConsentBanner();
    }
    
    saveConsent() {
        localStorage.setItem(this.cookieName, JSON.stringify(this.consentData));
        
        // Track consent choice (if analytics allowed)
        if (this.consentData.analytics && typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                event_category: 'Privacy',
                analytics_consent: this.consentData.analytics,
                marketing_consent: this.consentData.marketing
            });
        }
    }
    
    applyConsent() {
        // Apply Google Analytics consent
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': this.consentData.analytics ? 'granted' : 'denied',
                'ad_storage': this.consentData.marketing ? 'granted' : 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
            });
        }
        
        // Apply Facebook Pixel consent
        if (typeof fbq !== 'undefined') {
            if (this.consentData.marketing) {
                fbq('consent', 'grant');
            } else {
                fbq('consent', 'revoke');
            }
        }
        
        // Disable/enable tracking scripts based on consent
        if (!this.consentData.analytics) {
            this.disableAnalytics();
        }
        
        if (!this.consentData.marketing) {
            this.disableMarketing();
        }
        
        console.log('🍪 Cookie consent applied:', this.consentData);
    }
    
    disableAnalytics() {
        // Disable Google Analytics
        window['ga-disable-G-XXXXXXXXXX'] = true;
        
        // Clear analytics cookies
        this.deleteCookies(['_ga', '_ga_*', '_gid', '_gat']);
    }
    
    disableMarketing() {
        // Clear marketing cookies
        this.deleteCookies(['_fbp', '_fbc', 'fr']);
    }
    
    deleteCookies(patterns) {
        patterns.forEach(pattern => {
            if (pattern.includes('*')) {
                // Handle wildcard patterns
                const prefix = pattern.replace('*', '');
                document.cookie.split(';').forEach(cookie => {
                    const name = cookie.split('=')[0].trim();
                    if (name.startsWith(prefix)) {
                        this.deleteCookie(name);
                    }
                });
            } else {
                this.deleteCookie(pattern);
            }
        });
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }
    
    setupEventListeners() {
        // Add privacy policy link handler
        document.addEventListener('click', (e) => {
            if (e.target.getAttribute('href') === '#privacy') {
                e.preventDefault();
                this.showPrivacyPolicy();
            }
        });
    }
    
    showPrivacyPolicy() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="privacy-modal">
                <div class="privacy-content">
                    <div class="privacy-header">
                        <h2>🔒 Política de Privacidade e Cookies</h2>
                        <button class="close-privacy" onclick="this.closest('.privacy-modal').remove()">×</button>
                    </div>
                    <div class="privacy-body">
                        <h3>Informações que Coletamos</h3>
                        <p>Coletamos informações quando você:</p>
                        <ul>
                            <li>Preenche nosso formulário de contato</li>
                            <li>Navega pelo site (dados de analytics)</li>
                            <li>Interage com nossos anúncios (remarketing)</li>
                        </ul>
                        
                        <h3>Como Usamos Seus Dados</h3>
                        <ul>
                            <li><strong>Funcionais:</strong> Processar formulários, melhorar funcionalidade</li>
                            <li><strong>Analytics:</strong> Google Analytics para métricas de performance</li>
                            <li><strong>Marketing:</strong> Facebook Pixel, LinkedIn para remarketing</li>
                        </ul>
                        
                        <h3>Seus Direitos (LGPD)</h3>
                        <p>Você tem direito a:</p>
                        <ul>
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incorretos</li>
                            <li>Excluir seus dados</li>
                            <li>Portabilidade dos dados</li>
                            <li>Revogar consentimento a qualquer momento</li>
                        </ul>
                        
                        <h3>Contato para Dados</h3>
                        <p>Para exercer seus direitos ou dúvidas sobre privacidade:</p>
                        <p><strong>Email:</strong> socialmidiacluboficial@gmail.com</p>
                        <p><strong>Assunto:</strong> LGPD - Solicitação de Dados</p>
                        
                        <h3>Cookies Utilizados</h3>
                        <div class="cookie-details">
                            <div class="cookie-category">
                                <h4>Funcionais (Obrigatórios)</h4>
                                <p>Armazenam preferências de consentimento e funcionalidade básica</p>
                            </div>
                            <div class="cookie-category">
                                <h4>Analytics (Opcionais)</h4>
                                <p>Google Analytics: _ga, _gid, _gat - Métricas de uso do site</p>
                            </div>
                            <div class="cookie-category">
                                <h4>Marketing (Opcionais)</h4>
                                <p>Facebook: _fbp, _fbc - Remarketing e medição de anúncios</p>
                                <p>LinkedIn: li_gc, lidc - Remarketing profissional</p>
                            </div>
                        </div>
                    </div>
                    <div class="privacy-footer">
                        <button class="btn-update-consent" onclick="cookieConsent.updateConsent()">Atualizar Consentimento</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.className = 'privacy-modal-overlay';
        document.body.appendChild(modal);
        this.addPrivacyStyles();
    }
    
    addPrivacyStyles() {
        if (document.getElementById('privacy-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'privacy-styles';
        style.textContent = `
            .privacy-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .privacy-modal {
                background: white;
                border-radius: 12px;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            
            .privacy-content {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            
            .privacy-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                background: var(--primary-color, #667eea);
                color: white;
            }
            
            .privacy-header h2 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .close-privacy {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-privacy:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .privacy-body {
                padding: 1.5rem;
                overflow-y: auto;
                flex: 1;
                line-height: 1.6;
            }
            
            .privacy-body h3 {
                color: var(--primary-color, #667eea);
                margin-top: 1.5rem;
                margin-bottom: 0.8rem;
            }
            
            .privacy-body h3:first-child {
                margin-top: 0;
            }
            
            .cookie-category {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 6px;
                margin-bottom: 0.8rem;
            }
            
            .cookie-category h4 {
                margin: 0 0 0.5rem 0;
                color: var(--primary-color, #667eea);
            }
            
            .privacy-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #eee;
                background: #f8f9fa;
            }
            
            .btn-update-consent {
                background: var(--primary-color, #667eea);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
            }
            
            .btn-update-consent:hover {
                background: var(--primary-color-dark, #5a67d8);
            }
        `;
        document.head.appendChild(style);
    }
    
    updateConsent() {
        document.querySelector('.privacy-modal-overlay').remove();
        this.showConsentBanner();
    }
    
    // Public method to check consent status
    hasConsent(type) {
        return this.consentData[type] || false;
    }
    
    // Public method to get all consent data
    getConsentData() {
        return { ...this.consentData };
    }
}

// Initialize cookie consent system
const cookieConsent = new CookieConsent();

// Set default consent state before any tracking loads
if (typeof gtag !== 'undefined') {
    gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted',
        'wait_for_update': 2000
    });
}

// Export for external use
window.cookieConsent = cookieConsent;