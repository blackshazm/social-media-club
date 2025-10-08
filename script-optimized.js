// OPTIMIZED SCRIPT.JS - Performance Critical Version
// Lazy load all non-critical JavaScript after DOMContentLoaded

// Critical performance monitoring with minimal overhead
const criticalPerformance = (() => {
    let fcpReported = false;
    let lcpReported = false;
    
    const reportMetric = (name, value) => {
        // Only report in production and once per metric
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            if (window.gtag) {
                window.gtag('event', 'performance_metric', {
                    event_category: 'Web Vitals',
                    event_label: name,
                    value: Math.round(value)
                });
            }
        }
    };

    try {
        const perfObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint' && !fcpReported) {
                    reportMetric('FCP', entry.startTime);
                    fcpReported = true;
                } else if (entry.entryType === 'largest-contentful-paint' && !lcpReported) {
                    reportMetric('LCP', entry.startTime);
                    lcpReported = true;
                }
            });
        });
        
        perfObserver.observe({entryTypes: ['paint', 'largest-contentful-paint']});
    } catch (e) {
        // Silent fail for unsupported browsers
    }
})();

// Critical DOM Ready Functions - Only essential functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Critical Mobile Menu Toggle (immediate functionality)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
    }
    
    // Critical Smooth Scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    // Load non-critical functionality after a delay
    setTimeout(() => {
        loadNonCriticalFeatures();
    }, 1000);
});

// Non-Critical Features - Loaded after initial render
function loadNonCriticalFeatures() {
    
    // Lazy load WebGL only if user hasn't scrolled past hero
    const heroSection = document.querySelector('.hero');
    const canvas = document.getElementById('webgl-canvas');
    
    if (heroSection && canvas && window.scrollY < window.innerHeight) {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion && window.WebGLRenderingContext) {
            initWebGLParticles();
        }
    }
    
    // Initialize form handling
    initContactForm();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize intersection observer for animations
    initAnimations();
}

// Optimized WebGL Particles (only load if needed)
function initWebGLParticles() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    
    // Responsive canvas sizing
    const resizeCanvas = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    };
    
    resizeCanvas();
    
    const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power'
    });
    
    if (!gl) return;
    
    // Simple particle system - minimal GPU usage
    const particles = [];
    const maxParticles = Math.min(50, Math.floor(canvas.width * canvas.height / 10000));
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: Math.random()
        });
    }
    
    function animate() {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.002;
            
            if (particle.life <= 0 || particle.x < 0 || particle.x > canvas.width || 
                particle.y < 0 || particle.y > canvas.height) {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
                particle.life = 1;
            }
        });
        
        // Only continue animation if canvas is visible
        if (canvas.offsetParent !== null) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
    
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause WebGL rendering
        } else {
            animate();
        }
    });
    
    // Resize handler with throttling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    });
}

// Optimized Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('#submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const formMessages = document.getElementById('form-messages');
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        field.classList.remove('field-valid', 'field-invalid');
        
        if (field.required && !value) {
            field.classList.add('field-invalid');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('field-invalid');
                return false;
            }
        }
        
        if (value) {
            field.classList.add('field-valid');
        }
        
        return true;
    }
    
    function clearFieldError(e) {
        e.target.classList.remove('field-invalid');
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({target: input})) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showMessage('Por favor, corrija os campos destacados.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('field-valid', 'field-invalid');
                });
            } else {
                throw new Error('Network response was not ok');
            }
            
        } catch (error) {
            showMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    
    function showMessage(message, type) {
        formMessages.style.display = 'block';
        
        if (type === 'success') {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
        } else {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
        }
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            formMessages.style.display = 'none';
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
        }, 5000);
    }
}

// Optimized Scroll Effects
function initScrollEffects() {
    let ticking = false;
    const navbar = document.querySelector('.navbar');
    
    function updateScrollState() {
        const scrolled = window.pageYOffset > 50;
        
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Optimized Animations with Intersection Observer
function initAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// Utility function for throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Utility function for debouncing
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Emergency fallback for critical functionality
window.addEventListener('error', function(e) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Critical error:', e.error);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWebGLParticles,
        initContactForm,
        initScrollEffects,
        initAnimations
    };
}