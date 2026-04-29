// ============================================================
// SAMFA - Shared JS (nav, cart, toast, animations)
// ============================================================

// ---- CART ----
let cart = JSON.parse(localStorage.getItem('samfa_cart') || '[]');

function saveCart() { localStorage.setItem('samfa_cart', JSON.stringify(cart)); }

function addToCart(product) {
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) { cart[idx].qty++; } else { cart.push({ ...product, qty: 1 }); }
    saveCart();
    updateCartCount();
    showToast(`✓ ${product.name} added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart(); updateCartCount();
}

function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

// ---- TOAST ----
let toastTimer;
function showToast(msg, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- NAVBAR SCROLL ----
function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', update);
    update();

    // Hamburger
    const ham = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-mobile-menu');
    if (ham && links) ham.addEventListener('click', () => links.classList.toggle('open'));

    // Active link
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === page) a.classList.add('active');
    });
}

// ---- INTERSECTION OBSERVER (fade-in) ----
function initObserver() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ---- FORMAT PRICE ----
function formatPrice(n) {
    return 'UGX ' + Number(n).toLocaleString('en-UG');
}

// ---- BUILD PRODUCT CARD ----
function buildProductCard(p) {
    return `
    <div class="product-card reveal" data-category="${p.category}" data-price="${p.price}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn" title="Wishlist">♡</button>
          <button class="action-btn" title="Quick View" onclick="quickView('${p.id}')">👁</button>
        </div>
      </div>
      <div class="product-body">
        <p class="product-cat">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-footer">
          <div class="product-price"><span class="currency">UGX</span>${Number(p.price).toLocaleString()}</div>
          <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(p)})' title="Add to Cart">+</button>
        </div>
      </div>
    </div>`;
}

// ---- BUILD FOOTER ----
function buildFooter() {
    const el = document.getElementById('footer');
    if (!el) return;
    el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="nav-logo footer-brand">
            <div class="logo-icon">💼</div>
            <div class="logo-text">
              <strong>Samfa Investments</strong>
              <span>Limited</span>
            </div>
          </div>
          <p class="footer-desc">Your trusted partner for premium office supplies, stationery, catering, agro products, electronics, and cosmology solutions across Uganda and beyond.</p>
          <div class="footer-social">
            <a class="social-link" href="#" aria-label="Facebook">f</a>
            <a class="social-link" href="#" aria-label="Twitter">𝕏</a>
            <a class="social-link" href="#" aria-label="Instagram">📷</a>
            <a class="social-link" href="#" aria-label="WhatsApp">📱</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="products.html?cat=Stationery">Stationery</a></li>
            <li><a href="products.html?cat=Office Supplies">Office Supplies</a></li>
            <li><a href="products.html?cat=Catering Services">Catering</a></li>
            <li><a href="products.html?cat=Agro Products">Agro Products</a></li>
            <li><a href="products.html?cat=Electronics & Electrical">Electronics</a></li>
            <li><a href="products.html?cat=Cosmology">Cosmology</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <div class="footer-contact-item"><span class="icon">📍</span><p>P.O Box 100546, Iganga, Uganda</p></div>
          <div class="footer-contact-item"><span class="icon">✉️</span><p>samfainvestmentsltd@gmail.com</p></div>
          <div class="footer-contact-item"><span class="icon">🕐</span><p>Mon–Sat: 8:00 AM – 6:00 PM</p></div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} Samfa Investments Limited. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>`;
}

// ---- BUILD NAVBAR ----
function buildNavbar() {
    const el = document.getElementById('navbar');
    if (!el) return;
    el.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="nav-logo">
        <div class="logo-icon">💼</div>
        <div class="logo-text">
          <strong>Samfa Investments</strong>
          <span>Limited</span>
        </div>
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="services.html">Services</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="nav-actions">
        <button class="cart-btn" onclick="location.href='products.html'" title="Cart">
          🛒
          <span class="cart-count">0</span>
        </button>
        <a href="contact.html" class="btn btn-gold btn-sm">Get Quote</a>
      </div>
      <div class="nav-hamburger" id="ham">
        <span></span><span></span><span></span>
      </div>
    </div>
    <div class="nav-mobile-menu" id="mobileMenu" style="display:none"></div>`;

    // Mobile menu
    const ham = document.getElementById('ham');
    const mm = document.getElementById('mobileMenu');
    if (ham && mm) {
        mm.style.cssText = 'position:fixed;top:70px;left:0;right:0;background:rgba(10,10,10,0.97);padding:24px;z-index:999;flex-direction:column;gap:16px;border-bottom:1px solid rgba(201,168,76,0.2);';
        mm.innerHTML = `
      <a href="index.html" style="color:#fff;font-size:15px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08)">Home</a>
      <a href="products.html" style="color:#fff;font-size:15px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08)">Products</a>
      <a href="services.html" style="color:#fff;font-size:15px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08)">Services</a>
      <a href="about.html" style="color:#fff;font-size:15px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08)">About</a>
      <a href="contact.html" style="color:#fff;font-size:15px;padding:12px 0">Contact</a>`;
        ham.addEventListener('click', () => {
            const open = mm.style.display === 'flex';
            mm.style.display = open ? 'none' : 'flex';
        });
    }
}

// ---- INIT ON DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
    buildNavbar();
    buildFooter();
    initNavbar();
    updateCartCount();
    setTimeout(initObserver, 100);
});