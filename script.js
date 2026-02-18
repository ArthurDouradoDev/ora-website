// ============================================================
// NAVIGATION
// ============================================================

const navbar = document.querySelector('.navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

// Scroll effect with requestAnimationFrame optimization
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Mobile menu implementation
const navLinks = document.querySelector('.nav-links');

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('mobile-menu-overlay');
document.body.appendChild(overlay);

function toggleMenu() {
    const isActive = navLinks.classList.contains('active');
    
    // Toggle classes
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isActive ? '' : 'hidden'; // Prevent scrolling when menu is open
    
    // Toggle icon
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
        if (isActive) {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        } else {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        }
    }
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
}

// Close when clicking overlay
overlay.addEventListener('click', toggleMenu);

// Close when clicking a link
const navLinksItems = navLinks.querySelectorAll('a');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});


// ============================================================
// FAQ ACCORDION
// ============================================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// ============================================================
// TESTIMONIAL MODAL
// ============================================================

const testimonialBtn = document.getElementById('testimonial-btn');
const testimonialModal = document.getElementById('testimonial-modal');
const modalClose = testimonialModal?.querySelector('.modal-close');
const testimonialForm = document.getElementById('testimonial-form');

if (testimonialBtn) {
    testimonialBtn.addEventListener('click', () => {
        testimonialModal.classList.add('active');
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        testimonialModal.classList.remove('active');
    });
}

// Close modal on outside click
if (testimonialModal) {
    testimonialModal.addEventListener('click', (e) => {
        if (e.target === testimonialModal) {
            testimonialModal.classList.remove('active');
        }
    });
}

// Handle form submission
if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('testimonial-name').value || 'Anônimo';
        const message = document.getElementById('testimonial-message').value;
        const isPublic = document.getElementById('testimonial-public').checked;
        
        // Aqui você pode implementar o envio real
        // Por enquanto, vamos simular
        console.log('Testimonial submitted:', { name, message, isPublic });
        
        // Show success message
        alert(`Obrigado, ${name}! Seu depoimento foi enviado com sucesso.`);
        
        // Reset form and close modal
        testimonialForm.reset();
        testimonialModal.classList.remove('active');
    });
}

// ============================================================
// SHARE BUTTONS
// ============================================================

const copyLinkBtn = document.getElementById('copy-link-btn');

if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            
            // Visual feedback
            const originalIcon = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<i class="ph ph-check"></i>';
            copyLinkBtn.style.color = '#4ade80';
            
            setTimeout(() => {
                copyLinkBtn.innerHTML = originalIcon;
                copyLinkBtn.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
}

// Social share buttons
const shareButtons = document.querySelectorAll('.share-buttons .btn-icon');

shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Conheça o Ora — Espiritualidade e foco na nova aba do Chrome!');
        
        let shareUrl = '';
        
        if (button.querySelector('.ph-twitter-logo')) {
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        } else if (button.querySelector('.ph-facebook-logo')) {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (button.querySelector('.ph-whatsapp-logo')) {
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

// ============================================================
// SMOOTH SCROLL
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore # or javascript:void(0)
        if (href === '#' || href.startsWith('javascript:')) {
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================================
// INTERSECTION OBSERVER (Animate on scroll)
// ============================================================

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

// Observe elements with animation
const animatedElements = document.querySelectorAll('.pillar-card, .feature-item, .contribute-card, .roadmap-item');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ============================================================
// EASTER EGGS & ENHANCEMENTS
// ============================================================

// Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        console.log('🙏 Que Deus abençoe seu código! 🙏');
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ============================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================

// Lazy load images (if you add them)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================================
// ANALYTICS (Optional - Privacy-friendly)
// ============================================================

// Você pode adicionar Plausible ou outro analytics que respeite privacidade
// window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

// ============================================================
// SERVICE WORKER (Optional - for offline support)
// ============================================================

if ('serviceWorker' in navigator) {
    // Descomente se você criar um service worker
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================================
// UTILS
// ============================================================

// Debounce function for performance
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

// Log when page is fully loaded
window.addEventListener('load', () => {
    console.log('%c🙏 Ora — Desenvolvido com fé e código 🙏', 'font-size: 20px; color: #eebb55; font-weight: bold;');
    console.log('%cInteressado em contribuir? https://github.com/arthurdouradodev/ora', 'font-size: 14px; color: #888;');
});

/* ============================================================
   COMPARISON SLIDER - Adicione ao script.js
   ============================================================ */

class ComparisonSlider {
    constructor(wrapperId) {
        this.wrapper = document.querySelector(wrapperId);
        if (!this.wrapper) return;

        this.slider = this.wrapper.querySelector('.comparison-slider');
        this.afterSide = this.wrapper.querySelector('.comparison-after');
        this.isDragging = false;
        this.currentPosition = 20; // Start at 20% — auto-animation will sweep to 50%
        this.ticking = false; // For rAF throttling

        this.init();
    }

    init() {
        // Mouse events
        this.wrapper.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.onDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));

        // Touch events
        this.wrapper.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.onDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));

        // Prevent image dragging
        const images = this.wrapper.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Initial position
        this.updateSlider(20);
    }

    startDrag(e) {
        this.isDragging = true;
        this.wrapper.classList.add('dragging');
        // Initial drag update to prevent jump
        this.onDrag(e);
    }

    stopDrag() {
        this.isDragging = false;
        this.wrapper.classList.remove('dragging');
    }

    onDrag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        // Throttle updates using requestAnimationFrame
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.performDragUpdate(e);
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    performDragUpdate(e) {
        const rect = this.wrapper.getBoundingClientRect();
        let clientX;

        // Handle both mouse and touch events correctly even in rAF (using stored event might be tricky if reused, but here we use the event passed to closure)
        // NOTE: In strict rAF usage, we should store clientX in 'onDrag' to avoiding accessing old event object properties if they are pooled (rare in standard DOM but good practice).
        // However, for this simple case, accessing properties is fine.
        
        if (e.type.includes('touch')) {
            // touches list might change, so checking checks
            if (e.touches && e.touches[0]) {
                clientX = e.touches[0].clientX;
            } else if (e.changedTouches && e.changedTouches[0]) {
                clientX = e.changedTouches[0].clientX;
            } else {
                return;
            }
        } else {
            clientX = e.clientX;
        }

        // Calculate percentage
        let x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;

        // Clamp between 5 and 95 to prevent layout issues at edges
        percentage = Math.max(5, Math.min(95, percentage));

        this.updateSlider(percentage);
    }

    updateSlider(percentage) {
        this.currentPosition = percentage;

        // Update slider position
        this.slider.style.left = `${percentage}%`;

        // Update clip-path to reveal the after image
        this.afterSide.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    }
}

// Initialize comparison slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const comparisonSlider = new ComparisonSlider('.comparison-wrapper');
});

// ============================================================
// COMPARISON: Loading State + Entrance Animation + Auto-slide
// ============================================================

const initComparisonAnimations = () => {
    const comparisonSection = document.querySelector('.section-comparison');
    if (!comparisonSection) return;

    const wrapper = comparisonSection.querySelector('.comparison-wrapper');
    const highlights = comparisonSection.querySelectorAll('.highlight-item');
    const divider = comparisonSection.querySelector('.highlight-divider');

    if (!wrapper) return;

    // --- Image loading detection (skeleton removal) ---
    const images = wrapper.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    const onImageLoad = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
            wrapper.classList.add('loaded');
        }
    };

    images.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            onImageLoad();
        } else {
            img.addEventListener('load', onImageLoad, { once: true });
            img.addEventListener('error', onImageLoad, { once: true });
        }
    });

    // Failsafe: Remove skeleton after 3 seconds anyway
    setTimeout(() => {
        if (!wrapper.classList.contains('loaded')) {
            wrapper.classList.add('loaded');
        }
    }, 3000);

    // --- Entrance animation + auto-slide on first view ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';

                // Trigger entrance animations
                wrapper.classList.add('in-view');

                // Stagger highlights
                highlights.forEach(item => {
                    item.classList.add('in-view');
                });
                if (divider) {
                    divider.style.opacity = '0';
                    divider.style.transition = 'opacity 0.6s ease-out 0.15s';
                    requestAnimationFrame(() => divider.style.opacity = '1');
                }

                // Auto-slide animation: 20% → 50% with easeOutCubic
                const slider = wrapper.querySelector('.comparison-slider');
                const afterSide = wrapper.querySelector('.comparison-after');

                if (slider && afterSide) {
                    const startPos = 20;
                    const endPos = 50;
                    const duration = 1500; // 1.5 seconds
                    let startTime = null;

                    // easeOutCubic for smooth deceleration
                    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

                    const animateSlider = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easedProgress = easeOutCubic(progress);

                        const position = startPos + (endPos - startPos) * easedProgress;
                        slider.style.left = `${position}%`;
                        afterSide.style.clipPath = `inset(0 0 0 ${position}%)`;

                        if (progress < 1) {
                            requestAnimationFrame(animateSlider);
                        } else {
                            wrapper.classList.remove('animating');
                        }
                    };

                    // Start after entrance animation settles
                    setTimeout(() => {
                        wrapper.classList.add('animating');
                        requestAnimationFrame(animateSlider);
                    }, 600);
                }

                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    sectionObserver.observe(comparisonSection);
};

initComparisonAnimations();

// ============================================================
// OPTIONAL: Add keyboard support (arrows to move slider)
// ============================================================

const addKeyboardSupport = () => {
    const wrapper = document.querySelector('.comparison-wrapper');
    if (!wrapper) return;

    // Make wrapper focusable
    wrapper.setAttribute('tabindex', '0');

    wrapper.addEventListener('keydown', (e) => {
        const slider = wrapper.querySelector('.comparison-slider');
        const afterSide = wrapper.querySelector('.comparison-after');
        
        if (!slider || !afterSide) return;

        let currentLeft = parseFloat(slider.style.left) || 50;
        const step = 2; // Move 2% per keypress

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentLeft = Math.max(5, currentLeft - step);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentLeft = Math.min(95, currentLeft + step);
        } else {
            return; // Not an arrow key
        }

        slider.style.left = `${currentLeft}%`;
        afterSide.style.clipPath = `inset(0 0 0 ${currentLeft}%)`;
    });

    // Visual indicator when focused
    wrapper.addEventListener('focus', () => {
        wrapper.style.outline = '2px solid rgba(238, 187, 85, 0.5)';
        wrapper.style.outlineOffset = '4px';
    });

    wrapper.addEventListener('blur', () => {
        wrapper.style.outline = 'none';
    });
};

addKeyboardSupport();

// ============================================================
// INSTALL POPUP MODAL
// ============================================================

const installPopup = document.getElementById('install-popup');
const installTriggers = document.querySelectorAll('.js-install-trigger');
const installPopupClose = installPopup?.querySelector('.modal-close');

if (installPopup) {
    installTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            installPopup.classList.add('active');
        });
    });

    if (installPopupClose) {
        installPopupClose.addEventListener('click', () => {
            installPopup.classList.remove('active');
        });
    }

    installPopup.addEventListener('click', (e) => {
        if (e.target === installPopup) {
            installPopup.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && installPopup.classList.contains('active')) {
            installPopup.classList.remove('active');
        }
    });
}