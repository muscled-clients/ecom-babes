(function () {
  const bundles = document.querySelectorAll('.b-card-d5');
  const qtyInput = document.querySelector('.qty-input-d6');
  const secondQtyInput = document.querySelector('.d5-quantity-input');
  const comparePrices = document.querySelectorAll('.compare-price-d5');
  const sellingPrices = document.querySelectorAll('.selling-price-d5');
  const sizeOptions = document.querySelectorAll('.cc-select__option.js-option');

  function getVariantFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('variant');
  }

  function updatePrices(selectedVariant) {
    if (!selectedVariant) return;

    bundles.forEach((bundle, index) => {
      let discountPercent = parseFloat(bundle.getAttribute('data-off-d5')) || 0;
      let variantPrice = selectedVariant.price / 100;
      let compareAtPrice = selectedVariant.price / 100;
      
      let discountAmount = (variantPrice * discountPercent) / 100;
      let discountedPrice = variantPrice - discountAmount;

      sellingPrices[index].textContent = `US $${discountedPrice.toFixed(2)}`;
      comparePrices[index].textContent = `US $${compareAtPrice.toFixed(2)}`;
    });
  }

  function fetchVariantAndUpdate() {
    let variantId = getVariantFromURL();
    if (!variantId) return;

    fetch(`${window.location.pathname}.js`)
      .then(response => response.json())
      .then(product => {
        let selectedVariant = product.variants.find(v => v.id == variantId);
        updatePrices(selectedVariant);
      })
      .catch(error => console.error('Error fetching variant:', error));
  }

  function updateQuantity() {
    const selectedBundle = document.querySelector('.b-card-d5.selected-bundle');
    if (selectedBundle) { 
      let bundleQuantity = selectedBundle.getAttribute('data-quantity-d5');
      qtyInput.value = bundleQuantity;
      secondQtyInput.value = bundleQuantity;
    }
  }

  bundles.forEach((bundle) => {
    bundle.addEventListener('click', () => {
      bundles.forEach(bun => bun.classList.remove('selected-bundle'));
      bundle.classList.add('selected-bundle');
      updateQuantity();
    });
  });

  // Listen for variant selection from size options
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      let selectedSize = option.getAttribute('data-value');
      
      fetch(`${window.location.pathname}.js`)
        .then(response => response.json())
        .then(product => {
          let matchingVariant = product.variants.find(v => v.options.includes(selectedSize));
          
          if (matchingVariant) {
            _.addVariantUrlToHistory(matchingVariant); // Use the theme’s built-in function
            updatePrices(matchingVariant);
          }
        })
        .catch(error => console.error('Error fetching variant:', error));
    });
  });

  // Detect URL changes when variant updates (e.g., via Shopify's script)
  const observer = new MutationObserver(() => {
    fetchVariantAndUpdate();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('popstate', fetchVariantAndUpdate);

  fetchVariantAndUpdate();
  updateQuantity();
})();
