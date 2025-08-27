/*!
 * Simple Slider - Lightweight Swiper Alternative
 * Modern carousel/slider component with touch support
 */

class SimpleSlider {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) return;

        this.options = {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            autoplay: false,
            autoplayDelay: 3000,
            pagination: true,
            navigation: true,
            effect: 'slide', // 'slide', 'fade', 'cube'
            speed: 300,
            breakpoints: {},
            ...options
        };

        this.currentIndex = 0;
        this.slides = [];
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.setupStructure();
        this.setupSlides();
        this.setupControls();
        this.setupEventListeners();
        this.updateSlider();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    setupStructure() {
        this.container.classList.add('simple-slider');
        
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'simple-slider-wrapper';
        
        // Move existing content to wrapper
        while (this.container.firstChild) {
            this.wrapper.appendChild(this.container.firstChild);
        }
        
        this.container.appendChild(this.wrapper);
        
        // Add CSS
        this.addStyles();
    }

    addStyles() {
        const styles = `
            .simple-slider {
                position: relative;
                overflow: hidden;
                width: 100%;
            }
            
            .simple-slider-wrapper {
                display: flex;
                transition: transform ${this.options.speed}ms ease-in-out;
                width: 100%;
            }
            
            .simple-slider-slide {
                flex-shrink: 0;
                width: calc((100% - ${(this.options.slidesPerView - 1) * this.options.spaceBetween}px) / ${this.options.slidesPerView});
                margin-right: ${this.options.spaceBetween}px;
            }
            
            .simple-slider-slide:last-child {
                margin-right: 0;
            }
            
            .simple-slider-pagination {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
            }
            
            .simple-slider-pagination-bullet {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .simple-slider-pagination-bullet.active {
                background: #007bff;
                transform: scale(1.2);
            }
            
            .simple-slider-navigation {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                color: #333;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .simple-slider-navigation:hover {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .simple-slider-navigation:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .simple-slider-prev {
                left: 20px;
            }
            
            .simple-slider-next {
                right: 20px;
            }
            
            .simple-slider-fade .simple-slider-wrapper {
                position: relative;
            }
            
            .simple-slider-fade .simple-slider-slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                margin-right: 0;
                opacity: 0;
                transition: opacity ${this.options.speed}ms ease-in-out;
            }
            
            .simple-slider-fade .simple-slider-slide.active {
                opacity: 1;
            }
            
            @media (max-width: 768px) {
                .simple-slider-navigation {
                    display: none;
                }
            }
        `;
        
        if (!document.getElementById('simple-slider-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'simple-slider-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    setupSlides() {
        this.slides = Array.from(this.wrapper.children);
        this.slides.forEach((slide, index) => {
            slide.classList.add('simple-slider-slide');
            if (index === 0 && this.options.effect === 'fade') {
                slide.classList.add('active');
            }
        });
        
        if (this.options.effect === 'fade') {
            this.container.classList.add('simple-slider-fade');
        }
    }

    setupControls() {
        if (this.options.navigation && this.slides.length > 1) {
            this.createNavigationButtons();
        }
        
        if (this.options.pagination && this.slides.length > 1) {
            this.createPagination();
        }
    }

    createNavigationButtons() {
        this.prevButton = document.createElement('button');
        this.prevButton.className = 'simple-slider-navigation simple-slider-prev';
        this.prevButton.innerHTML = '‹';
        this.prevButton.setAttribute('aria-label', 'Previous slide');
        
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'simple-slider-navigation simple-slider-next';
        this.nextButton.innerHTML = '›';
        this.nextButton.setAttribute('aria-label', 'Next slide');
        
        this.container.appendChild(this.prevButton);
        this.container.appendChild(this.nextButton);
        
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());
    }

    createPagination() {
        this.paginationContainer = document.createElement('div');
        this.paginationContainer.className = 'simple-slider-pagination';
        
        const slidesToShow = Math.ceil(this.slides.length / this.options.slidesPerView);
        
        for (let i = 0; i < slidesToShow; i++) {
            const bullet = document.createElement('button');
            bullet.className = 'simple-slider-pagination-bullet';
            bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
            
            if (i === 0) {
                bullet.classList.add('active');
            }
            
            bullet.addEventListener('click', () => this.goToSlide(i));
            this.paginationContainer.appendChild(bullet);
        }
        
        this.container.parentNode.insertBefore(this.paginationContainer, this.container.nextSibling);
    }

    setupEventListeners() {
        // Touch/Mouse events for swipe
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Keyboard navigation
        this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Pause autoplay on hover
        if (this.options.autoplay) {
            this.container.addEventListener('mouseenter', () => this.stopAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Responsive breakpoints
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.stopAutoplay();
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.touches[0].clientX;
        const diffX = this.startX - this.currentX;
        
        if (Math.abs(diffX) > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        if (!this.isDragging) return;
        
        const diffX = this.startX - this.currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.isDragging = false;
        this.startAutoplay();
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.startX = e.clientX;
        this.isDragging = true;
        this.stopAutoplay();
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX;
    }

    handleMouseUp() {
        if (!this.isDragging) return;
        
        const diffX = this.startX - this.currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
        
        this.isDragging = false;
        this.startAutoplay();
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
        }
    }

    handleResize() {
        this.updateSlider();
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const maxIndex = Math.ceil(this.slides.length / this.options.slidesPerView) - 1;
        
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else if (this.options.loop) {
            this.currentIndex = 0;
        }
        
        this.updateSlider();
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else if (this.options.loop) {
            this.currentIndex = Math.ceil(this.slides.length / this.options.slidesPerView) - 1;
        }
        
        this.updateSlider();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.currentIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        this.isAnimating = true;
        
        if (this.options.effect === 'fade') {
            this.updateFadeSlider();
        } else {
            this.updateSlideSlider();
        }
        
        this.updateControls();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.options.speed);
    }

    updateSlideSlider() {
        const slideWidth = 100 / this.options.slidesPerView;
        const translateX = -this.currentIndex * slideWidth;
        this.wrapper.style.transform = `translateX(${translateX}%)`;
    }

    updateFadeSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateControls() {
        // Update pagination
        if (this.paginationContainer) {
            const bullets = this.paginationContainer.querySelectorAll('.simple-slider-pagination-bullet');
            bullets.forEach((bullet, index) => {
                bullet.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Update navigation buttons
        if (this.prevButton && this.nextButton && !this.options.loop) {
            this.prevButton.disabled = this.currentIndex === 0;
            this.nextButton.disabled = this.currentIndex >= Math.ceil(this.slides.length / this.options.slidesPerView) - 1;
        }
    }

    startAutoplay() {
        if (!this.options.autoplay || this.slides.length <= 1) return;
        
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    destroy() {
        this.stopAutoplay();
        
        // Remove event listeners
        // (In a real implementation, you'd store references to bound functions)
        
        // Remove added elements
        if (this.prevButton) this.prevButton.remove();
        if (this.nextButton) this.nextButton.remove();
        if (this.paginationContainer) this.paginationContainer.remove();
        
        // Reset styles
        this.slides.forEach(slide => {
            slide.className = slide.className.replace(/simple-slider-\S+/g, '').trim();
        });
        
        this.container.className = this.container.className.replace(/simple-slider-\S+/g, '').trim();
    }

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
}

// Auto-initialize sliders with data attributes
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('[data-slider]');
    sliders.forEach(slider => {
        const options = JSON.parse(slider.getAttribute('data-slider-options') || '{}');
        new SimpleSlider(slider, options);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleSlider;
}

// Global access
window.SimpleSlider = SimpleSlider;