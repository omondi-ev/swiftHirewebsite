/**
 * Swifthire - Complete JavaScript File
 * Fixes carousel, calculator, and user switching
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Swifthire JavaScript Loading...');
    
    // ============================================
    // 1. MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close menu when clicking links
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // ============================================
    // 2. CAROUSEL FUNCTIONALITY
    // ============================================
    function initCarousel() {
        console.log('Initializing carousel...');
        
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (slides.length === 0) {
            console.log('No carousel found');
            return;
        }
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;
        
        // Show specific slide
        function showSlide(n) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Handle wrap-around
            if (n >= totalSlides) {
                currentSlide = 0;
            } else if (n < 0) {
                currentSlide = totalSlides - 1;
            } else {
                currentSlide = n;
            }
            
            // Show current slide
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        // Next slide
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        // Previous slide
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Auto-play
        function startAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
        }
        
        function stopAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }
        
        // Dot click events
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoPlay();
                startAutoPlay();
            });
        });
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Initialize
        showSlide(0);
        startAutoPlay();
        console.log('Carousel initialized with', totalSlides, 'slides');
    }
    
    // ============================================
    // 3. USER TYPE SWITCHING (Owner/Renter)
    // ============================================
    function initUserSwitching() {
        console.log('Initializing user switching...');
        
        const ownerBtn = document.querySelector('.user-option[data-user="owner"]');
        const renterBtn = document.querySelector('.user-option[data-user="renter"]');
        const ownersFlow = document.getElementById('owners-flow');
        const rentersFlow = document.getElementById('renters-flow');
        
        if (!ownerBtn || !renterBtn) {
            console.log('User switching elements not found');
            return;
        }
        
        // Switch to Owner view
        function switchToOwner() {
            console.log('Switching to Owner');
            ownerBtn.classList.add('active');
            renterBtn.classList.remove('active');
            ownersFlow.classList.add('active');
            rentersFlow.classList.remove('active');
            // Initialize calculator when switching to owner
            setTimeout(initCalculator, 100);
        }
        
        // Switch to Renter view
        function switchToRenter() {
            console.log('Switching to Renter');
            renterBtn.classList.add('active');
            ownerBtn.classList.remove('active');
            rentersFlow.classList.add('active');
            ownersFlow.classList.remove('active');
        }
        
        // Event listeners
        ownerBtn.addEventListener('click', switchToOwner);
        renterBtn.addEventListener('click', switchToRenter);
        
        console.log('User switching initialized');
    }
    
    // ============================================
    // 4. EARNINGS CALCULATOR
    // ============================================
    function initCalculator() {
        console.log('Initializing calculator...');
        
        // Get all calculator elements
        const carTypeSelect = document.getElementById('carType');
        const dailyRateSlider = document.getElementById('dailyRate');
        const rentalDaysSlider = document.getElementById('rentalDays');
        const dailyRateValue = document.getElementById('dailyRateValue');
        const rentalDaysValue = document.getElementById('rentalDaysValue');
        const monthlyEarnings = document.getElementById('monthlyEarnings');
        const totalRevenue = document.getElementById('totalRevenue');
        const platformFee = document.getElementById('platformFee');
        const yourEarnings = document.getElementById('yourEarnings');
        const paymentFlowSteps = document.querySelectorAll('.flow-step');
        
        // Check if calculator exists (only in owner view)
        if (!carTypeSelect || !dailyRateSlider) {
            console.log('Calculator not found (might be on renter view)');
            return;
        }
        
        console.log('Found calculator elements:', {
            carTypeSelect: !!carTypeSelect,
            dailyRateSlider: !!dailyRateSlider,
            monthlyEarnings: !!monthlyEarnings
        });
        
        // Format KES currency
        function formatKES(amount) {
            return amount.toLocaleString('en-KE');
        }
        
        // Update slider displays
        function updateSliderDisplays() {
            if (dailyRateValue) dailyRateValue.textContent = formatKES(parseInt(dailyRateSlider.value));
            if (rentalDaysValue) rentalDaysValue.textContent = rentalDaysSlider.value;
            calculateEarnings();
        }
        
        // Update slider background
        function updateSliderBackground(slider) {
            const value = slider.value;
            const min = slider.min;
            const max = slider.max;
            const percentage = ((value - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #008080 0%, #008080 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
        }
        
        // Calculate earnings
        function calculateEarnings() {
            const dailyRate = parseInt(dailyRateSlider.value);
            const rentalDays = parseInt(rentalDaysSlider.value);
            const PLATFORM_FEE_RATE = 0.20; // 20%
            
            const revenue = dailyRate * rentalDays;
            const fee = Math.round(revenue * PLATFORM_FEE_RATE);
            const earnings = revenue - fee;
            
            console.log('Calculating:', { dailyRate, rentalDays, revenue, fee, earnings });
            
            // Update display
            if (monthlyEarnings) monthlyEarnings.textContent = formatKES(earnings);
            if (totalRevenue) totalRevenue.textContent = formatKES(revenue);
            if (platformFee) platformFee.textContent = formatKES(fee);
            if (yourEarnings) yourEarnings.textContent = formatKES(earnings);
            
            // Animate payment flow
            animatePaymentFlow();
        }
        
        // Animate payment flow
        function animatePaymentFlow() {
            if (!paymentFlowSteps || paymentFlowSteps.length === 0) return;
            
            // Reset all steps
            paymentFlowSteps.forEach(step => step.classList.remove('active'));
            
            // Activate with delay
            setTimeout(() => {
                if (paymentFlowSteps[0]) paymentFlowSteps[0].classList.add('active');
                setTimeout(() => {
                    if (paymentFlowSteps[1]) paymentFlowSteps[1].classList.add('active');
                    setTimeout(() => {
                        if (paymentFlowSteps[2]) paymentFlowSteps[2].classList.add('active');
                    }, 300);
                }, 300);
            }, 100);
        }
        
        // Handle car type change
        function handleCarTypeChange() {
            const selectedOption = carTypeSelect.options[carTypeSelect.selectedIndex];
            const minRate = selectedOption.getAttribute('data-min');
            const maxRate = selectedOption.getAttribute('data-max');
            const defaultRate = selectedOption.getAttribute('data-default');
            
            console.log('Car type changed:', { minRate, maxRate, defaultRate });
            
            // Update slider
            dailyRateSlider.min = minRate;
            dailyRateSlider.max = maxRate;
            dailyRateSlider.value = defaultRate;
            
            // Update display and background
            updateSliderDisplays();
            updateSliderBackground(dailyRateSlider);
        }
        
        // Initialize slider backgrounds
        updateSliderBackground(dailyRateSlider);
        updateSliderBackground(rentalDaysSlider);
        
        // Set initial values
        updateSliderDisplays();
        
        // Add event listeners
        carTypeSelect.addEventListener('change', handleCarTypeChange);
        
        dailyRateSlider.addEventListener('input', function() {
            updateSliderDisplays();
            updateSliderBackground(this);
        });
        
        rentalDaysSlider.addEventListener('input', function() {
            updateSliderDisplays();
            updateSliderBackground(this);
        });
        
        console.log('Calculator initialized successfully');
    }
    
    // ============================================
    // 5. TEAM CARD HOVER EFFECTS
    // ============================================
    function initTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // ============================================
    // 6. SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ============================================
    // 7. MAIN INITIALIZATION
    // ============================================
    function initializeAll() {
        console.log('=== Swifthire Initialization Started ===');
        
        // Initialize all components
        initCarousel();
        initUserSwitching();
        initCalculator(); // Initialize calculator on page load
        initTeamCards();
        initSmoothScroll();
        
        console.log('=== Swifthire Fully Initialized ===');
    }
    
    // Start initialization
    initializeAll();
});



// ============================================
// FAQ Accordion Functionality
// ============================================
function initFAQ() {
    console.log('Initializing FAQ functionality...');
    
    // Category Tab Switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding FAQ category
                faqCategories.forEach(cat => {
                    cat.classList.remove('active');
                    if (cat.id === `${category}-faq`) {
                        cat.classList.add('active');
                    }
                });
                
                console.log(`Switched to ${category} category`);
            });
        });
    }
    
    // Accordion Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle active class on question
                this.classList.toggle('active');
                
                // Get the answer element
                const answer = this.nextElementSibling;
                
                // Close other answers in the same category
                const parentCategory = this.closest('.faq-category');
                const otherQuestions = parentCategory.querySelectorAll('.faq-question');
                const otherAnswers = parentCategory.querySelectorAll('.faq-answer');
                
                otherQuestions.forEach(q => {
                    if (q !== this) {
                        q.classList.remove('active');
                    }
                });
                
                otherAnswers.forEach(a => {
                    if (a !== answer) {
                        a.classList.remove('active');
                        a.style.maxHeight = null;
                    }
                });
                
                // Toggle current answer
                if (answer.classList.contains('active')) {
                    answer.classList.remove('active');
                    answer.style.maxHeight = null;
                } else {
                    answer.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
        
        // Open first FAQ by default in each category
        faqCategories.forEach(category => {
            if (category.classList.contains('active')) {
                const firstQuestion = category.querySelector('.faq-question');
                const firstAnswer = firstQuestion.nextElementSibling;
                
                firstQuestion.classList.add('active');
                firstAnswer.classList.add('active');
                firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
            }
        });
    }
    
    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you! Your message has been sent. We\'ll respond within 2 hours.');
            this.reset();
        });
    }
    
    console.log('FAQ functionality initialized');
}

// Add this to your initializeAll() function
// Add: initFAQ();


// Add this to your existing main.js file, inside DOMContentLoaded
function initFooter() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
}

// Call this in your initializeAll() function
// Add: initFooter();