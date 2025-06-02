document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-icon");
    const cart = document.getElementById("cart");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const buyNowBtn = document.getElementById("buy-now");

    if (cartIcon && cart) {
        cartIcon.addEventListener("click", () => {
            cart.classList.toggle("visible");
        });
    }

    // Add to cart - event delegation
    document.querySelector('.product-grid')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const product = e.target.closest('.product');
            const productId = product.dataset.id;  // Get product ID from data attribute
            const productName = product.querySelector("h3").innerText;
            const productPrice = product.querySelector(".price").innerText;
            addToCart(productId, productName, productPrice);
        }
    });

    function addToCart(productId, name, priceText) {
        const cleanedPrice = priceText.replace(/[^\d.]/g, "");
        const price = parseFloat(cleanedPrice);
        if (isNaN(price)) return;

        const cartItem = document.createElement("li");
        cartItem.classList.add("cart-item");
        cartItem.dataset.id = productId;

        cartItem.innerHTML = `
            <span>${name}</span>
            <span class="item-price">₱${price.toFixed(2)}</span>
            <button class="remove-item">X</button>
        `;

        cartItems.appendChild(cartItem);

        updateCartStorage();
        updateTotal();
        attachRemoveListener(cartItem);
    }

    function attachRemoveListener(cartItem) {
        const removeBtn = cartItem.querySelector(".remove-item");
        if (removeBtn) {
            removeBtn.addEventListener("click", () => {
                cartItem.remove();
                updateCartStorage();
                updateTotal();
            });
        }
    }

    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            const priceText = item.querySelector(".item-price").innerText;
            const cleanedPrice = priceText.replace(/[^\d.]/g, "");
            const price = parseFloat(cleanedPrice);
            if (!isNaN(price)) total += price;
        });

        cartTotal.innerText = `Total: ₱${total.toFixed(2)}`;
        updateBuyNowButton();
    }

    function updateBuyNowButton() {
        if (cartItems.children.length === 0) {
            buyNowBtn.disabled = true;
            buyNowBtn.classList.add("disabled");
        } else {
            buyNowBtn.disabled = false;
            buyNowBtn.classList.remove("disabled");
        }
    }

    function updateCartStorage() {
        const cartData = [];
        cartItems.querySelectorAll(".cart-item").forEach(item => {
            const name = item.querySelector("span").innerText;
            const priceText = item.querySelector(".item-price").innerText;
            const cleanedPrice = priceText.replace(/[^\d.]/g, "");
            const productId = item.dataset.id;
            cartData.push({
                product_id: productId,
                name: name,
                price: cleanedPrice  
            });
        });
        localStorage.setItem("cart", JSON.stringify(cartData));
    }

    function loadCart() {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        savedCart.forEach(({ product_id, name, price }) => {
            const cartItem = document.createElement("li");
            cartItem.classList.add("cart-item");
            cartItem.dataset.id = product_id;
            cartItem.innerHTML = `
                <span>${name}</span>
                <span class="item-price">₱${parseFloat(price).toFixed(2)}</span>
                <button class="remove-item">X</button>
            `;
            cartItems.appendChild(cartItem);
            attachRemoveListener(cartItem);
        });
        updateTotal();
    }

    loadCart();

    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", () => {
            if (cartItems.children.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            const cartData = [];
            document.querySelectorAll(".cart-item").forEach(item => {
                const productId = item.dataset.id;
                const name = item.querySelector("span").innerText;
                const priceText = item.querySelector(".item-price").innerText;
                const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
                cartData.push({
                    product_id: productId,
                    name: name,
                    price: price,
                    quantity: 1
                });
            });

            localStorage.setItem("cart", JSON.stringify(cartData));
            localStorage.setItem("totalPrice", cartTotal.innerText.replace(/[^\d.]/g, ""));

            window.location.href = "payment.html";
        });
    }
});
