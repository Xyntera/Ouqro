// Modern JavaScript ES6+ for Ouqro Website
class OuqroWebsite {
    constructor() {
        this.isLoaded = false;
        this.animations = new Map();
        this.observers = new Map();
        this.isDarkMode = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initThemeToggle();
        this.initIntersectionObserver();
        this.initScrollAnimations();
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initFormValidation();
        this.initPerformanceOptimizations();
        
        // Mark as loaded
        this.isLoaded = true;
        document.body.classList.add('loaded');
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMLoaded();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.handleWindowLoaded();
        });

        // Resize handling with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });

        // Scroll handling with throttle
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                    scrollTimeout = null;
                }, 16); // ~60fps
            }
        });
    }

    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = this.isDarkMode ? 'light' : 'dark';
                this.setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    setTheme(theme) {
        this.isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', this.isDarkMode ? '#1a202c' : '#ffffff');
        }
    }

    initIntersectionObserver() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('[data-animate]');
        animatableElements.forEach(el => {
            animationObserver.observe(el);
        });

        this.observers.set('animation', animationObserver);

        // Lazy loading observer
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.lazyLoadElement(entry.target);
                    lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const lazyElements = document.querySelectorAll('[data-lazy]');
        lazyElements.forEach(el => {
            lazyLoadObserver.observe(el);
        });

        this.observers.set('lazyLoad', lazyLoadObserver);
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = parseInt(element.getAttribute('data-delay')) || 0;

        setTimeout(() => {
            switch (animationType) {
                case 'fade-up':
                    element.classList.add('animate-fade-in-up');
                    break;
                case 'fade-left':
                    element.classList.add('animate-fade-in-left');
                    break;
                case 'fade-right':
                    element.classList.add('animate-fade-in-right');
                    break;
                case 'scale':
                    this.animateScale(element);
                    break;
                case 'counter':
                    this.animateCounter(element);
                    break;
                default:
                    element.classList.add('animate-fade-in-up');
            }
            
            element.setAttribute('data-animated', 'true');
        }, delay);
    }

    animateScale(element) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s ease-out';
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * this.easeOutCubic(progress));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    lazyLoadElement(element) {
        const src = element.getAttribute('data-lazy');
        if (src) {
            if (element.tagName === 'IMG') {
                element.src = src;
                element.removeAttribute('data-lazy');
                element.addEventListener('load', () => {
                    element.classList.add('loaded');
                });
            }
        }
    }

    initScrollAnimations() {
        // Header scroll effect
        const header = document.querySelector('.header');
        if (header) {
            let lastScrollY = window.scrollY;
            
            this.handleHeaderScroll = () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
            };
        }

        // Parallax effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        this.handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * rate);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            if (mobileMenuOverlay) {
                mobileMenuOverlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });

            // Close menu on link click
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const body = document.body;

        mobileMenu.classList.add('active');
        mobileMenuToggle.classList.add('active');
        body.classList.add('menu-open');

        // Animate menu items
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-fade-in-up');
            }, index * 100);
        });
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const body = document.body;

        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');

        // Reset menu item animations
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach(item => {
            item.classList.remove('animate-fade-in-up');
        });
    }

    initSmoothScrolling() {
        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    await this.submitForm(form);
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Display validation result
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }
    }

    async submitForm(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showFormMessage(form, 'Thank you! Your message has been sent.', 'success');
            form.reset();
            
        } catch (error) {
            this.showFormMessage(form, 'Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showFormMessage(form, message, type) {
        let messageElement = form.querySelector('.form-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            form.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.opacity = '1';
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }

    initPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Service Worker registration (if available)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                console.log('Service Worker registration failed');
            });
        }
        
        // Critical font loading
        this.loadCriticalFonts();
    }

    preloadCriticalResources() {
        const criticalImages = [
            '/assets/images/hero-bg.webp',
            '/assets/images/logo.svg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    loadCriticalFonts() {
        if ('fonts' in document) {
            Promise.all([
                document.fonts.load('400 1rem Inter'),
                document.fonts.load('600 1rem Inter'),
                document.fonts.load('700 1rem Inter')
            ]).then(() => {
                document.body.classList.add('fonts-loaded');
            });
        }
    }

    handleDOMLoaded() {
        console.log('DOM Content Loaded');
        // Add any DOM-specific initialization here
    }

    handleWindowLoaded() {
        console.log('Window Loaded');
        // Remove loading states, start non-critical animations
        document.body.classList.add('window-loaded');
    }

    handleResize() {
        // Handle responsive changes
        this.updateViewportHeight();
    }

    handleScroll() {
        if (this.handleHeaderScroll) {
            this.handleHeaderScroll();
        }
        
        if (this.handleParallax) {
            this.handleParallax();
        }
    }

    updateViewportHeight() {
        // Fix mobile viewport height issues
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API
    addAnimation(name, element, animation) {
        this.animations.set(name, { element, animation });
    }

    removeAnimation(name) {
        this.animations.delete(name);
    }

    getAnimation(name) {
        return this.animations.get(name);
    }
}

// Initialize the website
const ouqroWebsite = new OuqroWebsite();

// Expose to global scope for debugging
window.ouqroWebsite = ouqroWebsite;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OuqroWebsite;
}