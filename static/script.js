/**
 * @file Main JavaScript for the Dynamic Portfolio Template.
 * @description This script handles all frontend interactivity, including animations,
 * navigation, and communication with the Flask backend API.
 *
 * @version 2.0.0
 * @author Brian Roy Mathew (Template Creator)
 */

// ===================================================================================
// I. INITIALIZATION
// ===================================================================================

/**
 * Main execution block. This function runs once the entire HTML document has been
 * loaded and parsed. It's the entry point for all our JavaScript functions.
 */
document.addEventListener('DOMContentLoaded', function() {
    // UI Initializers
    handlePreloader();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCardInteractions();
    initLucideIcons();
    initHoverPreviews();
    initPhotoCarousel();
    handleNavScroll();
    initAnimatedCursor();

    // API Interaction Initializers
    loadCreativeWorks(); // Fetches data for the /creatives page.
    trackPageVisit();    // Logs a visit on every page load.
});


// ===================================================================================
// II. UI & ANIMATION FUNCTIONS
// ===================================================================================

/**
 * Manages the preloader display and fade-out effect.
 * Ensures the preloader is visible for a minimum duration to avoid flashing.
 */
function handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    const minDisplayTime = 1500; // 1.5 seconds
    const startTime = Date.now();

    const hidePreloader = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            preloader.classList.add('fade-out');
            // Remove the preloader from the DOM after the transition ends for performance.
            preloader.addEventListener('transitionend', () => preloader.remove());
        }, remainingTime);
    };

    // Hide preloader when the window is fully loaded.
    window.addEventListener('load', hidePreloader);

    // Fallback: Force hide after 4 seconds in case of loading issues.
    setTimeout(hidePreloader, 4000);
}

/**
 * Initializes the mobile navigation menu (hamburger menu).
 * Handles toggling the menu, closing it on link click, and closing it on outside click.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!menuToggle || !navLinks) return;

    // Toggle menu on button click.
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked.
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Implements smooth scrolling for on-page anchor links (e.g., href="#about").
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Uses the Intersection Observer API to fade in sections as they enter the viewport.
 * This is a performant way to handle scroll-based animations.
 */
function initScrollAnimations() {
    const animatedSections = document.querySelectorAll('.work-section, .about-section, .contact-section, .experience-section');
    if (animatedSections.length === 0) return;

    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible.
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Stop observing once animated.
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        section.classList.add('fade-in-section'); // Add initial state via CSS
        observer.observe(section);
    });
}
/**
 * Adds a subtle 3D tilt effect to portfolio cards on mouse movement.
 * This effect is disabled on touch devices for better performance.
 */
function initCardInteractions() {
    // A simple way to check for touch support.
    if ('ontouchstart' in window) return;

    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y - height / 2) / (height / 2) * -7; // Max rotation of 7 degrees.
            const rotateY = (x - width / 2) / (width / 2) * 7;    // Max rotation of 7 degrees.

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

/**
 * Renders all icons on the page using the Lucide Icons library.
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Creates and manages hover-to-preview tooltips for elements with the 'hover-preview' class.
 */
function initHoverPreviews() {
    const previewElements = document.querySelectorAll(".hover-preview");
    if (previewElements.length === 0) return;

    // Create a single tooltip element to be reused.
    const tooltip = document.createElement("div");
    tooltip.classList.add("preview-box");
    document.body.appendChild(tooltip);

    previewElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            const title = el.dataset.title || "";
            const desc = el.dataset.desc || "";
            if (!title && !desc) return;

            tooltip.innerHTML = `
                ${title ? `<strong>${title}</strong>` : ""}
                ${desc ? `<p>${desc}</p>` : ""}
            `;
            tooltip.style.opacity = "1";
            tooltip.style.visibility = "visible";
        });

        el.addEventListener("mousemove", e => {
            // Position the tooltip near the cursor, avoiding screen edges.
            const offsetX = 15;
            const offsetY = 15;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const { offsetWidth, offsetHeight } = tooltip;
            
            let top = clientY + offsetY;
            let left = clientX + offsetX;

            if (left + offsetWidth > innerWidth) {
                left = clientX - offsetWidth - offsetX;
            }
            if (top + offsetHeight > innerHeight) {
                top = clientY - offsetHeight - offsetY;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });

        el.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
            tooltip.style.visibility = "hidden";
        });
    });
}

/**
 * Automatically cycles through images in the "About" section carousel.
 */
function initPhotoCarousel() {
    const images = document.querySelectorAll('.carousel-image');
    if (images.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
        currentIndex = nextIndex;
    }, 3500); // Change image every 3.5 seconds.
}

/**
 * Changes the navigation bar's background style on scroll for a modern, glassy effect.
 * Uses a flag to prevent unnecessary style changes on every scroll event.
 */
function handleNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let isScrolled = false;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (!isScrolled) {
                nav.classList.add('scrolled');
                isScrolled = true;
            }
        } else {
            if (isScrolled) {
                nav.classList.remove('scrolled');
                isScrolled = false;
            }
        }
    }, { passive: true }); // Use passive listener for better scroll performance.
}


// ===================================================================================
// III. BACKEND API INTERACTION FUNCTIONS
// ===================================================================================

/**
 * Fetches creative works from the backend API and populates them on the /creatives page.
 */
function loadCreativeWorks() {
    const creativeListContainer = document.getElementById('creative-list');
    if (!creativeListContainer) return; // Only run if the container exists.

    fetch('/api/creatives')
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            return response.json();
        })
        .then(works => {
            creativeListContainer.innerHTML = ''; // Clear the "Loading..." message.
            if (works.length === 0) {
                creativeListContainer.innerHTML = '<p class="empty-list-message">No creative works have been published yet.</p>';
                return;
            }
            works.forEach(work => {
                const linkElement = document.createElement('a');
                linkElement.href = work.url;
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.className = 'creative-list-item';
                linkElement.textContent = work.title;
                creativeListContainer.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Error fetching creative works:', error);
            creativeListContainer.innerHTML = '<p class="empty-list-message error">Could not load creative works. Please try again later.</p>';
        });
}

/**
 * Sends a POST request to the backend to log a new page visit.
 * This runs silently in the background on every page load.
 */
function trackPageVisit() {
    fetch('/api/track-visit', { method: 'POST' })
        .then(response => {
            if (!response.ok) throw new Error('Failed to track visit.');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                console.log('Page visit tracked successfully.');
            }
        })
        .catch(error => {
            console.error('Error tracking page visit:', error);
        });
}

/**
 * Initializes a custom animated cursor with a dot and a springy outline.
 */
function initAnimatedCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (!dot || !outline) return;

    // --- State variables ---
    const cursor = {
        x: 0,
        y: 0,
        outlineX: 0,
        outlineY: 0,
    };

    let isAnimating = false;

    // --- Event Listeners ---

    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;

        if (!isAnimating) {
            // Start the animation loop when the mouse first moves
            requestAnimationFrame(animate);
            isAnimating = true;
        }
    });

    // --- Animation Loop ---

    const animate = () => {
        // The dot moves instantly
        dot.style.transform = `translate(${cursor.x - (dot.offsetWidth / 2)}px, ${cursor.y - (dot.offsetHeight / 2)}px)`;

        // The outline "lerps" (linearly interpolates) to the cursor position.
        // This creates the smooth, delayed "spring" effect.
        const sensitivity = 0.15; // Lower value = more delay/floatiness
        cursor.outlineX += (cursor.x - cursor.outlineX) * sensitivity;
        cursor.outlineY += (cursor.y - cursor.outlineY) * sensitivity;

        outline.style.transform = `translate(${cursor.outlineX - (outline.offsetWidth / 2)}px, ${cursor.outlineY - (outline.offsetHeight / 2)}px)`;

        // Continue the animation loop
        requestAnimationFrame(animate);
    };

    // --- Hover Effects ---

    // Add a class to the body when hovering over specific elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-card, .timeline-tags .tag');

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovered');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovered');
        });
    });
}