// ===== FLOATING HEARTS ANIMATION =====
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝', '💞'];

    function addHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDelay = Math.random() * 5 + 's';

        heartsContainer.appendChild(heart);

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 20000);
    }

    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(addHeart, i * 500);
    }

    // Continuously add hearts
    setInterval(addHeart, 2000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== GALLERY MODAL =====
function initGalleryModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-overlay p');

            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = caption.textContent;
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== SMOOTH SCROLL FOR NAVIGATION =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECT ON SCROLL =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== INTERACTIVE TIMELINE =====
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });
}

// ===== COUNTER ANIMATION FOR REASONS =====
function animateCounters() {
    const reasonCards = document.querySelectorAll('.reason-card');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const numberEl = entry.target.querySelector('.reason-number');
                const targetNumber = parseInt(numberEl.textContent);
                let currentNumber = 0;

                const increment = targetNumber / 30;
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= targetNumber) {
                        numberEl.textContent = targetNumber;
                        clearInterval(timer);
                    } else {
                        numberEl.textContent = Math.floor(currentNumber);
                    }
                }, 30);
            }
        });
    }, observerOptions);

    reasonCards.forEach(card => observer.observe(card));
}

// ===== BIG CAROUSEL =====
function initBigCarousel() {
    const track = document.getElementById('bigCarouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const slides = Array.from(track.children);
    const total = slides.length;
    let current = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        updateDots();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { next(); resetAuto(); }
        if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
    });

    // Touch swipe
    let touchStartX = 0;
    track.parentElement.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    track.parentElement.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    // Auto-advance
    function startAuto() { autoTimer = setInterval(next, 4000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();
}

// ===== SWIPE CARDS (TINDER STYLE) =====
function initSwipeCards() {
    const swipeCards = document.getElementById('swipeCards');
    const likeBtn = document.getElementById('likeBtn');
    const nopeBtn = document.getElementById('nopeBtn');
    const likeIndicator = document.getElementById('likeIndicator');
    const nopeIndicator = document.getElementById('nopeIndicator');

    if (!swipeCards) return;

    let cards = Array.from(swipeCards.children);
    let currentCard = cards[0];

    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;
    let isDragging = false;

    function initCard(card) {
        if (!card) return;

        currentCard = card;

        // Mouse events
        card.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);

        // Touch events
        card.addEventListener('touchstart', handleDragStart);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('touchend', handleDragEnd);
    }

    function handleDragStart(e) {
        if (e.target !== currentCard && !currentCard.contains(e.target)) return;

        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    }

    function handleDragMove(e) {
        if (!isDragging) return;

        const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        moveX = currentX - startX;
        moveY = currentY - startY;

        const rotate = moveX * 0.1;
        currentCard.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
        currentCard.style.transition = 'none';

        // Show indicators
        if (moveX > 50) {
            likeIndicator.classList.add('show');
            nopeIndicator.classList.remove('show');
        } else if (moveX < -50) {
            nopeIndicator.classList.add('show');
            likeIndicator.classList.remove('show');
        } else {
            likeIndicator.classList.remove('show');
            nopeIndicator.classList.remove('show');
        }
    }

    function handleDragEnd() {
        if (!isDragging) return;

        isDragging = false;

        if (moveX > 100) {
            swipeRight();
        } else if (moveX < -100) {
            swipeLeft();
        } else {
            resetCard();
        }
    }

    function swipeRight() {
        currentCard.classList.add('swipe-right');
        likeIndicator.classList.remove('show');
        setTimeout(() => {
            currentCard.remove();
            nextCard();
        }, 500);
    }

    function swipeLeft() {
        currentCard.classList.add('swipe-left');
        nopeIndicator.classList.remove('show');
        setTimeout(() => {
            currentCard.remove();
            nextCard();
        }, 500);
    }

    function resetCard() {
        currentCard.style.transform = '';
        currentCard.style.transition = 'transform 0.3s ease';
        likeIndicator.classList.remove('show');
        nopeIndicator.classList.remove('show');
    }

    function nextCard() {
        cards = Array.from(swipeCards.children);
        if (cards.length > 0) {
            initCard(cards[0]);
        } else {
            // All cards swiped
            swipeCards.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;"><h3>All done! 💕</h3><p>You\'ve seen all our memories!</p></div>';
        }
    }

    // Button controls
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            if (currentCard) {
                likeIndicator.classList.add('show');
                swipeRight();
            }
        });
    }

    if (nopeBtn) {
        nopeBtn.addEventListener('click', () => {
            if (currentCard) {
                nopeIndicator.classList.add('show');
                swipeLeft();
            }
        });
    }

    // Initialize first card
    if (cards.length > 0) {
        initCard(cards[0]);
    }
}

// ===== CURSOR TRAIL EFFECT (OPTIONAL ENHANCEMENT) =====
function initCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        const diffX = mouseX - trailX;
        const diffY = mouseY - trailY;

        trailX += diffX * 0.1;
        trailY += diffY * 0.1;

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initScrollAnimations();
    initGalleryModal();
    initSmoothScroll();
    initParallax();
    initTimeline();
    animateCounters();
    initSwipeCards(); // Initialize swipe cards
    initBigCarousel(); // Initialize big carousel

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
        // Scroll-based animations handled here
    });
});

// ===== EASTER EGG: CLICK COUNTER =====
let clickCount = 0;
document.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 365) {
        alert('🎉 You clicked 365 times - one for each day of our love! 💕');
        clickCount = 0;
    }
});
