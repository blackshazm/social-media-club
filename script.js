// Performance monitoring com throttling (produção)
const performanceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
            // Log apenas em desenvolvimento
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('[Performance] LCP:', entry.startTime.toFixed(0) + 'ms');
            }
        }
    });
});

try {
    performanceObserver.observe({entryTypes: ['largest-contentful-paint']});
} catch (e) {
    // Fallback silencioso para navegadores antigos
}

// Intersection Observer para lazy loading
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const observeElements = (elements, callback) => {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(el => observer.observe(el));
    } else {
        // Fallback para navegadores antigos
        elements.forEach(callback);
    }
};

// WebGL Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.isWebGLSupported = this.initWebGL();
        
        if (!this.isWebGLSupported) {
            console.warn('WebGL not supported, falling back to canvas animation');
            this.fallbackAnimation();
            return;
        }

        this.particles = [];
        this.particleCount = Math.min(150, Math.floor(window.innerWidth / 10)); // Adaptativo
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.isAnimating = false;
        
        this.init();
    }

    initWebGL() {
        try {
            this.gl = this.canvas.getContext('webgl', {
                alpha: true,
                antialias: false,
                depth: false,
                stencil: false,
                powerPreference: 'high-performance'
            }) || this.canvas.getContext('experimental-webgl');
            
            return !!this.gl;
        } catch (e) {
            return false;
        }
    }

    init() {
        this.resizeCanvas();
        this.setupShaders();
        this.createParticles();
        this.setupEventListeners();
        
        // Iniciar animação apenas quando necessário
        requestIdleCallback(() => {
            this.animate();
        });
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limitar DPR para performance
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    setupShaders() {
        // Vertex shader
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_size;
            attribute vec3 a_color;
            attribute float a_alpha;
            
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                vec2 position = a_position;
                
                // Mouse interaction
                vec2 mouseDistance = position - u_mouse;
                float distance = length(mouseDistance);
                if (distance < 100.0) {
                    position += normalize(mouseDistance) * (100.0 - distance) * 0.5;
                }
                
                // Convert from pixels to clip space
                vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
                clipSpace.y *= -1.0;
                
                gl_Position = vec4(clipSpace, 0.0, 1.0);
                gl_PointSize = a_size + sin(u_time * 0.01 + a_position.x * 0.01) * 2.0;
                
                v_color = a_color;
                v_alpha = a_alpha;
            }
        `;

        // Fragment shader
        const fragmentShaderSource = `
            precision mediump float;
            
            varying vec3 v_color;
            varying float v_alpha;
            
            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float distance = length(center);
                
                if (distance > 0.5) {
                    discard;
                }
                
                float alpha = (1.0 - distance * 2.0) * v_alpha;
                gl_FragColor = vec4(v_color, alpha);
            }
        `;

        this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
        this.gl.useProgram(this.program);

        // Get attribute and uniform locations
        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');
        this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
        this.alphaLocation = this.gl.getAttribLocation(this.program, 'a_alpha');
        
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        this.mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }

    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 8 + 2,
                color: [
                    0.4 + Math.random() * 0.6,  // R
                    0.3 + Math.random() * 0.7,  // G
                    0.8 + Math.random() * 0.2   // B
                ],
                alpha: Math.random() * 0.8 + 0.2,
                life: Math.random() * 100
            });
        }

        this.setupBuffers();
    }

    setupBuffers() {
        const positions = [];
        const sizes = [];
        const colors = [];
        const alphas = [];

        this.particles.forEach(particle => {
            positions.push(particle.x, particle.y);
            sizes.push(particle.size);
            colors.push(...particle.color);
            alphas.push(particle.alpha);
        });

        // Position buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

        // Size buffer
        this.sizeBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.STATIC_DRAW);

        // Color buffer
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

        // Alpha buffer
        this.alphaBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(alphas), this.gl.STATIC_DRAW);
    }

    updateParticles() {
        const positions = [];

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life += 1;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Add some randomness
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;

            // Limit velocity
            const maxSpeed = 2;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
                particle.vx = (particle.vx / speed) * maxSpeed;
                particle.vy = (particle.vy / speed) * maxSpeed;
            }

            positions.push(particle.x, particle.y);
        });

        // Update position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
    }

    render() {
        // Clear canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Enable blending for transparency
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Set uniforms
        this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.timeLocation, this.time);
        this.gl.uniform2f(this.mouseLocation, this.mouse.x, this.mouse.y);

        // Bind attributes
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sizeBuffer);
        this.gl.enableVertexAttribArray(this.sizeLocation);
        this.gl.vertexAttribPointer(this.sizeLocation, 1, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.enableVertexAttribArray(this.colorLocation);
        this.gl.vertexAttribPointer(this.colorLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.alphaBuffer);
        this.gl.enableVertexAttribArray(this.alphaLocation);
        this.gl.vertexAttribPointer(this.alphaLocation, 1, this.gl.FLOAT, false, 0, 0);

        // Draw particles
        this.gl.drawArrays(this.gl.POINTS, 0, this.particles.length);
    }

    animate() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            
            const frame = () => {
                // Throttle para 60fps ou menos em devices baixa performance
                if (performance.now() - this.lastFrameTime >= 16.67) {
                    this.time += 1;
                    this.updateParticles();
                    this.render();
                    this.lastFrameTime = performance.now();
                }
                
                if (this.isAnimating) {
                    requestAnimationFrame(frame);
                }
            };
            
            this.lastFrameTime = 0;
            requestAnimationFrame(frame);
        }
    }

    // Método para pausar animação quando não visível
    pauseAnimation() {
        this.isAnimating = false;
    }

    resumeAnimation() {
        if (!this.isAnimating) {
            this.animate();
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    fallbackAnimation() {
        // Fallback canvas 2D animation for browsers without WebGL
        const ctx = this.canvas.getContext('2d');
        const particles = [];
        
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${particle.alpha})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM carregar completamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }

    setupNavigation() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        if (!this.navbar || !this.hamburger || !this.navMenu) {
            // Log apenas em desenvolvimento
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.error('[Navigation] Required elements not found');
            }
            return;
        }

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        
        // Log apenas em desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[Navigation] Mobile menu initialized successfully');
        }
    }

    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                this.navbar.style.boxShadow = 'none';
            }
        });
    }

    setupMobileMenu() {
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = this.navMenu.classList.contains('active');
            
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
            
            // Update ARIA attributes
            this.hamburger.setAttribute('aria-expanded', !isActive);
            
            // Log apenas em desenvolvimento
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('[Navigation] Menu toggled:', !isActive ? 'opened' : 'closed');
            }
        });

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        
        // Log apenas em desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[Navigation] Menu closed');
        }
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimations();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, this.observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe cards and other elements
        const cards = document.querySelectorAll('.service-card, .portfolio-item, .process-step');
        cards.forEach(card => {
            observer.observe(card);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 40);
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            this.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Simulate form submission
        this.showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        this.form.reset();
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            font-weight: 500;
            ${type === 'success' 
                ? 'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' 
                : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
            }
        `;
        
        // Add to form
        this.form.appendChild(messageEl);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Parallax effects
class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebGL particle system with visibility observer
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        const particleSystem = new ParticleSystem(canvas);
        
        // Pause/resume animation based on visibility
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (particleSystem.pauseAnimation && particleSystem.resumeAnimation) {
                        if (entry.isIntersecting) {
                            particleSystem.resumeAnimation();
                        } else {
                            particleSystem.pauseAnimation();
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(canvas);
        }
    }

    // Initialize other components with lazy loading
    requestIdleCallback(() => {
        new Navigation();
        new ScrollAnimations();
        new ContactForm();
        new ParallaxEffects();
    });

    // Add loading animation
    document.body.classList.add('loaded');
    
    // Remove preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 300);
        }, 500);
    }
});

// Add some CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .form-message {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(-10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

