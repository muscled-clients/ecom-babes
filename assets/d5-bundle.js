(function () {   
    const bundles = document.querySelectorAll('.b-card-d5');   
    const qtyInput = document.querySelector('.qty-input-d6');   
    const secondQtyInput = document.querySelector('.d5-quantity-input'); // Optional
    const comparePrices = document.querySelectorAll('.compare-price-d5');   
    const sellingPrices = document.querySelectorAll('.selling-price-d5');   
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Read as text first
            })
            .then(text => {
                try {
                    return JSON.parse(text); // Parse JSON safely
                } catch (error) {
                    throw new Error("Response is not valid JSON: " + text);
                }
            })
            .then(product => {
                let selectedVariant = product.variants.find(v => v.id == variantId);
                updatePrices(selectedVariant);
            })
            .catch(error => console.error("Error fetching variant:", error));
    }

    function updateQuantity() {
        const selectedBundle = document.querySelector('.b-card-d5.selected-bundle');
        if (selectedBundle) {
            let bundleQuantity = selectedBundle.getAttribute('data-quantity-d5');
            qtyInput.value = bundleQuantity;
            
            // Only update second input if it exists
            if (secondQtyInput) {
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

    // Initial setup
    fetchVariantAndUpdate();
    updateQuantity();
})();
