/* Ouqro Modern Website JavaScript */
/* Self-contained JS without external dependencies */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initPageLoader();
    initMobileMenu();
    initSmoothScrolling();
    initAnimations();
    initContactForm();
    initMagneticButtons();
    initIdeatorFunctionality();
});

// Page Loader
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll-triggered Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.section-title, .section-text, .stagger-item');
    animatedElements.forEach(function(element, index) {
        element.style.animationDelay = (index * 0.1) + 's';
        observer.observe(element);
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Contact Form Validation and Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(function() {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            contactForm.reset();
            showNotification('Thank you! Your message has been sent successfully.', 'success');
        }, 2000);
    });
    
    // Real-time input validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    if (!value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    if (fieldName === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#EF4444';
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#EF4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        z-index: 10000;
        animation: slideInFromRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#10B981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#EF4444';
    } else {
        notification.style.backgroundColor = '#3B82F6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOutToRight 0.3s ease forwards';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

// Magnetic Button Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    magneticButtons.forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

// AI Ideator Functionality (Mock Implementation)
function initIdeatorFunctionality() {
    const ideaInput = document.getElementById('idea-input');
    const generateBtn = document.getElementById('generate-btn');
    const outputArea = document.getElementById('ideator-output');
    
    if (!ideaInput || !generateBtn || !outputArea) return;
    
    generateBtn.addEventListener('click', function() {
        const idea = ideaInput.value.trim();
        
        if (!idea) {
            showNotification('Please enter a business idea first.', 'error');
            return;
        }
        
        // Show loading state
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        outputArea.innerHTML = '<div class="loading">🤖 AI is analyzing your idea...</div>';
        
        // Simulate AI processing
        setTimeout(function() {
            const blueprint = generateMockBlueprint(idea);
            
            generateBtn.textContent = 'Generate Blueprint';
            generateBtn.disabled = false;
            
            outputArea.innerHTML = blueprint;
            outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 3000);
    });
    
    // Input focus effects
    ideaInput.addEventListener('focus', function() {
        this.style.borderColor = '#3B82F6';
        this.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
    });
    
    ideaInput.addEventListener('blur', function() {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    });
}

// Mock AI Blueprint Generator
function generateMockBlueprint(idea) {
    const templates = [
        {
            name: "InnovateTech Solutions",
            tagline: "Revolutionizing {industry} through intelligent automation",
            market: "Addresses the growing demand for efficient {industry} solutions in the digital transformation era.",
            technology: "Leverages AI machine learning algorithms and cloud infrastructure to create scalable solutions.",
            monetization: "SaaS subscription model with tiered pricing based on usage and feature access."
        },
        {
            name: "NextGen Platform",
            tagline: "Empowering {industry} with cutting-edge technology",
            market: "Targets the underserved {industry} market with innovative digital solutions.",
            technology: "Combines Web3 blockchain technology with AI-powered analytics for transparency and efficiency.",
            monetization: "Freemium model with premium features, transaction fees, and enterprise licensing."
        },
        {
            name: "Smart Solutions Hub",
            tagline: "Intelligent {industry} solutions for the modern world",
            market: "Captures the rapidly expanding {industry} market seeking automated solutions.",
            technology: "Utilizes advanced AI algorithms and digital infrastructure for seamless user experience.",
            monetization: "Multi-revenue streams including subscriptions, marketplace commissions, and data insights."
        }
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const industry = extractIndustry(idea);
    
    return `
        <div class="blueprint-result">
            <h4>🚀 ${template.name.replace('{industry}', industry)}</h4>
            <p><strong>Tagline:</strong> "${template.tagline.replace('{industry}', industry)}"</p>
            
            <h5>📊 Market Opportunity</h5>
            <p>${template.market.replace('{industry}', industry)} The addressable market shows strong growth potential with increasing digital adoption.</p>
            
            <h5>⚡ Core Technology</h5>
            <p>${template.technology} The solution will be built using modern development frameworks ensuring scalability and security.</p>
            
            <h5>💰 Monetization Strategy</h5>
            <p>${template.monetization} Initial focus on customer acquisition with scaling revenue through value-added services.</p>
            
            <h5>🎯 Next Steps</h5>
            <ul>
                <li>Conduct detailed market research and competitor analysis</li>
                <li>Develop minimum viable product (MVP) prototype</li>
                <li>Secure initial funding and build core team</li>
                <li>Launch beta testing with early adopters</li>
            </ul>
        </div>
    `;
}

// Extract industry from idea
function extractIndustry(idea) {
    const industries = ['education', 'healthcare', 'finance', 'retail', 'manufacturing', 'technology', 'entertainment', 'logistics'];
    const lowerIdea = idea.toLowerCase();
    
    for (const industry of industries) {
        if (lowerIdea.includes(industry) || lowerIdea.includes(industry.slice(0, -1))) {
            return industry;
        }
    }
    
    // Default fallback
    if (lowerIdea.includes('student') || lowerIdea.includes('learn') || lowerIdea.includes('study')) return 'education';
    if (lowerIdea.includes('health') || lowerIdea.includes('medical') || lowerIdea.includes('doctor')) return 'healthcare';
    if (lowerIdea.includes('money') || lowerIdea.includes('bank') || lowerIdea.includes('payment')) return 'finance';
    if (lowerIdea.includes('shop') || lowerIdea.includes('buy') || lowerIdea.includes('sell')) return 'retail';
    
    return 'business';
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutToRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .blueprint-result {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 1rem;
        animation: fadeInUp 0.6s ease;
    }
    
    .blueprint-result h4 {
        color: var(--deep-blue);
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }
    
    .blueprint-result h5 {
        color: var(--electric-blue);
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
    
    .blueprint-result ul {
        margin-left: 1.5rem;
        margin-top: 0.5rem;
    }
    
    .blueprint-result li {
        margin-bottom: 0.25rem;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--gray-600);
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Utility function for debouncing
function debounce(func, wait) {
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

// Performance optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.querySelector('nav');
    
    if (navbar) {
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
}, 10);

// Replace the scroll event listener with the optimized version
window.addEventListener('scroll', optimizedScrollHandler);