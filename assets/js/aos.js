/*!
 * AOS (Animate On Scroll) - Minimal Version 
 * Lightweight animation library for scroll-triggered animations
 */

class AnimateOnScroll {
    constructor() {
        this.elements = [];
        this.isInitialized = false;
        this.options = {
            duration: 600,
            easing: 'ease-in-out',
            offset: 100,
            delay: 0,
            once: true
        };
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.elements = document.querySelectorAll('[data-aos]');
        this.setupObserver();
        this.isInitialized = true;
    }

    setupObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: `0px 0px -${this.options.offset}px 0px`
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    
                    if (this.options.once) {
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        this.elements.forEach(element => {
            this.prepareElement(element);
            this.observer.observe(element);
        });
    }

    prepareElement(element) {
        const animationType = element.getAttribute('data-aos');
        const duration = element.getAttribute('data-aos-duration') || this.options.duration;
        const delay = element.getAttribute('data-aos-delay') || this.options.delay;
        const easing = element.getAttribute('data-aos-easing') || this.options.easing;

        // Set initial styles
        element.style.transition = `all ${duration}ms ${easing}`;
        element.style.transitionDelay = `${delay}ms`;
        
        // Set initial animation state
        switch (animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                break;
            case 'fade-down':
                element.style.opacity = '0';
                element.style.transform = 'translateY(-50px)';
                break;
            case 'fade-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                break;
            case 'fade-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                break;
            case 'fade-in':
                element.style.opacity = '0';
                break;
            case 'zoom-in':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
            case 'zoom-out':
                element.style.opacity = '0';
                element.style.transform = 'scale(1.2)';
                break;
            case 'slide-up':
                element.style.transform = 'translateY(100px)';
                break;
            case 'slide-down':
                element.style.transform = 'translateY(-100px)';
                break;
            case 'flip-left':
                element.style.opacity = '0';
                element.style.transform = 'rotateY(-90deg)';
                break;
            case 'flip-right':
                element.style.opacity = '0';
                element.style.transform = 'rotateY(90deg)';
                break;
            default:
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
        }
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-aos');
        
        // Reset to animated state
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0) scale(1) rotateY(0)';
        
        // Add data attribute to indicate animation completed
        element.setAttribute('data-aos-animated', 'true');
        
        // Trigger custom event
        element.dispatchEvent(new CustomEvent('aos:in', {
            detail: { element, animationType }
        }));
    }

    refresh() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.elements.forEach(element => {
            if (!element.hasAttribute('data-aos-animated')) {
                this.prepareElement(element);
                this.observer.observe(element);
            }
        });
    }

    refreshHard() {
        this.elements.forEach(element => {
            this.observer.unobserve(element);
            element.removeAttribute('data-aos-animated');
        });
        this.init();
    }

    disable() {
        this.elements.forEach(element => {
            this.observer.unobserve(element);
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AOS = new AnimateOnScroll();
    });
} else {
    window.AOS = new AnimateOnScroll();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimateOnScroll;
}