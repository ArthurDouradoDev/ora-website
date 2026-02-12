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

        // Clamp between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));

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
                    let position = 0;
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
                            return;
                        }
                        
                        position += increment;
                        slider.style.left = `${position}%`;
                        afterSide.style.clipPath = `inset(0 0 0 ${position}%)`;
                        
                        requestAnimationFrame(animate);
                    };
                    
                    // Start animation after a small delay
                    setTimeout(animate, 500);
                }
            }
        });
    }, {
        threshold: 0.3
    });

    observer.observe(comparisonSection);
};

// Run the auto-animation
animateComparisonOnView();

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
            currentLeft = Math.max(0, currentLeft - step);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentLeft = Math.min(100, currentLeft + step);
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
