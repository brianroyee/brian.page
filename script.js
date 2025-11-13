// Portfolio Website JavaScript

// Preloader functionality - runs immediately
(function() {
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        // Minimum display time for preloader (in milliseconds)
        const minDisplayTime = 2000; // 2 seconds
        const startTime = Date.now();
        
        function hidePreloader() {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
            
            setTimeout(function() {
                preloader.classList.add('fade-out');
                
                // Remove preloader from DOM after fade out
                setTimeout(function() {
                    if (preloader.parentNode) {
                        preloader.remove();
                    }
                }, 500);
            }, remainingTime);
        }
        
        // Try multiple methods to ensure preloader hides
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
            // Fallback: hide after max 4 seconds regardless
            setTimeout(hidePreloader, 4000);
        }
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactions
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCardInteractions();
    initLucideIcons();
    initHoverPreviews();
});

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        links.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

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
    });
}

// Initialize Lucide icons
function initLucideIcons() {
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
}

// Hover preview functionality
function initHoverPreviews() {
    document.querySelectorAll(".hover-preview").forEach(el => {
        const title = el.dataset.title || "";
        const img = el.dataset.img || "";
        const desc = el.dataset.desc || "";

        if (title || img || desc) {
            const box = document.createElement("div");
            box.classList.add("preview-box");
            box.innerHTML = `
                ${img ? `<img src="${img}" alt="${title} preview">` : ""}
                ${title ? `<strong>${title}</strong>` : ""}
                ${desc ? `<p>${desc}</p>` : ""}
            `;
            document.body.appendChild(box);

            el.addEventListener("mouseenter", () => {
                box.style.opacity = "1";
                box.style.transform = "scale(1)";
            });

            el.addEventListener("mousemove", e => {
                const offsetX = 20;
                const offsetY = 20;

                let x = e.clientX + offsetX;
                let y = e.clientY + offsetY;

                const boxWidth = 260;
                const boxHeight = 200;
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;

                if (x + boxWidth > screenWidth - 16) x = screenWidth - boxWidth - 16;
                if (y + boxHeight > screenHeight - 16) y = screenHeight - boxHeight - 16;

                box.style.left = `${x}px`;
                box.style.top = `${y}px`;
            });

            el.addEventListener("mouseleave", () => {
                box.style.opacity = "0";
                box.style.transform = "scale(0.95)";
            });
        }
    });
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