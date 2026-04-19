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
                
                // Ensure we start at the top
                window.scrollTo(0, 0);
                lenis.scrollTo(0, { immediate: true });
                
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
    } else {
        // No preloader on this page — ensure scroll works immediately
        document.body.classList.remove('loading');
        lenis.start();
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

    // Mobile Menu Toggle — handled in the Burger section below


    // Promo Slider Logic
    const sliderTrack = document.querySelector('.promo-slider__track');
    const slides = document.querySelectorAll('.promo-slide');

    if (sliderTrack && slides.length > 0) {
        // Helper to center slide smoothly (fixed to prevent window jumping)
        const centerActiveSlide = (slide, smooth = true) => {
            if (!slide || !sliderTrack) return;
            
            const container = sliderTrack.parentElement; // .promo-slider
            const scrollLeft = slide.offsetLeft - (container.clientWidth / 2) + (slide.clientWidth / 2);
            
            container.scrollTo({
                left: scrollLeft,
                behavior: smooth ? 'smooth' : 'auto'
            });
        };

        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                const isActive = slide.classList.contains('active');
                const href = slide.getAttribute('href');

                if (isActive && href && href !== '#') {
                    // If already active and has a real link, allow navigation
                    return;
                }

                // Otherwise, prevent navigation and just activate/center
                e.preventDefault();
                slides.forEach(s => s.classList.remove('active'));
                slide.classList.add('active');
                centerActiveSlide(slide);
            });
        });

        // Initial state selection: prefer 2nd slide
        let initialSlide = slides[0];
        if (slides.length > 1) {
            initialSlide = slides[1];
        }

        // Reset and set active
        slides.forEach(s => s.classList.remove('active'));
        
        // Final centering with delay to ensure rendering is complete
        setTimeout(() => {
            initialSlide.classList.add('active');
            centerActiveSlide(initialSlide);
        }, 500);
    }



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

    // --- Add Event SPA Logic ---
    const addEventSteps = document.querySelectorAll('.step-content');
    const stepperSteps = document.querySelectorAll('.stepper .step');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');
    const btnPublish = document.getElementById('btnPublish');
    const choiceCards = document.querySelectorAll('.choice-card');
    
    let currentStep = 1;

    if (addEventSteps.length > 0 && btnNext) {
        const updateStepUI = () => {
            // Update Visibility
            addEventSteps.forEach((s, idx) => {
                s.classList.toggle('active', idx === currentStep - 1);
            });

            // Update Stepper
            stepperSteps.forEach((s, idx) => {
                s.classList.toggle('active', idx === currentStep - 1);
                s.classList.toggle('completed', idx < currentStep - 1);
            });

            // Update Buttons
            if (btnPrev) btnPrev.style.display = currentStep > 1 ? 'block' : 'none';
            
            if (currentStep === 3) {
                if (btnNext) btnNext.style.display = 'none';
                if (btnPublish) btnPublish.style.display = 'flex';
                
                // Populate summary (Step 3)
                const activeChoice = document.querySelector('.choice-card.active');
                const typeVal = activeChoice ? activeChoice.getAttribute('data-type') : 'Не выбрано';
                
                const titleVal = document.getElementById('eventTitle')?.value || 'Без названия';
                const countrySel = document.getElementById('eventCountry');
                const citySel = document.getElementById('eventCity');
                const countryVal = countrySel ? countrySel.options[countrySel.selectedIndex]?.text : '';
                const cityVal = citySel ? citySel.options[citySel.selectedIndex]?.text : '';
                const placeVal = document.getElementById('eventPlace')?.value || '';
                
                const dateVal = document.getElementById('eventDate')?.value || 'Дата не указана';
                const descVal = document.getElementById('eventDesc')?.value || 'Описание отсутствует';
                
                if (document.getElementById('previewType')) document.getElementById('previewType').innerText = typeVal;
                // Level is currently hidden in some mocks but we can default it or hide it
                if (document.getElementById('previewLevel')) document.getElementById('previewLevel').innerText = countryVal === 'Италия' ? 'Международный' : 'Республиканский';
                
                if (document.getElementById('previewTitle')) document.getElementById('previewTitle').innerText = titleVal;
                if (document.getElementById('previewTitleBreadcrumb')) document.getElementById('previewTitleBreadcrumb').innerText = titleVal;
                
                const fullLocation = [countryVal, cityVal, placeVal].filter(v => v && v !== 'Страна' && v !== 'Город').join(', ');
                if (document.getElementById('previewLocation')) document.getElementById('previewLocation').innerText = fullLocation || 'Место не указано';
                
                if (document.getElementById('previewDate')) document.getElementById('previewDate').innerText = dateVal;
                
                const previewDescContainer = document.getElementById('previewDesc');
                if (previewDescContainer) {
                    previewDescContainer.innerHTML = `<p>${descVal.replace(/\n/g, '</p><p>')}</p>`;
                }
            } else {
                if (btnNext) btnNext.style.display = 'flex';
                if (btnPublish) btnPublish.style.display = 'none';
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        btnNext.addEventListener('click', () => {
            if (currentStep < 3) {
                currentStep++;
                updateStepUI();
            }
        });

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateStepUI();
                }
            });
        }

        choiceCards.forEach(card => {
            card.addEventListener('click', () => {
                choiceCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        if (btnPublish) {
            btnPublish.addEventListener('click', () => {
                const successModal = document.getElementById('successModal');
                const btnModalHome = document.getElementById('btnModalHome');
                
                if (successModal) {
                    successModal.style.display = 'flex';
                    // Trigger reflow for animation
                    successModal.offsetHeight;
                    successModal.classList.add('active');
                    
                    if (btnModalHome) {
                        btnModalHome.addEventListener('click', () => {
                            window.location.href = 'index.html';
                        });
                    }

                    // Optional fallback redirect after a few seconds
                    // setTimeout(() => window.location.href = 'index.html', 5000);
                }
            });
        }
    }

    // ── Burger / Mobile Navigation ──────────────────────────────────────
    const header     = document.querySelector('.main-header');
    const mobileNav  = document.querySelector('.mobile-nav');
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle && mobileNav && header) {
        // Open / close
        const openMenu = () => {
            header.classList.add('nav-open');
            mobileNav.classList.add('is-open');
            document.body.style.overflow = 'hidden'; // lock scroll
        };

        const closeMenu = () => {
            header.classList.remove('nav-open');
            mobileNav.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', () => {
            if (mobileNav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close via Close button
        const closeBtn = mobileNav.querySelector('.mobile-nav__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Close when a plain link (not dropdown toggle) is clicked
        mobileNav.querySelectorAll('a:not(.has-dropdown)').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Accordion dropdowns inside mobile nav
        mobileNav.querySelectorAll('.mobile-nav__link.has-dropdown').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const dropdown = toggle.nextElementSibling;
                const isOpen = toggle.classList.contains('open');

                // Close all others first
                mobileNav.querySelectorAll('.mobile-nav__link.has-dropdown.open').forEach(el => {
                    el.classList.remove('open');
                    el.nextElementSibling?.classList.remove('is-open');
                });

                if (!isOpen) {
                    toggle.classList.add('open');
                    dropdown?.classList.add('is-open');
                }
            });
        });
    }

    console.log('Gymnastics Hub Scripts Initialized!');
});
