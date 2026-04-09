// Gymnastics Hub - Main Script (Hero Block Update)

document.addEventListener('DOMContentLoaded', () => {
    // -- Lenis Smooth Scroll Initialization --
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        lenis.stop(); // Stop scrolling while preloader is active

        const minDisplayTime = 2500;
        const startTime = Date.now();

        const hidePreloader = () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                preloader.classList.add('preloader--hidden');
                document.body.classList.remove('loading');
                lenis.start(); // Enable scrolling after preloader is hidden
                
                // Remove from DOM after transition
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }, remainingTime);
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }
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

    // Password Toggle Logic (Universal for all auth pages)
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('.form-input');
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');
            
            if (input && eyeOpen && eyeClosed) {
                const isPassword = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPassword ? 'text' : 'password');
                
                // Toggle icons
                eyeOpen.style.display = isPassword ? 'none' : 'block';
                eyeClosed.style.display = isPassword ? 'block' : 'none';
                
                btn.classList.toggle('active');
            }
        });
    });

    // Role Selector Logic
    const roleOptions = document.querySelectorAll('.role-option');
    const selectedRoleInput = document.getElementById('selectedRole');

    if (roleOptions.length > 0 && selectedRoleInput) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active from others
                roleOptions.forEach(opt => opt.classList.remove('active'));
                // Add active to clicked
                option.classList.add('active');
                // Update hidden input
                selectedRoleInput.value = option.getAttribute('data-role');
                
                console.log(`Selected role: ${selectedRoleInput.value}`);
            });
        });
    }

    // --- SPA Auth Logic ---
    const authCard = document.querySelector('.auth-card');
    const authTitle = document.querySelector('.auth-card__title');
    const authSubtext = document.querySelector('.auth-card__subtext');
    const authForms = document.querySelectorAll('.auth-form');
    const recoverySuccess = document.querySelector('.recovery-success');

    if (authCard && authTitle) {
        window.showAuthState = function(state, extra = '') {
            // Hide all states first
            authForms.forEach(f => f.classList.remove('active'));
            if (recoverySuccess) recoverySuccess.style.display = 'none';
            if (authSubtext) authSubtext.style.display = 'none';
            authTitle.style.display = 'block';

            // Switch logic
            switch(state) {
                case 'login':
                    authTitle.innerText = 'Вход в аккаунт';
                    document.getElementById('loginForm').classList.add('active');
                    break;
                case 'register':
                    authTitle.innerText = 'Создать аккаунт';
                    document.getElementById('registerForm').classList.add('active');
                    break;
                case 'recovery':
                    authTitle.innerText = 'Восстановление аккаунта';
                    document.getElementById('recoveryForm').classList.add('active');
                    break;
                case 'reset':
                    authTitle.innerText = 'Восстановление аккаунта';
                    if (authSubtext) {
                        authSubtext.innerText = extra || 'example@mail.com';
                        authSubtext.style.display = 'block';
                    }
                    document.getElementById('resetPasswordForm').classList.add('active');
                    break;
                case 'success':
                    authTitle.style.display = 'none';
                    if (recoverySuccess) recoverySuccess.style.display = 'block';
                    break;
            }
            
            // Scroll to top of card for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Check hash on load to show specific state (e.g. login.html#reset)
        const initialHash = window.location.hash.substring(1);
        if (initialHash && ['login', 'register', 'recovery', 'reset', 'success'].includes(initialHash)) {
            showAuthState(initialHash);
        }

        // Attach listeners to navigation links
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('a');
            if (!target) return;

            const href = target.getAttribute('href');
            if (!href) return;
            
            // Check if we are on the auth page or at least have the forms
            if (!document.getElementById('loginForm')) return;

            if (href.endsWith('register.html')) {
                e.preventDefault();
                showAuthState('register');
            } else if (href.endsWith('login.html')) {
                e.preventDefault();
                showAuthState('login');
            } else if (href.endsWith('forgot-password.html')) {
                e.preventDefault();
                showAuthState('recovery');
            }
        });

        // Handle recovery form submission (demo success state)
        const recoveryForm = document.getElementById('recoveryForm');
        if (recoveryForm) {
            recoveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showAuthState('success');
            });
        }
    }

    console.log('Gymnastics Hub Scripts Initialized!');
});
