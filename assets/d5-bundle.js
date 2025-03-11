(function () {   
    const bundles = document.querySelectorAll('.b-card-d5');   
    const qtyInput = document.querySelector('.qty-input-d6');   
    const secondQtyInput = document.querySelector('.d5-quantity-input');   
    const comparePrices = document.querySelectorAll('.compare-price-d5');   
    const sellingPrices = document.querySelectorAll('.selling-price-d5');   
    const sizeOptions = document.querySelectorAll('.cc-select__option.js-option');   
    const variantSelect = document.querySelector('.d6-select'); // Select dropdown

    function getSelectedVariantId() {
        return variantSelect ? variantSelect.value : null;
    }

    function updatePrices(selectedVariant) {
        if (!selectedVariant) return; 

        bundles.forEach((bundle, index) => {
            let discountPercent = parseFloat(bundle.getAttribute('data-off-d5')) || 0;
            let variantPrice = selectedVariant.price / 100;
            let compareAtPrice = selectedVariant.compare_at_price ? selectedVariant.compare_at_price / 100 : variantPrice;  

            let discountAmount = (variantPrice * discountPercent) / 100;
            let discountedPrice = variantPrice - discountAmount; 

            sellingPrices[index].textContent = `US $${discountedPrice.toFixed(2)}`;
            comparePrices[index].textContent = `US $${compareAtPrice.toFixed(2)}`;
        });
    }

    function fetchVariantAndUpdate() {
        let variantId = getSelectedVariantId();
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
          if (secondQtyInput){
             secondQtyInput.value = bundleQuantity;
          }
        }
    }

    bundles.forEach((bundle) => {
        bundle.addEventListener('click', () => {
            bundles.forEach(bun => bun.classList.remove('selected-bundle'));
            bundle.classList.add('selected-bundle');
            updateQuantity();
        });
    });

    // Listen for variant selection change in the select dropdown
    if (variantSelect) {
        variantSelect.addEventListener('change', fetchVariantAndUpdate);
    }

    // Detect URL changes when variant updates (e.g., via Shopify's script)
    const observer = new MutationObserver(() => {
        fetchVariantAndUpdate();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', fetchVariantAndUpdate);

    // Initial setup
    fetchVariantAndUpdate();
    updateQuantity();
})();
(function () {   
    const bundles = document.querySelectorAll('.b-card-d5');   
    const qtyInput = document.querySelector('.qty-input-d6');   
    const secondQtyInput = document.querySelector('.d5-quantity-input');   
    const comparePrices = document.querySelectorAll('.compare-price-d5');   
    const sellingPrices = document.querySelectorAll('.selling-price-d5');   
    const sizeOptions = document.querySelectorAll('.cc-select__option.js-option');   
    const variantSelect = document.querySelector('.d6-select'); // Select dropdown

    function getSelectedVariantId() {
        return variantSelect ? variantSelect.value : null;
    }

    function updatePrices(selectedVariant) {
        if (!selectedVariant) return; 

        bundles.forEach((bundle, index) => {
            let discountPercent = parseFloat(bundle.getAttribute('data-off-d5')) || 0;
            let variantPrice = selectedVariant.price / 100;
            let compareAtPrice = selectedVariant.compare_at_price ? selectedVariant.compare_at_price / 100 : variantPrice;  

            let discountAmount = (variantPrice * discountPercent) / 100;
            let discountedPrice = variantPrice - discountAmount; 

            sellingPrices[index].textContent = `US $${discountedPrice.toFixed(2)}`;
            comparePrices[index].textContent = `US $${compareAtPrice.toFixed(2)}`;
        });
    }

    function fetchVariantAndUpdate() {
        let variantId = getSelectedVariantId();
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

    // Listen for variant selection change in the select dropdown
    if (variantSelect) {
        variantSelect.addEventListener('change', fetchVariantAndUpdate);
    }

    // Detect URL changes when variant updates (e.g., via Shopify's script)
    const observer = new MutationObserver(() => {
        fetchVariantAndUpdate();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', fetchVariantAndUpdate);

    // Initial setup
    fetchVariantAndUpdate();
    updateQuantity();
})();
