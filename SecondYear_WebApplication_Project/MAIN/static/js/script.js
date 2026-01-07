// sidebar menu toggle
const sidebar = document.getElementById('sidebar');
const cartBtn = document.getElementById('cartBtn');
const closeSidebar = document.getElementById('closeSidebar');

// open sidebar when cart button is clicked
cartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.add('active');
});

// close sidebar only when close button is clicked
closeSidebar?.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// prevent sidebar from closing when clicking inside it
sidebar?.addEventListener('click', (e) => {
    e.stopPropagation();
});

// sidebar link active state
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// carousel functionality for product highlight section
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const mainProductImage = document.querySelector('.main-product-image img');
const thumbnails = document.querySelectorAll('.thumbnail');
const featuredProductTitle = document.getElementById('featuredProductTitle');
const featuredProductDescription = document.getElementById('featuredProductDescription');

// featured products data matching the carousel images
const featuredProducts = [
    {
        name: 'Nature Natural Dishwashing Liquid',
        description: 'Made from 100% biodegradable bamboo, this toothbrush offers a sustainable alternative to plastic. The soft bristles are gentle on gums while effectively cleaning teeth. Perfect for daily use and ideal for eco-conscious individuals looking to reduce their plastic footprint.',
        image: 'images/Products/product1.jpg'
    },
    {
        name: 'Ecoliving Compostable Dish Sponge',
        description: 'Stay hydrated on the go with our BPA-free stainless steel water bottle. Designed to keep beverages cold for up to 24 hours or hot for 12 hours, this durable bottle is perfect for daily commutes, workouts, or outdoor adventures.',
        image: 'images/Products/product2.jpg'
    },
    {
        name: 'Coconut Husk Scrubber',
        description: 'Ditch single-use plastic bags with this spacious and sturdy tote made from 100% organic cotton. Perfect for grocery shopping, beach trips, or everyday errands. Stylish, washable, and built to last.',
        image: 'images/Products/product3.jpg'
    }
];

// only initialize carousel if elements exist
if (prevBtn && nextBtn && mainProductImage && thumbnails.length > 0) {
    let currentSlide = 0;

    // function to update the main image, product info, and active thumbnail with smooth transition
    function updateMainImage(index) {
        currentSlide = index;
        
        // fade out image
        mainProductImage.style.opacity = '0';
        
        // fade out text
        if (featuredProductTitle) featuredProductTitle.style.opacity = '0';
        if (featuredProductDescription) featuredProductDescription.style.opacity = '0';
        
        // change content after fade out
        setTimeout(() => {
            mainProductImage.src = thumbnails[currentSlide].querySelector('img').src;
            
            // update product title and description
            if (featuredProductTitle && featuredProducts[currentSlide]) {
                featuredProductTitle.textContent = featuredProducts[currentSlide].name;
            }
            if (featuredProductDescription && featuredProducts[currentSlide]) {
                featuredProductDescription.textContent = featuredProducts[currentSlide].description;
            }
            
            // fade in image
            mainProductImage.style.opacity = '1';
            
            // fade in text
            if (featuredProductTitle) featuredProductTitle.style.opacity = '1';
            if (featuredProductDescription) featuredProductDescription.style.opacity = '1';
        }, 200);
        
        // update active class on thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + thumbnails.length) % thumbnails.length;
        updateMainImage(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % thumbnails.length;
        updateMainImage(currentSlide);
    });

    // thumbnail gallery interaction with active class management
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateMainImage(index);
        });
    });
    
    // add transition styles to title and description
    if (featuredProductTitle) {
        featuredProductTitle.style.transition = 'opacity 0.3s ease';
    }
    if (featuredProductDescription) {
        featuredProductDescription.style.transition = 'opacity 0.3s ease';
    }
}



// navigation links functionality - active state is managed by server/page load
// links will navigate to their respective html files

// smooth scroll behavior for internal links (only if they exist)
const internalLinks = document.querySelectorAll('a[href^="#"]');
if (internalLinks.length > 0) {
    internalLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// add animation on scroll for elements (only if they exist)
const animatedElements = document.querySelectorAll('.product-card, .gallery-item');
if (animatedElements.length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // close sidebar on resize to larger screen
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    }, 250);
});

// ===== bottom navigation active state =====
function updateBottomNavActiveState() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            item.classList.add('active');
        }
    });
}

// call on page load
updateBottomNavActiveState();

// ===== animated statistics section =====

// counter animation function
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps approximation
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// statistics section observer
const statsObserverOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

let statsAnimated = false; // prevent multiple animations

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            const statCards = entry.target.querySelectorAll('.stat-card');
            
            statCards.forEach((card) => {
                const delay = parseFloat(card.getAttribute('data-delay')) * 1000;
                const target = parseInt(card.getAttribute('data-target'));
                const numberElement = card.querySelector('.stat-number');
                
                setTimeout(() => {
                    // add slide-up animation
                    card.classList.add('animate');
                    
                    // start counter animation
                    animateCounter(numberElement, target, 1800);
                }, delay);
            });
        }
    });
}, statsObserverOptions);

// observe statistics section
const statisticsSection = document.querySelector('.statistics-section');
if (statisticsSection) {
    statsObserver.observe(statisticsSection);
}

// ===== contact form handling =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // get form values
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const message = document.getElementById('contactMessage').value;
        
        // in production, this data would be sent to a server
        
        // show success message
        alert('Thank you for contacting us! We will get back to you soon.');
        
        // reset form
        contactForm.reset();
    });
}


//flash auto remove
document.addEventListener("DOMContentLoaded", function() {
    const flashMsg = document.getElementById('flash_notif');
    if (flashMsg) {
        setTimeout(function() {
            flashMsg.style.opacity = '0';
            setTimeout(() => flashMsg.remove(), 600); 
        }, 4000);
    }
});