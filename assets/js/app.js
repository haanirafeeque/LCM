/**
 * ==========================================================================
 * LCM WEBSITE LOGIC & INTERACTION
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. MOBILE NAVIGATION MENU
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.getElementById('menu-icon');
    const links = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('mobile-active');
            
            // Toggle menu icon between burger and close
            if (menuIcon && typeof lucide !== 'undefined') {
                if (isActive) {
                    menuIcon.setAttribute('data-lucide', 'x');
                } else {
                    menuIcon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });

        // Close mobile menu when a nav link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                if (menuIcon && typeof lucide !== 'undefined') {
                    menuIcon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const sections = document.querySelectorAll('section, header');
        const scrollPosition = window.scrollY + 120; // offset for sticky navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id') || '';
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' && currentSection === '') {
                link.classList.add('active');
            } else if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });


    // 2. SERVICES TAB SWITCHER
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and target tab content
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Trigger scroll animation check for new cards
                triggerAnimationOnActiveTab(targetContent);
            }
        });
    });

    function triggerAnimationOnActiveTab(contentElement) {
        const cards = contentElement.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }


    // 3. CLIENT SHOWCASE GRID FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clientCards = document.querySelectorAll('.client-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            clientCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger tiny scale-in animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // 4. TESTIMONIALS SLIDER
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentSlide = 0;
    let autoSlideInterval;
    const slideDuration = 6000; // 6 seconds

    if (slides.length > 0) {
        // Generate Dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        function updateSliderUI() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                dots[index].classList.remove('active');
            });
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function goToSlide(n) {
            currentSlide = (n + slides.length) % slides.length;
            updateSliderUI();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        // Control click handlers
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

        // Auto sliding
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }


    // 5. INTERACTIVE QUOTE FORM HANDLER
    const quoteForm = document.getElementById('quote-request-form');
    const formSuccessMessage = document.getElementById('form-success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (quoteForm && formSuccessMessage) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Perform simple validation check
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const service = document.getElementById('form-service').value;

            if (!name || !email || !phone || !service) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simulate form submission to server
            // Hide form and show success cards
            quoteForm.classList.add('hidden');
            formSuccessMessage.classList.remove('hidden');
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                // Reset form inputs
                quoteForm.reset();
                // Show form again and hide success cards
                quoteForm.classList.remove('hidden');
                formSuccessMessage.classList.add('hidden');
            });
        }
    }
});
