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
        this.currentPosition = 50; // Start at 50%

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
        this.updateSlider(50);
    }

    startDrag(e) {
        this.isDragging = true;
        this.wrapper.classList.add('dragging');
        this.onDrag(e);
    }

    stopDrag() {
        this.isDragging = false;
        this.wrapper.classList.remove('dragging');
    }

    onDrag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const rect = this.wrapper.getBoundingClientRect();
        let clientX;

        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
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
// OPTIONAL: Auto-animate on first view
// ============================================================

const animateComparisonOnView = () => {
    const comparisonSection = document.querySelector('.section-comparison');
    if (!comparisonSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                // Animate slider from left to right once
                const slider = entry.target.querySelector('.comparison-slider');
                const afterSide = entry.target.querySelector('.comparison-after');
                
                if (slider && afterSide) {
                    const wrapper = entry.target.querySelector('.comparison-wrapper');
                    let position = 5; // Start at 5% to match limits
                    const duration = 2000; // 2 seconds
                    const fps = 60;
                    const frames = (duration / 1000) * fps;
                    const increment = 100 / frames;
                    
                    const animate = () => {
                        if (position >= 50) {
                            // Stop at 50% (middle)
                            position = 50;
                            slider.style.left = `${position}%`;
                            afterSide.style.clipPath = `inset(0 0 0 ${position}%)`;
                            if (wrapper) wrapper.classList.remove('animating');
                            return;
                        }
                        
                        position += increment;
                        slider.style.left = `${position}%`;
                        afterSide.style.clipPath = `inset(0 0 0 ${position}%)`;
                        
                        requestAnimationFrame(animate);
                    };
                    
                    // Start animation after a small delay
                    setTimeout(() => {
                        if (wrapper) wrapper.classList.add('animating');
                        animate();
                    }, 500);
                }
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(comparisonSection);
};

// Run the auto-animation
// animateComparisonOnView(); // Disabled to allow starting at 50% immediately

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