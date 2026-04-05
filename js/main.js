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
    if (sliderTrack && slides.length > 0) {

        // Helper to center slide smoothly
        const centerActiveSlide = (slide) => {
            if (!slide || !sliderTrack) return;
            
            // Calc precise position
            const slideWidth = slide.offsetWidth;
            const containerWidth = sliderTrack.offsetWidth;
            const slideLeft = slide.offsetLeft;
            
            sliderTrack.scrollTo({
                left: slideLeft - (containerWidth / 2) + (slideWidth / 2),
                behavior: 'smooth'
            });
        };

        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                if (!slide.classList.contains('active')) {
                    e.preventDefault();
                    slides.forEach(s => s.classList.remove('active'));
                    slide.classList.add('active');
                    centerActiveSlide(slide);
                }
            });
        });

        // Initial centering check
        const activeSlide = document.querySelector('.promo-slide.active');
        if (activeSlide) {
            setTimeout(() => centerActiveSlide(activeSlide), 500);
        }
    }

    // Ensure we start at the top on initial load
    window.scrollTo(0, 0);

    // Catalog Filters Logic (Tag Selection)
    const filterTags = document.querySelectorAll('.filter-tag');
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                
                // For demonstration: logic for filtering could be added here
                console.log(`Filtering catalog by: ${tag.textContent.trim()}`);
            });
        });
    }

    // Catalog Date Picker Logic
    const dateInput = document.getElementById('dateInput');
    const dateValue = document.getElementById('dateValue');
    const dateContainer = document.getElementById('datePickerContainer');

    if (dateInput && dateValue && dateContainer) {
        // Open date picker when the whole box is clicked
        dateContainer.addEventListener('click', (e) => {
            // Check if showPicker is supported (modern browsers)
            if ('showPicker' in HTMLInputElement.prototype) {
                dateInput.showPicker();
            } else {
                dateInput.click(); // Fallback for older browsers
            }
        });

        // Update display text when date is chosen
        dateInput.addEventListener('change', (e) => {
            const selectedDate = e.target.value;
            if (selectedDate) {
                const dateParts = selectedDate.split('-');
                const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
                dateValue.innerText = formattedDate;
                dateValue.style.color = '#1a1a1a';
                dateValue.style.opacity = '1';
            }
        });
        
        // Prevent event bubbling if clicking exactly on input
        dateInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Event Gallery Slider Logic
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryDots = document.querySelectorAll('.gallery-dots .dot');
    const mainImg = document.getElementById('mainGalleryImg');
    
    // Test images array (using existing project images for now)
    const galleryImages = [
        'img/card.png',
        'img/test-banner.webp',
        'img/card.png', // Repeating for demo
        'img/test-banner.webp'
    ];
    
    if (galleryPrev && galleryNext && galleryDots.length > 0 && mainImg) {
        let currentIdx = 0;
        
        const updateGallery = (newIdx) => {
            currentIdx = newIdx;
            // Update dots
            galleryDots.forEach(dot => dot.classList.remove('active'));
            galleryDots[currentIdx].classList.add('active');
            
            // Fixed: Real image switching with fade effect
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = galleryImages[currentIdx % galleryImages.length];
                mainImg.style.opacity = '1';
            }, 200);
        };

        galleryPrev.addEventListener('click', () => {
            let nextIdx = (currentIdx > 0) ? currentIdx - 1 : galleryDots.length - 1;
            updateGallery(nextIdx);
        });

        galleryNext.addEventListener('click', () => {
            let nextIdx = (currentIdx < galleryDots.length - 1) ? currentIdx + 1 : 0;
            updateGallery(nextIdx);
        });

        galleryDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateGallery(index);
            });
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && mainImg && lightboxImg) {
        // Open lightbox
        mainImg.addEventListener('click', () => {
            lightboxImg.src = mainImg.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });

        // Close lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    console.log('Gymnastics Hub Scripts Initialized!');
});
