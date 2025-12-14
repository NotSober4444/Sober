// ============ PRODUCTS DATABASE ============
console.log('script.js loaded');
const products = [
    { id: 1, name: 'Cap - SOBER', category: 'accessories', price: 29.99, images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=101'] },
    { id: 2, name: 'Belt - SOBER', category: 'accessories', price: 24.99, images: ['https://picsum.photos/400/300?random=2', 'https://picsum.photos/400/300?random=102'] },
    { id: 3, name: 'Polo Lunga - SOBER', category: 'maglieria', price: 49.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=3', 'https://picsum.photos/400/300?random=103', 'https://picsum.photos/400/300?random=203'] },
    { id: 4, name: 'Longsleeve - SOBER', category: 'maglieria', price: 44.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=4', 'https://picsum.photos/400/300?random=104'] },
    { id: 5, name: 'Felpa Hoodie - SOBER', category: 'hoodies', price: 79.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=5', 'https://picsum.photos/400/300?random=105', 'https://picsum.photos/400/300?random=205'] },
    { id: 6, name: 'Felpa Zip - SOBER', category: 'hoodies', price: 84.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=6', 'https://picsum.photos/400/300?random=106'] },
    { id: 7, name: 'Denim Balloon Pant - SOBER', category: 'pants', price: 99.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=7', 'https://picsum.photos/400/300?random=107', 'https://picsum.photos/400/300?random=207'] },
    { id: 8, name: 'Denim Pant - SOBER', category: 'pants', price: 89.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=8', 'https://picsum.photos/400/300?random=108'] },
    { id: 9, name: 'Detroit Jacket - SOBER', category: 'jackets', price: 129.99, sizes: ['S','M','L'], images: ['https://picsum.photos/400/300?random=9', 'https://picsum.photos/400/300?random=109', 'https://picsum.photos/400/300?random=209'] },
];

let cart = [];

// ============ DOM ELEMENTS ============
const menuToggle = document.getElementById('menu-toggle');
const slideMenu = document.getElementById('slide-menu');
const menuClose = document.getElementById('menu-close');
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close');
const cartItemsDiv = document.getElementById('cart-items');
const totalPriceSpan = document.getElementById('total-price');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// ============ EVENT LISTENERS ============
menuToggle.addEventListener('click', () => {
    slideMenu.classList.add('active');
});

menuClose.addEventListener('click', () => {
    slideMenu.classList.remove('active');
});

// Close menu when clicking on a link and show section only via menu
// Close slide menu when clicking a menu link (links navigate to other pages)
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => slideMenu.classList.remove('active'));
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!slideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        slideMenu.classList.remove('active');
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterProducts(e.target.dataset.filter);
    });
});

cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Checkout: salva carrello e totale e vai a checkout.html
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        localStorage.setItem('soberCart', JSON.stringify(cart));
        localStorage.setItem('soberCartTotal', total.toFixed(2));
        window.location.href = 'checkout.html';
    });
}

// ============ PRODUCT FUNCTIONS ============
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Image (use product.image if available)
        const imgHtml = product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image-img">` : '';

        productCard.innerHTML = `
            <div class="product-image">${imgHtml}</div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-price">€${product.price.toFixed(2)}</p>
            </div>
        `;

        // No "Add to cart" button in gallery - products are view-only
        // Users must open the "Scopri la Collezione" modal to add items to cart

        productGrid.appendChild(productCard);
    });
}

function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// ============ CART FUNCTIONS ============
function addToCart(productId, size = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId && (item.size || null) === (size || null));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: 1
        });
    }

    updateCartCount();
    updateCartDisplay();
    showCartNotification();
}

function removeFromCart(productId, size = null) {
    cart = cart.filter(item => !(item.id === productId && (item.size || null) === (size || null)));
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    const menuCountEl = document.getElementById('cart-count-menu');
    if (menuCountEl) menuCountEl.textContent = count;
}

function updateCartDisplay() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999;">Il carrello è vuoto</p>';
        totalPriceSpan.textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const sizeLabel = item.size ? `Taglia: ${item.size}` : '';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${sizeLabel} • Quantità: ${item.quantity}</p>
                <p class="cart-item-price">€${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-btn">Rimuovi</button>
        `;
        const removeBtn = cartItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => removeFromCart(item.id, item.size));
        cartItemsDiv.appendChild(cartItem);
    });
    
    totalPriceSpan.textContent = total.toFixed(2);
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: #333;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ Prodotto aggiunto al carrello!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============ CONTACT FORM ============
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            const originalBg = submitBtn.style.background;
            submitBtn.textContent = 'Messaggio inviato! ✓';
            submitBtn.style.background = 'var(--accent-color)';
            submitBtn.style.color = '#000';
            setTimeout(() => {
                e.target.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = originalBg;
                submitBtn.style.color = '';
            }, 3000);
        }
    });
}

// ============ NEWSLETTER ============
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        const submitBtn = e.target.querySelector('button');
        if (submitBtn) {
            submitBtn.textContent = 'Iscritto! ✓';
            submitBtn.disabled = true;
            setTimeout(() => {
                emailInput.value = '';
                submitBtn.textContent = 'Iscriviti';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// ============ SMOOTH SCROLL ============
// Smooth scroll for anchors excluding menu-controlled sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('menu-link')) return;
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Panel removed — CTA is a normal link to gallery.html in HTML

// ============ INITIALIZE ============
window.addEventListener('DOMContentLoaded', () => {
    // Render products only where the grid exists (index), avoid errors on other pages
    if (productGrid) {
        renderProducts(products);
    }

    // If page loaded with a hash, show that section
    if (window.location.hash) {
        const id = window.location.hash.slice(1);
        if (id) showSection(id);
    }
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ===== Collection Carousel functionality ===== */
const carousel = document.getElementById('collection-carousel');
if (carousel) {
    const inner = carousel.querySelector('.carousel-inner');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const closeBtn = carousel.querySelector('.carousel-close');
    let current = 0;

    function renderCarousel() {
        inner.innerHTML = '';
        products.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.dataset.index = idx;
            card.innerHTML = `
                <div style="position:relative; margin-bottom:12px;">
                    <img src="${p.images?.[0] || p.image}" alt="${p.name}" class="carousel-img">
                </div>
                <div class="carousel-info">
                    <p class="product-category">${p.category}</p>
                    <h3>${p.name}</h3>
                    <p class="price">€${p.price.toFixed(2)}</p>
                    ${p.sizes && p.sizes.length ? `<select class="size-select-inline">${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}
                    <div style="margin-top:12px;"><button class="add-from-carousel cta-btn">Aggiungi al Carrello</button></div>
                </div>
            `;
            inner.appendChild(card);

            // Click sulla foto principale per aprire il modal dettagli
            const mainImg = card.querySelector('.carousel-img');
            mainImg.style.cursor = 'pointer';
            mainImg.addEventListener('click', () => {
                openProductDetail(idx);
            });
        });
    }

    function updateCarousel() {
        // grid layout - no slide translate needed
    }

    function openCarousel(startIndex=0) {
        current = startIndex || 0;
        renderCarousel();
        carousel.classList.add('open');
        carousel.style.display = 'flex';
    }

    function closeCarousel() {
        carousel.classList.remove('open');
        setTimeout(() => { carousel.style.display = 'none'; }, 240);
    }

    // prev/next not needed for grid view - keep as small navigation for accessibility
    prevBtn.addEventListener('click', () => { /* noop */ });
    nextBtn.addEventListener('click', () => { /* noop */ });
    closeBtn.addEventListener('click', closeCarousel);
    carousel.addEventListener('click', (e) => { if (e.target === carousel) closeCarousel(); });

    // delegate add-from-carousel buttons
    carousel.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-from-carousel')) {
            const card = e.target.closest('.carousel-card');
            const idx = Number(card.dataset.index);
            const product = products[idx];
            const select = card.querySelector('.size-select-inline');
            const size = select ? select.value : null;
            if (product.sizes && product.sizes.length && !size) { alert('Seleziona una taglia'); return; }
            addToCart(product.id, size);
        }
    });

    // bind CTA on home
    const cta = document.getElementById('cta-collection');
    if (cta) { cta.addEventListener('click', (e) => { e.preventDefault(); openCarousel(0); }); }
}

// ============ PRODUCT DETAIL MODAL ============
const productDetailModal = document.getElementById('product-detail-modal');
const productDetailClose = document.querySelector('.product-detail-close');
const productDetailImage = document.getElementById('product-detail-image');
const productDetailImageContainer = document.getElementById('product-detail-image-container');
const productDetailName = document.getElementById('product-detail-name');
const productDetailPrice = document.getElementById('product-detail-price');
const productDetailCounter = document.getElementById('product-detail-counter');
const productDetailCounterBadge = document.getElementById('product-detail-counter-badge');
const productDetailSize = document.getElementById('product-detail-size');
const productDetailAddBtn = document.getElementById('product-detail-add-btn');
const productDetailPrev = document.querySelector('.product-detail-prev');
const productDetailNext = document.querySelector('.product-detail-next');
// Zoom button removed: zoom via image click and mouse wheel only

let currentProductDetail = null;
let currentImageIndex = 0;
let isZoomed = false;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

function openProductDetail(productIdx) {
    const product = products[productIdx];
    currentProductDetail = product;
    currentImageIndex = 0;
    isZoomed = false;
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    
    // Popolare il modal
    productDetailName.textContent = product.name;
    productDetailPrice.textContent = `€${product.price.toFixed(2)}`;
    const imgCount = (product.images || [product.image || '']).length;
    if (productDetailCounter) {
        productDetailCounter.textContent = `Foto 1 di ${imgCount}`;
    }
    if (productDetailCounterBadge) {
        productDetailCounterBadge.textContent = `1 / ${imgCount}`;
    }
    productDetailImage.src = product.images?.[0] || product.image;
    resetImageZoom();
    
    // Mostrare/nascondere select taglia
    if (product.sizes && product.sizes.length) {
        productDetailSize.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        productDetailSize.style.display = 'block';
    } else {
        productDetailSize.style.display = 'none';
    }
    
    productDetailModal.classList.add('active');
}

function closeProductDetail() {
    productDetailModal.classList.remove('active');
    currentProductDetail = null;
    currentImageIndex = 0;
    resetImageZoom();
}

function showProductImage(idx) {
    if (!currentProductDetail) return;
    const images = currentProductDetail.images || [currentProductDetail.image];
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    currentImageIndex = idx;
    productDetailImage.src = images[idx];
    if (productDetailCounter) {
        productDetailCounter.textContent = `Foto ${idx + 1} di ${images.length}`;
    }
    if (productDetailCounterBadge) {
        productDetailCounterBadge.textContent = `${idx + 1} / ${images.length}`;
    }
    resetImageZoom();
}

function toggleZoom() {
    if (isZoomed) {
        resetImageZoom();
    } else {
        zoomLevel = 2;
        isZoomed = true;
        productDetailImage.style.cursor = 'grab';
    }
    updateImageTransform();
}

function resetImageZoom() {
    isZoomed = false;
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    isPanning = false;
    productDetailImage.style.cursor = 'zoom-in';
    updateImageTransform();
}

function updateImageTransform() {
    productDetailImage.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
}

// Event listeners
productDetailClose.addEventListener('click', closeProductDetail);
productDetailPrev.addEventListener('click', () => showProductImage(currentImageIndex - 1));
productDetailNext.addEventListener('click', () => showProductImage(currentImageIndex + 1));
// Zoom button removed

productDetailImage.addEventListener('click', () => {
    if (!isZoomed) toggleZoom();
});

// Zoom con scroll
productDetailImageContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!currentProductDetail) return;
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(1, Math.min(3, zoomLevel + delta));
    
    if (newZoom === 1) {
        resetImageZoom();
    } else {
        isZoomed = true;
        zoomLevel = newZoom;
        productDetailImage.style.cursor = 'grab';
        updateImageTransform();
    }
});

// Pan (drag) quando zoomato
productDetailImage.addEventListener('mousedown', (e) => {
    if (!isZoomed) return;
    isPanning = true;
    panStartX = e.clientX - panX;
    panStartY = e.clientY - panY;
    productDetailImage.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isPanning || !isZoomed) return;
    panX = e.clientX - panStartX;
    panY = e.clientY - panStartY;
    
    // Limiti pan
    const maxPan = 50;
    panX = Math.max(-maxPan, Math.min(maxPan, panX));
    panY = Math.max(-maxPan, Math.min(maxPan, panY));
    
    updateImageTransform();
});

document.addEventListener('mouseup', () => {
    isPanning = false;
    if (isZoomed) {
        productDetailImage.style.cursor = 'grab';
    }
});

productDetailModal.addEventListener('click', (e) => {
    if (e.target === productDetailModal) closeProductDetail();
});

productDetailAddBtn.addEventListener('click', () => {
    if (!currentProductDetail) return;
    const size = currentProductDetail.sizes ? productDetailSize.value : null;
    addToCart(currentProductDetail.id, size);
    closeProductDetail();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!productDetailModal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') showProductImage(currentImageIndex - 1);
    if (e.key === 'ArrowRight') showProductImage(currentImageIndex + 1);
    if (e.key === 'Escape') closeProductDetail();
    if (e.key === 'z' || e.key === 'Z') toggleZoom();
});

// ============ PHOTO LIGHTBOX (gallery + collection) ============
function ensureLightbox() {
    let lightbox = document.getElementById('photo-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'photo-lightbox';
        lightbox.className = 'photo-lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="" id="lightbox-image">
            <p id="lightbox-caption" class="lightbox-caption"></p>
        `;
        document.body.appendChild(lightbox);
    }
    return lightbox;
}

const photoLightbox = ensureLightbox();
const lightboxImage = photoLightbox.querySelector('#lightbox-image');
const lightboxCaption = photoLightbox.querySelector('#lightbox-caption');
const lightboxClose = photoLightbox.querySelector('.lightbox-close');

function openLightbox(src, captionText) {
    lightboxImage.src = src;
    lightboxCaption.textContent = captionText || '';
    photoLightbox.classList.add('active');
}

function closeLightbox() {
    photoLightbox.classList.remove('active');
}

// Click on gallery photo-item
document.addEventListener('click', (e) => {
    const photoItem = e.target.closest('.photo-item');
    if (!photoItem) return;
    const img = photoItem.querySelector('img');
    const caption = photoItem.querySelector('.photo-caption');
    if (img) {
        openLightbox(img.src, caption ? caption.textContent : '');
    }
});

// Removed: lightbox opening on collection carousel images to avoid
// opening another overlay after product detail. Lightbox remains for gallery only.

// Close lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

photoLightbox.addEventListener('click', (e) => {
    if (e.target === photoLightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
