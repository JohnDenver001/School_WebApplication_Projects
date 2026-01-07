// ===== shared cart manager (server-side) =====

// add item to cart
async function addToCart(productId) {
    // 1. check if user is authenticated (frontend check for better ux)
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated === false) {
        alert("Please log in to add items to your cart.");
        window.location.href = '/auth/login';
        return;
    }

    try {
        const response = await fetch('/products/add-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pid: productId, quantity: 1 })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            updateCartDisplay();
            showToast();
        } else {
            if (response.status === 401) window.location.href = '/auth/login';
            else alert(result.message || "Failed to add item");
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// update cart (increase/decrease/remove)
async function updateCartItem(productId, action) {
    try {
        const response = await fetch('/products/update-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pid: productId, action: action })
        });

        if (response.ok) {
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// wrapper functions for html onclick events
function increaseQty(productId) {
    updateCartItem(productId, 'increase');
}

function decreaseQty(productId) {
    updateCartItem(productId, 'decrease');
}

function removeFromCart(productId) {
    updateCartItem(productId, 'remove');
}

// update cart display by fetching latest data from server
async function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    try {
        const response = await fetch('/products/get-cart');
        const data = await response.json();
        
        const items = data.items;
        const total = data.total;

        // update badge
        let totalQty = 0;
        // using standard for loop
        for (let i = 0; i < items.length; i++) {
            totalQty += items[i].quantity;
        }

        if (cartCount) {
            cartCount.textContent = totalQty;
            cartCount.style.display = totalQty > 0 ? 'block' : 'none';
        }
        
        // update sidebar
        if (cartItems) {
            if (items.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                if (cartTotal) cartTotal.textContent = '₱0.00';
            } else {
                let itemsHtml = '';
                
                items.forEach(function(item) {
                    itemsHtml += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-controls">
                                <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
                                <span class="qty">${item.quantity}</span>
                                <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="trash-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>`;
                });

                cartItems.innerHTML = itemsHtml;
                if (cartTotal) cartTotal.textContent = `₱${total.toFixed(2)}`;
            }
        }
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// checkout function
async function checkout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if(checkoutBtn) checkoutBtn.textContent = "Processing...";

    try {
        const response = await fetch('/products/check_out', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // update ui to reflect empty cart
            updateCartDisplay();
            
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('active');

            // redirect to trigger flash message display
            window.location.href = '/products/products'; 
        } else {
            if (response.status === 401) {
                 window.location.href = '/auth/login';
            } else {
                // reload to show flash message error
                window.location.reload();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred during checkout.");
    } finally {
        if(checkoutBtn) checkoutBtn.textContent = "CHECKOUT";
    }
}

// initialize on load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        const newBtn = checkoutBtn.cloneNode(true);
        checkoutBtn.parentNode.replaceChild(newBtn, checkoutBtn);
        newBtn.addEventListener('click', checkout);
    }
});