/* ============================
   Add to Cart Functionality
   ============================ */
async function addToCart(button) {
    let variantId = button.getAttribute("data-variant-d5");
   let qty = button.getAttribute("data-quantity-d5") || 1;
    if (!variantId) return;

    try {
        let response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: qty })
        });

        if (!response.ok) throw new Error("Failed to add product to cart");

        await response.json();
        await rerenderCartIcon();
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Something went wrong. Please try again.");
    }
}

/* ============================
   Update Cart Icon
   ============================ */
async function rerenderCartIcon() {
    try {
        let response = await fetch(window.location.pathname);
        if (!response.ok) throw new Error("Failed to reload cart icon");

        let htmlText = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlText, "text/html");

        let newCartIcon = doc.querySelector(".d5-cart-icon");
        let currentCartIcon = document.querySelector(".d5-cart-icon");

        if (newCartIcon && currentCartIcon) {
            currentCartIcon.replaceWith(newCartIcon);
        }
    } catch (error) {
        console.error("Error reloading cart icon:", error);
    }
}