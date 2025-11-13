/**
 * @file Main JavaScript file for the portfolio website.
 * @description Handles preloader, navigation, animations, and other interactive elements.
 */

/**
 * Manages the preloader display and fade-out effect.
 * Ensures the preloader is shown for a minimum duration.
 */
function handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Minimum display time for the preloader (in milliseconds)
    const minDisplayTime = 2000;
    const startTime = Date.now();

    function hidePreloader() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            preloader.classList.add('fade-out');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            });
        }, remainingTime);
    }

    // Hide preloader when the window is fully loaded
    window.addEventListener('load', hidePreloader);

    // Fallback to hide preloader after a maximum time
    setTimeout(hidePreloader, 4000);
}

/**
 * Initializes the mobile menu toggle functionality.
 * Handles opening, closing, and outside clicks.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;

    const links = navLinks.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

/**
 * Sets up smooth scrolling for anchor links.
 */
function initSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initializes Intersection Observer to animate sections on scroll.
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.work-section, .about-section, .contact-section, .experience-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

/**
 * Adds a subtle 3D tilt effect to portfolio cards on mousemove.
 * Note: This can be performance-intensive. It's disabled on touch devices.
 */
function initCardInteractions() {
    if ('ontouchstart' in window) return; // Disable on touch devices

    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-8px) scale(1.02) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}


/**
 * Renders Lucide icons and hides any contact icons without a valid link.
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Creates and manages hover-to-preview boxes for tags.
 */
function initHoverPreviews() {
    document.querySelectorAll(".hover-preview").forEach(el => {
        const title = el.dataset.title || "";
        const desc = el.dataset.desc || "";

        if (title || desc) {
            const box = document.createElement("div");
            box.classList.add("preview-box");
            box.innerHTML = `
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

                const boxWidth = 240;
                const screenWidth = window.innerWidth;
                
                // Adjust position to prevent going off-screen
                if (x + boxWidth > screenWidth - 16) {
                    x = e.clientX - boxWidth - offsetX;
                }

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

/**
 * Automatically cycles through images in the about section carousel.
 */
function initPhotoCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    if (images.length <= 1) return;

    let currentIndex = 0;

    function showNextImage() {
        const nextIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
        currentIndex = nextIndex;
    }

    setInterval(showNextImage, 3500);
}

/**
 * Changes the navigation bar's background on scroll.
 */
function handleNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let isScrolled = false;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 && !isScrolled) {
            nav.style.backgroundColor = 'rgba(248, 249, 250, 0.95)';
            nav.style.backdropFilter = 'blur(12px)';
            isScrolled = true;
        } else if (window.scrollY <= 50 && isScrolled) {
            nav.style.backgroundColor = '#F8F9FA';
            nav.style.backdropFilter = 'blur(8px)';
            isScrolled = false;
        }
    }, { passive: true }); // Use passive listener for better scroll performance
}

// --- Main Execution ---

// Handle preloader immediately
handlePreloader();

// Initialize all other functions after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCardInteractions();
    initLucideIcons();
    initHoverPreviews();
    initPhotoCarousel();
    handleNavScroll();
});