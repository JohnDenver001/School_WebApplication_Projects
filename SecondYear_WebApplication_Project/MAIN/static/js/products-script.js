let products = [];
let filteredProducts = [];
const PRODUCTS_PER_PAGE = 25;
let currentPage = 1;

// initialize state
let activeFilters = {
    search: '',
    category: '',
    minRating: 0,
    minPrice: 0,
    maxPrice: Infinity
};

// initialize products
document.addEventListener('DOMContentLoaded', function() {
    // 1. try to use the data injected from flask (faster)
    if (typeof productsData !== 'undefined') {
        products = productsData;
        filteredProducts = [...products];
        renderProducts();
    } 
    // 2. fallback to api if variable is missing
    else {
        loadProducts();
    }
});

// helper: load from api (fallback)
async function loadProducts(){
    try {
        const response = await fetch('/products/api/products');
        products = await response.json();
        filteredProducts = [...products];
        renderProducts();
    } catch (error) {
        console.error("Error loading products", error);
    }
}

// generate star rating html
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    if (hasHalfStar) {
        starsHTML += '★'; // you can replace with a half-star char if you have one
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }
    
    return starsHTML;
}

// render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    // show empty state if no results
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p>No products found matching your criteria.</p>
            </div>
        `;
        return;
    }

    // calculate pagination
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // note: product.id comes from to_dict() in python
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-reviews">
                <span class="stars">${generateStarRating(product.rating)}</span>
                <span class="review-count">(${product.reviews || 0})</span>
            </div>
            <div class="price-add-row">
                <span class="product-price">₱${product.price.toFixed(2)}</span>
                <button class="add-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add <span class="cart-icon">🛒</span>
                </button>
            </div>
        `;
        
        // add click event to open modal
        productCard.addEventListener('click', function() {
            openProductModal(product);
        });
        
        productsGrid.appendChild(productCard);
    });
    
    updatePagination();
}

// update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const prevBtn = document.querySelector('.prev-page');
    const nextBtn = document.querySelector('.next-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    pageNumbers.forEach((btn, index) => {
        const pageNum = index + 1;
        btn.classList.toggle('active', pageNum === currentPage);
        btn.style.display = pageNum <= totalPages ? 'inline-block' : 'none';
    });
}

// ===== filter logic (fixed) =====

function applyAllFilters() {
    filteredProducts = products.filter(product => {
        // 1. search filter
        const matchesSearch = activeFilters.search === '' || 
            product.name.toLowerCase().includes(activeFilters.search) ||
            product.description.toLowerCase().includes(activeFilters.search);
        
        // 2. category filter
        // normalize strings: "eco-household" (db) vs "eco household" (select)
        const productCat = (product.category || '').toLowerCase().replace('-', ' ');
        const filterCat = activeFilters.category.toLowerCase().replace('-', ' ');
        const matchesCategory = activeFilters.category === '' || productCat === filterCat;
        
        // 3. rating filter
        const matchesRating = product.rating >= activeFilters.minRating;
        
        // 4. price filter
        const matchesPrice = product.price >= activeFilters.minPrice && 
                             product.price <= activeFilters.maxPrice;
        
        return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });
    
    currentPage = 1; // reset to page 1 when filtering
    renderProducts();
}

// event listeners

// search
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', function(e) {
    activeFilters.search = e.target.value.toLowerCase();
    applyAllFilters();
});

// category (fixed)
const categorySelect = document.querySelector('.category-select');
categorySelect?.addEventListener('change', function(e) {
    activeFilters.category = e.target.value;
    applyAllFilters();
});

// filter dropdown toggle
const filterToggle = document.getElementById('filterToggle');
const filterDropdown = document.getElementById('filterDropdown');

filterToggle?.addEventListener('click', function(e) {
    e.stopPropagation();
    filterDropdown.classList.toggle('active');
});

document.addEventListener('click', function(e) {
    if (filterDropdown && !filterDropdown.contains(e.target) && e.target !== filterToggle) {
        filterDropdown.classList.remove('active');
    }
});

// rating options
document.querySelectorAll('.rating-option').forEach(option => {
    option.addEventListener('click', function() {
        // toggle active class
        const isActive = this.classList.contains('active');
        document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('active'));
        
        if (!isActive) {
            this.classList.add('active');
            activeFilters.minRating = parseFloat(this.dataset.rating);
        } else {
            activeFilters.minRating = 0; // unselect
        }
    });
});

// apply filters button
document.getElementById('applyFilters')?.addEventListener('click', function() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    activeFilters.minPrice = minPrice;
    activeFilters.maxPrice = maxPrice;
    
    applyAllFilters();
    filterDropdown.classList.remove('active');
});

// clear filters button (fixed)
document.getElementById('clearFilters')?.addEventListener('click', function() {
    activeFilters = {
        search: '',
        category: '',
        minRating: 0,
        minPrice: 0,
        maxPrice: Infinity
    };
    
    // reset ui inputs
    if(searchInput) searchInput.value = '';
    if(categorySelect) categorySelect.value = '';
    
    const minPriceInput = document.getElementById('minPrice');
    if(minPriceInput) minPriceInput.value = '';
    
    const maxPriceInput = document.getElementById('maxPrice');
    if(maxPriceInput) maxPriceInput.value = '';
    
    document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('active'));
    
    applyAllFilters();
    filterDropdown.classList.remove('active');
});

// pagination buttons
document.querySelector('.prev-page')?.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.querySelector('.next-page')?.addEventListener('click', function() {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.querySelectorAll('.page-number').forEach((btn, index) => {
    btn.addEventListener('click', function() {
        currentPage = index + 1;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== product modal =====

let currentModalProduct = null;

function openProductModal(product) {
    currentModalProduct = product;
    const modal = document.getElementById('productModal');
    
    // populate data
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalStars').textContent = generateStarRating(product.rating);
    document.getElementById('modalReviews').textContent = `${product.reviews || 0} reviews`;
    document.getElementById('modalPrice').textContent = `₱${product.price.toFixed(2)}`;
    document.getElementById('modalMainImage').src = product.image;
    
    // fix: added description population
    const descEl = document.getElementById('modalDescription');
    if(descEl) descEl.textContent = product.description;
    
    // reset wishlist ui
    const wishlistBtn = document.getElementById('modalWishlistBtn');
    const wishlistIcon = wishlistBtn?.querySelector('svg');
    
    if (wishlistBtn) {
        wishlistBtn.style.backgroundColor = 'white';
        if(wishlistIcon) wishlistIcon.setAttribute('fill', 'none');
        
        // check wishlist status
        if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
            fetch(`/products/wishlist/check/${product.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.in_wishlist) {
                        if(wishlistIcon) wishlistIcon.setAttribute('fill', '#2d5016');
                        wishlistBtn.dataset.active = "true";
                    } else {
                        wishlistBtn.dataset.active = "false";
                    }
                })
                .catch(err => console.error("Error checking wishlist", err));
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProduct = null;
}

// modal event listeners
document.getElementById('closeModal')?.addEventListener('click', closeProductModal);

document.getElementById('productModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeProductModal();
    }
});

document.getElementById('modalAddBtn')?.addEventListener('click', function() {
    if (currentModalProduct) {
        addToCart(currentModalProduct.id);
        setTimeout(() => {
            closeProductModal();
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.add('active');
        }, 300);
    }
});

document.getElementById('modalWishlistBtn')?.addEventListener('click', async function() {
    if (typeof isAuthenticated !== 'undefined' && !isAuthenticated) {
        alert("Please log in to save items to your wishlist.");
        window.location.href = '/auth/login';
        return;
    }

    if (currentModalProduct) {
        try {
            const response = await fetch('/products/wishlist/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pid: currentModalProduct.id })
            });

            const result = await response.json();
            const svg = this.querySelector('svg');

            if (result.success) {
                if (result.action === 'added') {
                    if(svg) svg.setAttribute('fill', '#2d5016');
                    this.dataset.active = "true";
                } else {
                    if(svg) svg.setAttribute('fill', 'none');
                    this.dataset.active = "false";
                }
                
                // reuse the shared toast function
                if (typeof showToast === 'function') {
                    const toast = document.getElementById('toast');
                    const originalText = toast.textContent;
                    toast.textContent = result.message;
                    showToast();
                    setTimeout(() => toast.textContent = "Added to cart!", 2500); 
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    }
});

// close on escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeProductModal();
});