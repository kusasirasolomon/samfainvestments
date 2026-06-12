// ============================================================
// SAMFA INVESTMENTS — main.js  (fully rebuilt)
// ============================================================

// ── CART ─────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('samfa_cart') || '[]');

function saveCart() { localStorage.setItem('samfa_cart', JSON.stringify(cart)); }

window.addToCart = function (product) {
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) { cart[idx].qty++; } else { cart.push({ ...product, qty: 1 }); }
    saveCart();
    updateCartCount();
    showToast(`✓ ${product.name} added to cart`);
    renderCartDrawer();
};

window.removeFromCart = function (id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartCount();
    renderCartDrawer();
};

window.changeQty = function (id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { window.removeFromCart(id); return; }
    saveCart();
    updateCartCount();
    renderCartDrawer();
};

function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = total);
}

// ── WISHLIST ──────────────────────────────────────────────────
let wishlist = JSON.parse(localStorage.getItem('samfa_wishlist') || '[]');

function saveWishlist() { localStorage.setItem('samfa_wishlist', JSON.stringify(wishlist)); }

window.toggleWishlist = function (product) {
    const idx = wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        showToast(`♡ Removed from wishlist`);
    } else {
        wishlist.push(product);
        showToast(`♥ Added to wishlist`);
    }
    saveWishlist();
    // refresh heart icons
    document.querySelectorAll(`[data-wish="${product.id}"]`).forEach(btn => {
        btn.textContent = wishlist.find(i => i.id === product.id) ? '♥' : '♡';
        btn.style.color = wishlist.find(i => i.id === product.id) ? '#e53e3e' : '';
    });
};

function isWishlisted(id) { return !!wishlist.find(i => i.id === id); }

// ── CART DRAWER ───────────────────────────────────────────────
function buildCartDrawer() {
    if (document.getElementById('cartDrawer')) return;

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9000;
        opacity:0;pointer-events:none;transition:opacity 0.3s ease;backdrop-filter:blur(4px)`;
    overlay.onclick = closeCart;
    document.body.appendChild(overlay);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'cartDrawer';
    drawer.style.cssText = `
        position:fixed;top:0;right:0;height:100vh;width:420px;max-width:95vw;
        background:#0D1117;border-left:1px solid rgba(255,255,255,0.1);
        z-index:9001;transform:translateX(100%);transition:transform 0.35s ease;
        display:flex;flex-direction:column;font-family:'Poppins',sans-serif`;
    drawer.innerHTML = `
        <div style="padding:24px 20px;border-bottom:1px solid rgba(255,255,255,0.08);
            display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
            <h2 style="font-size:18px;font-weight:700;color:#E6EDF3">🛒 Your Cart</h2>
            <button onclick="closeCart()" style="background:none;border:none;color:#7D8590;
                font-size:22px;cursor:pointer;line-height:1">×</button>
        </div>
        <div id="cartItems" style="flex:1;overflow-y:auto;padding:16px 20px"></div>
        <div id="cartFooter" style="padding:20px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0"></div>`;
    document.body.appendChild(drawer);
}

function renderCartDrawer() {
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl || !footerEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:#7D8590">
                <div style="font-size:48px;margin-bottom:16px">🛒</div>
                <p style="font-size:15px">Your cart is empty</p>
                <p style="font-size:13px;margin-top:8px">Add some products to get started</p>
            </div>`;
        footerEl.innerHTML = '';
        return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    itemsEl.innerHTML = cart.map(item => `
        <div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <img src="${item.image || 'https://via.placeholder.com/64'}" alt="${item.name}"
                style="width:64px;height:64px;border-radius:10px;object-fit:cover;flex-shrink:0"
                onerror="this.src='https://via.placeholder.com/64'">
            <div style="flex:1;min-width:0">
                <p style="font-size:13px;font-weight:600;color:#E6EDF3;margin-bottom:4px;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}</p>
                <p style="font-size:11px;color:#7D8590;margin-bottom:10px">${item.category}</p>
                <div style="display:flex;align-items:center;justify-content:space-between">
                    <div style="display:flex;align-items:center;gap:8px">
                        <button onclick="changeQty('${item.id}',-1)"
                            style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);
                            background:rgba(255,255,255,0.05);color:#E6EDF3;cursor:pointer;font-size:14px">−</button>
                        <span style="color:#E6EDF3;font-size:13px;font-weight:600;min-width:20px;text-align:center">${item.qty}</span>
                        <button onclick="changeQty('${item.id}',1)"
                            style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);
                            background:rgba(255,255,255,0.05);color:#E6EDF3;cursor:pointer;font-size:14px">+</button>
                    </div>
                    <div style="text-align:right">
                        <p style="color:#C9A84C;font-size:13px;font-weight:700">UGX ${(item.price * item.qty).toLocaleString()}</p>
                        <button onclick="removeFromCart('${item.id}')"
                            style="background:none;border:none;color:#F85149;font-size:11px;
                            cursor:pointer;margin-top:2px">Remove</button>
                    </div>
                </div>
            </div>
        </div>`).join('');

    footerEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="color:#7D8590;font-size:13px">${cart.reduce((s, i) => s + i.qty, 0)} item(s)</span>
            <span style="color:#7D8590;font-size:13px">Subtotal</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:20px">
            <span style="color:#E6EDF3;font-size:18px;font-weight:700">Total</span>
            <span style="color:#C9A84C;font-size:18px;font-weight:700">UGX ${total.toLocaleString()}</span>
        </div>
        <button onclick="openOrderForm()"
            style="width:100%;padding:14px;background:linear-gradient(135deg,#C9A84C,#9E7A30);
            color:#fff;border:none;border-radius:10px;font-family:'Poppins',sans-serif;
            font-size:14px;font-weight:700;cursor:pointer;margin-bottom:10px;
            transition:opacity 0.2s" onmouseover="this.style.opacity=0.9" onmouseout="this.style.opacity=1">
            Place Order →
        </button>
        <button onclick="cart=[];saveCart();updateCartCount();renderCartDrawer()"
            style="width:100%;padding:10px;background:rgba(248,81,73,0.08);color:#F85149;
            border:1px solid rgba(248,81,73,0.2);border-radius:10px;font-family:'Poppins',sans-serif;
            font-size:13px;cursor:pointer">Clear Cart</button>`;
}

window.openCart = function () {
    buildCartDrawer();
    renderCartDrawer();
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    drawer.style.transform = 'translateX(0)';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
};

window.closeCart = function () {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    drawer.style.transform = 'translateX(100%)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    // close order form too
    const of = document.getElementById('orderFormModal');
    if (of) of.remove();
};

// ── ORDER FORM (Web3Forms) ────────────────────────────────────
window.openOrderForm = function () {
    const existing = document.getElementById('orderFormModal');
    if (existing) existing.remove();

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemsList = cart.map(i => `• ${i.name} × ${i.qty} — UGX ${(i.price * i.qty).toLocaleString()}`).join('\n');

    const modal = document.createElement('div');
    modal.id = 'orderFormModal';
    modal.style.cssText = `
        position:fixed;inset:0;z-index:9500;display:flex;align-items:center;
        justify-content:center;padding:16px;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px)`;
    modal.innerHTML = `
        <div style="background:#161B22;border:1px solid rgba(255,255,255,0.08);border-radius:16px;
            padding:36px 32px;width:100%;max-width:500px;max-height:90vh;overflow-y:auto;
            font-family:'Poppins',sans-serif;position:relative">
            <button onclick="document.getElementById('orderFormModal').remove()"
                style="position:absolute;top:16px;right:20px;background:none;border:none;
                color:#7D8590;font-size:22px;cursor:pointer">×</button>

            <h2 style="font-size:20px;font-weight:700;color:#E6EDF3;margin-bottom:6px">Place Your Order</h2>
            <p style="color:#7D8590;font-size:13px;margin-bottom:24px">We'll contact you to confirm and arrange delivery.</p>

            <!-- Order summary -->
            <div style="background:#1C2128;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
                padding:14px 16px;margin-bottom:24px;font-size:12px;color:#7D8590;white-space:pre-line">${itemsList}
<span style="color:#C9A84C;font-weight:700;font-size:13px">Total: UGX ${total.toLocaleString()}</span></div>

            <form id="orderForm" onsubmit="submitOrder(event)">
                <!-- Web3Forms access key — replace with your own from web3forms.com -->
                <input type="hidden" name="access_key" value="a646e374-04cb-47c4-b7e5-4822f574dfe1">
                <input type="hidden" name="subject" value="New Order — Samfa Investments">
                <input type="hidden" name="order_details" value="${itemsList.replace(/"/g, '&quot;')}">
                <input type="hidden" name="order_total" value="UGX ${total.toLocaleString()}">
                <input type="hidden" name="from_name" value="Samfa Investments Website">

                <div style="margin-bottom:16px">
                    <label style="display:block;font-size:11px;font-weight:600;letter-spacing:1px;
                        text-transform:uppercase;color:#7D8590;margin-bottom:8px">Full Name *</label>
                    <input type="text" name="name" required placeholder="Your full name"
                        style="width:100%;padding:11px 14px;background:#1C2128;border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px;color:#E6EDF3;font-family:'Poppins',sans-serif;font-size:13px;outline:none"
                        onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
                </div>
                <div style="margin-bottom:16px">
                    <label style="display:block;font-size:11px;font-weight:600;letter-spacing:1px;
                        text-transform:uppercase;color:#7D8590;margin-bottom:8px">Phone Number *</label>
                    <input type="tel" name="phone" required placeholder="+256 700 000 000"
                        style="width:100%;padding:11px 14px;background:#1C2128;border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px;color:#E6EDF3;font-family:'Poppins',sans-serif;font-size:13px;outline:none"
                        onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
                </div>
                <div style="margin-bottom:16px">
                    <label style="display:block;font-size:11px;font-weight:600;letter-spacing:1px;
                        text-transform:uppercase;color:#7D8590;margin-bottom:8px">Email Address</label>
                    <input type="email" name="email" placeholder="your@email.com"
                        style="width:100%;padding:11px 14px;background:#1C2128;border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px;color:#E6EDF3;font-family:'Poppins',sans-serif;font-size:13px;outline:none"
                        onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
                </div>
                <div style="margin-bottom:16px">
                    <label style="display:block;font-size:11px;font-weight:600;letter-spacing:1px;
                        text-transform:uppercase;color:#7D8590;margin-bottom:8px">Delivery Address *</label>
                    <input type="text" name="address" required placeholder="Town / district / street"
                        style="width:100%;padding:11px 14px;background:#1C2128;border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px;color:#E6EDF3;font-family:'Poppins',sans-serif;font-size:13px;outline:none"
                        onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
                </div>
                <div style="margin-bottom:24px">
                    <label style="display:block;font-size:11px;font-weight:600;letter-spacing:1px;
                        text-transform:uppercase;color:#7D8590;margin-bottom:8px">Additional Notes</label>
                    <textarea name="message" rows="3" placeholder="Any special instructions..."
                        style="width:100%;padding:11px 14px;background:#1C2128;border:1px solid rgba(255,255,255,0.08);
                        border-radius:8px;color:#E6EDF3;font-family:'Poppins',sans-serif;font-size:13px;
                        outline:none;resize:none"
                        onfocus="this.style.borderColor='#C9A84C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'"></textarea>
                </div>

                <!-- Honeypot -->
                <input type="checkbox" name="botcheck" style="display:none">

                <button type="submit" id="orderSubmitBtn"
                    style="width:100%;padding:14px;background:linear-gradient(135deg,#C9A84C,#9E7A30);
                    color:#fff;border:none;border-radius:10px;font-family:'Poppins',sans-serif;
                    font-size:14px;font-weight:700;cursor:pointer">
                    Submit Order →
                </button>
                <p style="text-align:center;font-size:11px;color:#7D8590;margin-top:12px">
                    We'll confirm via WhatsApp or call within 24 hours.
                </p>
            </form>
        </div>`;

    // Close on overlay click
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
};

window.submitOrder = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('orderSubmitBtn');
    const form = document.getElementById('orderForm');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const data = Object.fromEntries(new FormData(form));
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (json.success) {
            form.innerHTML = `
                <div style="text-align:center;padding:40px 0">
                    <div style="font-size:56px;margin-bottom:16px">✅</div>
                    <h3 style="color:#E6EDF3;font-size:18px;margin-bottom:10px">Order Received!</h3>
                    <p style="color:#7D8590;font-size:13px;line-height:1.7">
                        Thank you! We've received your order and will contact you within 24 hours to confirm and arrange delivery.
                    </p>
                    <button onclick="document.getElementById('orderFormModal').remove();closeCart();cart=[];saveCart();updateCartCount();"
                        style="margin-top:24px;padding:12px 28px;background:linear-gradient(135deg,#C9A84C,#9E7A30);
                        color:#fff;border:none;border-radius:10px;font-family:'Poppins',sans-serif;
                        font-size:14px;font-weight:600;cursor:pointer">Done</button>
                </div>`;
        } else {
            throw new Error(json.message || 'Submission failed');
        }
    } catch (err) {
        showToast('❌ Failed to send order. Please call us directly.', 'error');
        btn.disabled = false;
        btn.textContent = 'Submit Order →';
    }
};

// ── QUICK VIEW ────────────────────────────────────────────────
window.quickView = function (id) {
    // find product from whichever array is available
    const allProds = window._samfaProducts || [];
    const p = allProds.find(x => x.id === id);
    if (!p) return;

    const existing = document.getElementById('quickViewModal');
    if (existing) existing.remove();

    const wishlisted = isWishlisted(id);

    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.style.cssText = `
        position:fixed;inset:0;z-index:9400;display:flex;align-items:center;
        justify-content:center;padding:16px;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px)`;
    modal.innerHTML = `
        <div style="background:#161B22;border:1px solid rgba(255,255,255,0.08);border-radius:16px;
            width:100%;max-width:640px;overflow:hidden;font-family:'Poppins',sans-serif;position:relative;
            display:flex;flex-wrap:wrap">
            <button onclick="document.getElementById('quickViewModal').remove()"
                style="position:absolute;top:14px;right:16px;background:rgba(255,255,255,0.08);
                border:none;color:#E6EDF3;width:30px;height:30px;border-radius:50%;
                cursor:pointer;font-size:16px;z-index:1">×</button>
            <div style="width:260px;min-height:280px;flex-shrink:0;background:#1C2128;position:relative">
                <img src="${p.image || 'https://via.placeholder.com/260'}" alt="${p.name}"
                    style="width:100%;height:100%;min-height:280px;object-fit:cover"
                    onerror="this.src='https://via.placeholder.com/260'">
                ${p.badge ? `<span style="position:absolute;top:14px;left:14px;background:linear-gradient(135deg,#C9A84C,#9E7A30);
                    color:#fff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">${p.badge}</span>` : ''}
            </div>
            <div style="flex:1;min-width:260px;padding:28px 24px">
                <p style="font-size:11px;color:#C9A84C;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px">${p.category}</p>
                <h2 style="font-size:18px;font-weight:700;color:#E6EDF3;margin-bottom:12px;line-height:1.4">${p.name}</h2>
                ${p.description ? `<p style="font-size:13px;color:#7D8590;line-height:1.7;margin-bottom:16px">${p.description}</p>` : ''}
                <p style="font-size:24px;font-weight:800;color:#C9A84C;margin-bottom:24px">UGX ${Number(p.price).toLocaleString()}</p>
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                    <button onclick='addToCart(${JSON.stringify(p)});document.getElementById("quickViewModal").remove()'
                        style="flex:1;padding:12px 20px;background:linear-gradient(135deg,#C9A84C,#9E7A30);
                        color:#fff;border:none;border-radius:10px;font-family:'Poppins',sans-serif;
                        font-size:13px;font-weight:700;cursor:pointer;min-width:140px">
                        Add to Cart
                    </button>
                    <button data-wish="${p.id}" onclick='toggleWishlist(${JSON.stringify(p)})'
                        style="padding:12px 16px;background:rgba(255,255,255,0.05);
                        border:1px solid rgba(255,255,255,0.1);border-radius:10px;
                        color:${wishlisted ? '#e53e3e' : '#7D8590'};font-size:18px;cursor:pointer">
                        ${wishlisted ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
};

// ── TOAST ─────────────────────────────────────────────────────
let toastTimer;
window.showToast = function (msg, type = 'success') {
    let t = document.getElementById('samfa-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'samfa-toast';
        t.style.cssText = `
            position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);
            background:#161B22;border:1px solid rgba(255,255,255,0.1);border-left:4px solid #C9A84C;
            padding:14px 22px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:13px;
            color:#E6EDF3;z-index:99999;opacity:0;transition:all 0.3s ease;
            box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;pointer-events:none`;
        document.body.appendChild(t);
    }
    t.style.borderLeftColor = type === 'error' ? '#F85149' : '#C9A84C';
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(20px)';
    }, 3200);
};
// alias
window.showToast = window.showToast;

// ── FORMAT PRICE ──────────────────────────────────────────────
window.formatPrice = function (n) { return 'UGX ' + Number(n).toLocaleString('en-UG'); };

// ── BUILD PRODUCT CARD ────────────────────────────────────────
window.buildProductCard = function (p) {
    const wishlisted = isWishlisted(p.id);
    return `
    <div class="product-card reveal" data-category="${p.category}" data-price="${p.price}" data-id="${p.id}">
        <div class="product-img-wrap">
            <img src="${p.image || 'https://via.placeholder.com/400'}" alt="${p.name}" loading="lazy"
                onerror="this.src='https://via.placeholder.com/400'">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            <div class="product-actions">
                <button class="action-btn" data-wish="${p.id}"
                    onclick='toggleWishlist(${JSON.stringify(p)})'
                    title="Wishlist" style="color:${wishlisted ? '#e53e3e' : ''}">
                    ${wishlisted ? '♥' : '♡'}
                </button>
                <button class="action-btn" title="Quick View"
                    onclick="quickView('${p.id}')">👁</button>
            </div>
        </div>
        <div class="product-body">
            <p class="product-cat">${p.category}</p>
            <h3 class="product-name">${p.name}</h3>
            ${p.description ? `<p class="product-desc" style="font-size:12px;color:#7D8590;margin:4px 0 8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.description}</p>` : ''}
            <div class="product-footer">
                <div class="product-price"><span class="currency">UGX</span>${Number(p.price).toLocaleString()}</div>
                <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(p)})' title="Add to Cart">+</button>
            </div>
        </div>
    </div>`;
};

// ── CATEGORY FILTER ───────────────────────────────────────────
window.selectCat = function (cat) {
    window._activeCat = cat;

    // Update button states
    document.querySelectorAll('[data-cat-btn]').forEach(btn => {
        const isActive = btn.dataset.catBtn === cat;
        btn.style.background = isActive ? 'linear-gradient(135deg,#C9A84C,#9E7A30)' : 'rgba(255,255,255,0.05)';
        btn.style.color = isActive ? '#fff' : '#7D8590';
        btn.style.borderColor = isActive ? 'transparent' : 'rgba(255,255,255,0.1)';
    });

    // Filter cards
    document.querySelectorAll('.product-card').forEach(card => {
        const show = (cat === 'All') || (card.dataset.category === cat);
        card.style.display = show ? '' : 'none';
    });

    // If a renderProductsTable function exists (products.html), call it
    if (window._samfaRenderFiltered) window._samfaRenderFiltered(cat);
};

// ── INTERSECTION OBSERVER (fade-in) ──────────────────────────
window.initObserver = function () {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
};

// ── NAVBAR ────────────────────────────────────────────────────
function buildNavbar() {
    const el = document.getElementById('navbar');
    if (!el) return;
    el.innerHTML = `
    <div class="container nav-inner">
        <a href="index.html" class="nav-logo">
           
            <img src="https://res.cloudinary.com/dupeojmpy/image/upload/v1781089711/logosamfa_ngyk9g.png" alt="Samfa Investments Logo" class="logo-icon">
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
            <a href="stationery.html">Stationery</a>
            <a href="salon.html">Salon</a>
        </nav>
        <div class="nav-actions">
            <button class="cart-btn" onclick="openCart()" title="Cart" aria-label="Open cart">
                🛒 <span class="cart-count">0</span>
            </button>
            <a href="contact.html" class="btn btn-gold btn-sm">Get Quote</a>
        </div>
        <div class="nav-hamburger" id="ham" aria-label="Menu">
            <span></span><span></span><span></span>
        </div>
    </div>
    <div class="nav-mobile-menu" id="mobileMenu"></div>`;

    // Mobile menu
    const ham = document.getElementById('ham');
    const mm = document.getElementById('mobileMenu');
    if (ham && mm) {
        mm.style.cssText = `
            display:none;position:fixed;top:70px;left:0;right:0;
            background:rgba(10,10,10,0.97);padding:16px 24px;z-index:999;
            flex-direction:column;gap:0;border-bottom:1px solid rgba(201,168,76,0.2)`;
        const links = [
            ['index.html', 'Home'], ['products.html', 'Products'],
            ['services.html', 'Services'], ['about.html', 'About'], ['contact.html', 'Contact'], ['stationery.html', 'Stationery'], ['salon.html', 'Salon']
        ];
        mm.innerHTML = links.map(([href, label]) =>
            `<a href="${href}" style="color:#E6EDF3;font-size:15px;padding:14px 0;
            border-bottom:1px solid rgba(255,255,255,0.06);display:block;font-family:'Poppins',sans-serif">${label}</a>`
        ).join('') + `<a href="contact.html" style="display:block;margin:16px 0;padding:12px;
            background:linear-gradient(135deg,#C9A84C,#9E7A30);color:#fff;text-align:center;
            border-radius:8px;font-family:'Poppins',sans-serif;font-weight:600;font-size:14px">Get a Quote</a>`;

        ham.addEventListener('click', () => {
            const open = mm.style.display === 'flex';
            mm.style.display = open ? 'none' : 'flex';
        });

        // Close on link click
        mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mm.style.display = 'none';
        }));
    }

    // Scroll effect
    const update = () => el.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', update, { passive: true });
    update();

    // Active link highlight
    const page = location.pathname.split('/').pop() || 'index.html';
    el.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === page) a.classList.add('active');
    });
}

// ── FOOTER ────────────────────────────────────────────────────
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
                <p class="footer-desc">Your trusted partner for premium office supplies, stationery,
                catering, agro products, electronics, and cosmology solutions across Uganda.</p>
                <div class="footer-social">
                    <a class="social-link" href="#" aria-label="Facebook">f</a>
                    <a class="social-link" href="#" aria-label="Twitter">𝕏</a>
                    <a class="social-link" href="#" aria-label="Instagram">📷</a>
                    <a class="social-link" href="#" aria-label="WhatsApp"
                        onclick="window.open('https://wa.me/256700000000','_blank')">📱</a>
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

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    buildNavbar();
    buildFooter();
    updateCartCount();
    setTimeout(window.initObserver, 100);
});




