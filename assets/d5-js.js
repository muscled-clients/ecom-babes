/* ============================
   Quick Buy Popup Initialization
   ============================ */
window.initializePopup = function () {
    let popup = document.querySelector(".quick-buy-popup-d5 .d5-quick-popup");

    if (!popup) {
        setTimeout(initializePopup, 500);
        return;
    }

    let variantsJsonString = popup.getAttribute("d5-variants-json");

    if (!variantsJsonString) {
        return;
    }

    let variantsJson;
    try {
        variantsJson = JSON.parse(variantsJsonString);
    } catch (error) {
        return;
    }

    let selectedOptions = [];

    function initializeSelectedOptions() {
        selectedOptions = Array.from(document.querySelectorAll(".quick-buy-popup-d5 .product-values-d5")).map(group => {
            let activeOption = group.querySelector(".option-d5.active-value");
            return activeOption ? activeOption.getAttribute("value") : "";
        });
    }

    function updateSelectedVariant() {
        let selectedVariant = variantsJson.find((variant) => {
            let variantOptions = variant.options.map(opt => opt.toString().trim());
            let selectedOptionsTrimmed = selectedOptions.map(opt => opt.toString().trim());

            return JSON.stringify(variantOptions) === JSON.stringify(selectedOptionsTrimmed);
        });

        let atcButton = document.querySelector(".quick-buy-popup-d5 .add-to-cart-d5");

        if (selectedVariant) {
            if (atcButton) {
                atcButton.setAttribute("data-variant-d5", selectedVariant.id);

                // Check if the variant is sold out
                if (!selectedVariant.available) {
                    atcButton.classList.add("not-available-d5");
                } else {
                    atcButton.classList.remove("not-available-d5");
                }
            }

            let priceElement = document.querySelector(".quick-buy-popup-d5 .variant-price-d5");
            if (priceElement) {
                priceElement.textContent = (selectedVariant.price / 100) + " USD";
            }

            let imgElement = document.querySelector(".quick-buy-popup-d5 .variant-info-d5 img");
            if (imgElement && selectedVariant.featured_image) {
                imgElement.src = selectedVariant.featured_image.src;
            }
        } else {
            if (atcButton) {
                atcButton.classList.add("not-available-d5");
            }
        }
    }

    document.querySelector(".quick-buy-popup-d5").addEventListener("click", function (event) {
        let optionElement = event.target.closest(".option-d5");

        if (!optionElement) return;

        let optionGroup = optionElement.closest(".product-values-d5");

        if (!optionGroup) return;

        let allGroups = Array.from(document.querySelectorAll(".quick-buy-popup-d5 .product-values-d5"));
        let optionIndex = allGroups.findIndex(group => group === optionGroup);

        if (optionIndex < 0 || optionIndex >= selectedOptions.length) {
            return;
        }

        optionGroup.querySelectorAll(".option-d5").forEach((el) => el.classList.remove("active-value"));
        optionElement.classList.add("active-value");

        selectedOptions[optionIndex] = optionElement.getAttribute("value");

        let selectedSpan = optionGroup.previousElementSibling.querySelector(".selected-option-d5");
        if (selectedSpan) selectedSpan.textContent = optionElement.textContent;

        updateSelectedVariant();
    });

    initializeSelectedOptions();
    updateSelectedVariant();
};



/* ============================
   Product Slider Functionality
   ============================ */
document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".nc-fp-slider-d5");

    sliders.forEach(slider => {
        const computedStyle = getComputedStyle(slider);
        const slidesToShow = parseInt(computedStyle.getPropertyValue('--slides-to-show')) || 4;
        const slideGap = parseInt(computedStyle.getPropertyValue('--slide-gap')) || 24;

        let currentIndex = 0;
        const slides = Array.from(slider.querySelectorAll(".nc-fp-slide-d5"));
        const progress = slider.closest('.nc-fp-slider-container-d5').querySelector('.nc-fp-progress-d5');
        const totalSlides = slides.length;

        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        const sensitivity = 50;
        let isClickPrevented = false;

        let startTime = 0;
        let isTouchMove = false;

        // Set slide width dynamically
        slides.forEach(slide => {
            slide.style.flex = `0 0 calc(${100 / slidesToShow}% - ${slideGap / slidesToShow}px)`;
        });

        function updateProgressBar() {
            const progressWidth = (slidesToShow / totalSlides) * 100;
            if (progress) progress.style.width = `${progressWidth}%`;
        }

        function moveSlide(direction) {
            const maxIndex = totalSlides - slidesToShow;
            if (direction === -1 && currentIndex > 0) currentIndex--;
            else if (direction === 1 && currentIndex < maxIndex) currentIndex++;
            updateSlidePosition();
        }

        function updateSlidePosition() {
            const slideWidth = slides[0].offsetWidth + slideGap;
            currentTranslate = currentIndex * -slideWidth;
            prevTranslate = currentTranslate;
            slider.style.transform = `translateX(${currentTranslate}px)`;
            updateProgressBarPosition();
        }

        function updateProgressBarPosition() {
            const progressWidth = ((currentIndex + slidesToShow) / totalSlides) * 100;
            if (progress) progress.style.width = `${progressWidth}%`;
        }

        function startDrag(event) {
            isDragging = true;
            isClickPrevented = false;
            startX = getPositionX(event);
            startTime = Date.now();
            isTouchMove = false;

            slider.style.transition = 'none';
            slider.classList.add('grabbing');
            animationID = requestAnimationFrame(animation);
        }

        function endDrag(event) {
            isDragging = false;
            cancelAnimationFrame(animationID);
            slider.style.transition = 'transform 0.3s ease-out';
            slider.classList.remove('grabbing');

            const movedBy = currentTranslate - prevTranslate;
            const slideWidth = slides[0].offsetWidth + slideGap;

            if (Math.abs(movedBy) > 10) {
                isClickPrevented = true;
            }

            // Swipe Detection (For mobile)
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 300 && isTouchMove) { // Quick swipe
                if (movedBy < -sensitivity && currentIndex < totalSlides - slidesToShow) {
                    currentIndex++;
                } else if (movedBy > sensitivity && currentIndex > 0) {
                    currentIndex--;
                }
            } else { // Slow drag
                if (movedBy < -sensitivity && currentIndex < totalSlides - slidesToShow) {
                    currentIndex++;
                } else if (movedBy > sensitivity && currentIndex > 0) {
                    currentIndex--;
                }
            }

            updateSlidePosition();
        }

        function moveDrag(event) {
            if (!isDragging) return;
            isTouchMove = true;
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + (currentPosition - startX);
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            if (isDragging) {
                slider.style.transform = `translateX(${currentTranslate}px)`;
                requestAnimationFrame(animation);
            }
        }

        // Prevent click on links if user is dragging
        slider.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (event) {
                if (isClickPrevented) {
                    event.preventDefault();
                }
            });
        });

        // Initialize
        updateSlidePosition();
        updateProgressBar();

        // Add event listeners for drag functionality
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('mouseup', endDrag);
        slider.addEventListener('mouseleave', endDrag);
        slider.addEventListener('mousemove', moveDrag);

        slider.addEventListener('touchstart', startDrag, { passive: true });
        slider.addEventListener('touchend', endDrag);
        slider.addEventListener('touchmove', moveDrag, { passive: false });

        // Prevent image dragging
        slider.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
        });

        // Attach navigation buttons to correct slider
        const leftArrow = slider.closest('.nc-fp-slider-container-d5').querySelector('.nc-fp-arrow-d5.left');
        const rightArrow = slider.closest('.nc-fp-slider-container-d5').querySelector('.nc-fp-arrow-d5.right');

        if (leftArrow) leftArrow.addEventListener("click", () => moveSlide(-1));
        if (rightArrow) rightArrow.addEventListener("click", () => moveSlide(1));

        // Prevent scrolling while dragging on mobile
        slider.addEventListener('touchmove', function (event) {
            if (isDragging) event.preventDefault();
        }, { passive: false });
    });
});


/* ============================
   Quick View Modal
   ============================ */
document.addEventListener("DOMContentLoaded", function () {
    const mainContainer = document.querySelector('.nc-fp-main-d5');

    document.querySelectorAll(".close-quick-model-d5").forEach((close) => {
        close.addEventListener("click", function () {
            if (mainContainer.classList.contains('popup--active')) {
                mainContainer.classList.remove('popup--active');
            }
        });
    });

    document.querySelectorAll(".quick-view-btn-d5").forEach((button) => {
        button.addEventListener("click", function () {
            let slide = this.closest(".nc-fp-slide-d5");
            let quickPopup = slide.querySelector(".d5-quick-popup");

            if (quickPopup) {
                let quickPopupClone = quickPopup.cloneNode(true);
                let quickBuyModal = document.querySelector(".dynamic-quick-model-data");

                quickBuyModal.innerHTML = "";
                quickBuyModal.appendChild(quickPopupClone);

                mainContainer.classList.add('popup--active');
                initializePopup();

                let closeBtn = quickBuyModal.querySelector(".close-icon-d5");
                if (closeBtn) {
                    closeBtn.addEventListener("click", function () {
                        quickBuyModal.style.display = "none";
                    });
                }
            }
        });
    });
});
