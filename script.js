// WebGL Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to canvas animation');
            this.fallbackAnimation();
            return;
        }

        this.particles = [];
        this.particleCount = 150;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.setupShaders();
        this.createParticles();
        this.setupEventListeners();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
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
        this.time += 1;
        this.updateParticles();
        this.render();
        requestAnimationFrame(() => this.animate());
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
        
        // Resize canvas properly
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 1,
                alpha: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 220 // Blue to purple range
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.alpha})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();

        // Handle resize for fallback
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
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
        this.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Keyboard support for hamburger menu
        this.hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        
        // Update aria attributes
        this.hamburger.setAttribute('aria-expanded', isActive);
        
        // Manage focus
        if (isActive) {
            this.navLinks[0]?.focus();
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
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
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for portfolio items
                    if (entry.target.classList.contains('portfolio-item')) {
                        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 0.1;
                        entry.target.style.animationDelay = `${delay}s`;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        const animateElements = document.querySelectorAll('.portfolio-item, .image-placeholder, .service-card, .contact-form, .process-step');
        animateElements.forEach(el => this.observer.observe(el));

        // Add special animation for image placeholders
        const imagePlaceholders = document.querySelectorAll('.image-placeholder');
        imagePlaceholders.forEach((img, index) => {
            img.style.animationDelay = `${index * 0.2}s`;
        });
    }
}

// Form handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.inputs = this.form?.querySelectorAll('input, select, textarea');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.statusElement = this.form?.querySelector('#form-status');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupRealTimeValidation();
        }
    }

    setupRealTimeValidation() {
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um e-mail válido.';
            }
        }
        // Name validation
        else if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
            }
        }
        // Message validation
        else if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        this.inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showStatus('Por favor, corrija os erros antes de enviar.', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Disable submit button
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Enviando...';

        // Simulate form submission (replace with real implementation)
        setTimeout(() => {
            this.showStatus('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.form.reset();
            this.submitButton.disabled = false;
            this.submitButton.textContent = 'Enviar Mensagem';
            
            // Clear all errors
            this.inputs.forEach(input => this.clearError(input));
        }, 2000);
    }

    showStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = type;
        
        // Hide after 5 seconds for error messages
        if (type === 'error') {
            setTimeout(() => {
                this.statusElement.style.display = 'none';
            }, 5000);
        }
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
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    
    // Initialize WebGL particle system
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
        try {
            new ParticleSystem(canvas);
        } catch (error) {
            console.warn('Failed to initialize particle system:', error);
        }
    }

    // Initialize other components
    try {
        new Navigation();
        new ScrollAnimations();
        new ContactForm();
        new ParallaxEffects();
    } catch (error) {
        console.warn('Failed to initialize components:', error);
    }

    // Hide loading screen and show content
    setTimeout(() => {
        document.body.classList.add('loaded');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1000);
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

