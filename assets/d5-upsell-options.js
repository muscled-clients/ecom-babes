/* ======================================
   PDP Upsell Options & Variant Handling
   ====================================== */
(function () {
  const upsells = document.querySelectorAll('.nc-up-main-d5');

  upsells.forEach((upsell) => {
    /* ============================
       Get Elements for Each Upsell
       ============================ */
    const optionContainers = upsell.querySelectorAll('.up-option-values-d5');
    const qtyMinus = upsell.querySelector('.up-qty-minus-d5');
    const qtyPlus = upsell.querySelector('.up-qty-plus-d5');
    const qtyInput = upsell.querySelector('.up-qty-input-d5');
    const atcButton = upsell.querySelector('.add-to-cart-d5');
    const priceElement = upsell.querySelector('.up-content-d5 p');
    const imageElement = upsell.querySelector('.up-image-d5 img');
    const saleBadge = upsell.querySelector('.sale-label-d5');
    const variantsElement = upsell.querySelector('.up-variants-d5');

    /* ============================
       Update Selected Option Text
       ============================ */
    function updateSelectedOptionText() {
      optionContainers.forEach((container) => {
        const selectedOption = container.querySelector('.up-option-value-d5.selected-value-d5');
        const optionTextElement = container.closest('.up-option-container-d5').querySelector('.selected-option-value-d5');

        if (selectedOption && optionTextElement) {
          optionTextElement.textContent = selectedOption.textContent.trim();
        }
      });
    }

    /* ============================
       Find & Update Matching Variant
       ============================ */
    function updateProductDetails() {
      if (!variantsElement) return;

      // Get and parse variants JSON data
      const variantsJsonString = variantsElement.getAttribute('data-variants-json');
      if (!variantsJsonString) return;

      let variantsJson;
      try {
        variantsJson = JSON.parse(variantsJsonString);
      } catch (error) {
        console.error('Error parsing JSON from data-variants-json:', error);
        return;
      }

      // Get currently selected options
      const selectedOptions = Array.from(optionContainers).map(container => {
        const selectedOption = container.querySelector('.up-option-value-d5.selected-value-d5');
        return selectedOption ? selectedOption.getAttribute('value') : null;
      });

      // Find matching variant
      const matchingVariant = variantsJson.find(variant => {
        return variant.options.every((opt, index) => opt === selectedOptions[index]);
      });

      // Update product UI based on matching variant
      if (matchingVariant) {
        atcButton.setAttribute('data-variant-d5', matchingVariant.id);
        
        // Update price
        priceElement.innerHTML = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(matchingVariant.price / 100);

        // Update product image if variant has a featured image
        imageElement.src = matchingVariant.featured_image ? matchingVariant.featured_image.src : imageElement.src;

        // Update sale badge (if applicable)
        if (matchingVariant.compare_at_price > matchingVariant.price) {
          const discount = (matchingVariant.compare_at_price - matchingVariant.price) / 100;
          saleBadge.innerHTML = `Save ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(discount)}`;
          saleBadge.style.display = 'flex';
        } else {
          saleBadge.style.display = 'none';
        }

        // Update button state based on availability
        if (!matchingVariant.available) {
          atcButton.classList.add('soldout-d5');
        } else {
          atcButton.classList.remove('soldout-d5');
        }
      } else {
        // No matching variant found, disable the add-to-cart button
        atcButton.removeAttribute('data-variant-d5');
        atcButton.classList.add('soldout-d5');
      }

      updateSelectedOptionText();
    }

    /* ============================
       Update Quantity Controls
       ============================ */
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) || 1);
    atcButton.setAttribute('data-quantity-d5', qtyInput.value);

    qtyMinus?.addEventListener('click', () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      currentQty = Math.max(1, currentQty - 1);
      qtyInput.value = currentQty;
      atcButton.setAttribute('data-quantity-d5', currentQty);
    });

    qtyPlus?.addEventListener('click', () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      currentQty += 1;
      qtyInput.value = currentQty;
      atcButton.setAttribute('data-quantity-d5', currentQty);
    });

    qtyInput?.addEventListener('input', () => {
      let currentQty = parseInt(qtyInput.value) || 1;
      qtyInput.value = Math.max(1, currentQty);
      atcButton.setAttribute('data-quantity-d5', qtyInput.value);
    });

    /* ============================
       Handle Option Selection
       ============================ */
    optionContainers.forEach((optionContainer) => {
      const options = optionContainer.querySelectorAll('.up-option-value-d5');
      options.forEach((option) => {
        option.addEventListener('click', () => {
          options.forEach(op => op.classList.remove('selected-value-d5'));
          option.classList.add('selected-value-d5');

          updateProductDetails();
        });
      });
    });

    /* ============================
       Initialize Default Selections
       ============================ */
    updateProductDetails();
  });
})();
