// Gymnastics Hub - Main Script (Hero Block Update)

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching for Search Card
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Here you can add logic to filter results or change inputs
                const tabType = button.getAttribute('data-tab');
                console.log(`Switched to tab: ${tabType}`);
            });
        });
    }

    // Dropdown toggle logic (for mobile/hover)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            // Logic for showing dropdown menu on desktop
        });
        
        dropdown.addEventListener('mouseleave', () => {
            // Logic for hiding dropdown menu on desktop
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.header__nav');
    const headerActions = document.querySelector('.header__actions');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            headerActions.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }


    // Promo Slider Logic
    const sliderTrack = document.querySelector('.promo-slider__track');
    const slides = document.querySelectorAll('.promo-slide');

    if (sliderTrack && slides.length > 0) {
        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                if (!slide.classList.contains('active')) {
                    // Prevent link navigation if the slide is not active yet
                    e.preventDefault();
                    
                    // Remove active class from others
                    slides.forEach(s => s.classList.remove('active'));
                    
                    // Add active to current
                    slide.classList.add('active');
                    
                    // Center the active slide
                    slide.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
                // If already active, the link (a tag) will naturally work
            });
        });

        // Initialize first slide as active and centered on load
        const activeSlide = document.querySelector('.promo-slide.active');
        if (activeSlide) {
            setTimeout(() => {
                activeSlide.scrollIntoView({
                    behavior: 'auto',
                    block: 'nearest',
                    inline: 'center'
                });
            }, 100);
        }
    }

    console.log('Hero block and Promo slider initialized!');
});
