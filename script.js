// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactions
    initSmoothScrolling();
    initFormHandling();
    initScrollAnimations();
    initCardInteractions();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling with validation
function initFormHandling() {
    const form = document.querySelector('.contact-form');
    const inputs = document.querySelectorAll('.form-input');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (validateForm(data)) {
                handleFormSubmission(data);
            }
        });
    }
    
    // Add real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(data) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(error => {
        error.remove();
    });
    
    // Validate name
    const nameInput = document.querySelector('input[type="text"]');
    if (!data.name || data.name.trim().length < 2) {
        showFieldError(nameInput, 'Please enter a valid name');
        isValid = false;
    }
    
    // Validate email
    const emailInput = document.querySelector('input[type="email"]');
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    const messageInput = document.querySelector('.form-textarea');
    if (!data.message || data.message.trim().length < 10) {
        showFieldError(messageInput, 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.getAttribute('placeholder');
    
    clearFieldError(field);
    
    if (fieldType === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
    } else if (value.length === 0) {
        showFieldError(field, `${fieldName} is required`);
    }
}

function showFieldError(field, message) {
    field.style.borderColor = '#EF4444';
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #EF4444;
        font-size: 14px;
        margin-top: 8px;
        display: block;
    `;
    
    field.parentNode.appendChild(error);
}

function clearFieldError(field) {
    field.style.borderColor = '#E5E7EB';
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

function handleFormSubmission(data) {
    const button = document.querySelector('.cta-button');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Sending...';
    button.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showSuccessMessage();
        document.querySelector('.contact-form').reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

function showSuccessMessage() {
    const form = document.querySelector('.contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Thank you! Your message has been sent successfully.';
    successMessage.style.cssText = `
        background-color: #10B981;
        color: white;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: center;
        font-weight: 500;
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Scroll animations for sections
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.work-section, .about-section, .contact-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
        observer.observe(section);
    });
}

// Enhanced card interactions
function initCardInteractions() {
    const cards = document.querySelectorAll('.portfolio-card');
    
    cards.forEach(card => {
        // Add subtle parallax effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click interaction
        card.addEventListener('click', function() {
            // You can add project detail navigation here
            console.log('Portfolio card clicked:', this.querySelector('.portfolio-title').textContent);
        });
    });
}


// Timeline animations and interactions
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add staggered entrance animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150); // Stagger animation by 150ms
            }
        });
    }, observerOptions);
    
    // Set initial styles and observe each timeline item
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 600ms ease-out ${index * 150}ms, transform 600ms ease-out ${index * 150}ms`;
        observer.observe(item);
    });
    
    // Add hover interactions
    const timelineContent = document.querySelectorAll('.timeline-content');
    
    timelineContent.forEach(content => {
        // Add subtle parallax effect on mouse move
        content.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            this.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        content.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add subtle typing effect to hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after hero title animation
        setTimeout(typeWriter, 1000);
    }
}

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

// Add scroll-based navigation background change
window.addEventListener('scroll', debounce(() => {
    const nav = document.querySelector('.nav');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        nav.style.backgroundColor = 'rgba(248, 249, 250, 0.95)';
        nav.style.backdropFilter = 'blur(12px)';
    } else {
        nav.style.backgroundColor = '#F8F9FA';
        nav.style.backdropFilter = 'blur(8px)';
    }
}, 10));

// Performance optimization: Preload images
function preloadImages() {
    const images = document.querySelectorAll('.portfolio-image');
    images.forEach(container => {
        // In a real implementation, you would load actual project images here
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFNUU3RUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGM0Y0RjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2plY3QgSW1hZ2U8L3RleHQ+PC9zdmc+';
        // In real implementation, replace with actual image URLs
    });
}

// Initialize preloading after DOM is ready
document.addEventListener('DOMContentLoaded', preloadImages);

document.addEventListener('DOMContentLoaded', () => {
  // Wait until Lucide is loaded
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Auto-hide empty contact icons
  const icons = document.querySelectorAll('.contact-icon');
  icons.forEach(icon => {
    const href = icon.getAttribute('href');
    if (!href || href.trim() === '' || href === '#') {
      icon.style.animation = 'fadeOutIcon 0.5s forwards';
      setTimeout(() => icon.remove(), 500);
    }
  });
});

// Inject fadeOut animation dynamically
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
@keyframes fadeOutIcon {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.6); }
}`;
document.head.appendChild(fadeStyle);
