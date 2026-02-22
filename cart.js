// Cart and Wishlist Management for Vestra

// Initialize storage keys
const WISHLIST_KEY = 'vestra_wishlist';
const BAG_KEY = 'vestra_bag';

// Get wishlist from localStorage
function getWishlist() {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistCount();
}

// Get bag from localStorage
function getBag() {
  const bag = localStorage.getItem(BAG_KEY);
  return bag ? JSON.parse(bag) : [];
}

// Save bag to localStorage
function saveBag(bag) {
  localStorage.setItem(BAG_KEY, JSON.stringify(bag));
  updateBagCount();
}

// Add product to wishlist
function addToWishlist(product) {
  const wishlist = getWishlist();
  const exists = wishlist.some(item => item.id === product.id);
  
  if (!exists) {
    wishlist.push(product);
    saveWishlist(wishlist);
    showNotification('Added to Wishlist!');
    return true;
  } else {
    showNotification('Already in Wishlist!');
    return false;
  }
}

// Remove product from wishlist
function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => item.id !== productId);
  saveWishlist(wishlist);
  renderWishlistPage();
}

// Check if product is in wishlist
function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
}

// Add product to bag
function addToBag(product, size = null, color = null) {
  const bag = getBag();
  const existingItem = bag.find(item => item.id === product.id && item.size === size && item.color === color);
  
  if (existingItem) {
    existingItem.quantity += 1;
    showNotification('Added to Bag!');
  } else {
    bag.push({
      ...product,
      size: size,
      color: color,
      quantity: 1
    });
    showNotification('Added to Bag!');
  }
  
  saveBag(bag);
  return true;
}

// Remove product from bag
function removeFromBag(productId, size = null, color = null) {
  let bag = getBag();
  bag = bag.filter(item => !(item.id === productId && item.size === size && item.color === color));
  saveBag(bag);
  renderBagPage();
}

// Update quantity in bag
function updateQuantity(productId, size, color, change) {
  const bag = getBag();
  const item = bag.find(item => item.id === productId && item.size === size && item.color === color);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromBag(productId, size, color);
    } else {
      saveBag(bag);
      renderBagPage();
    }
  }
}

// Get total items in wishlist
function getWishlistCount() {
  return getWishlist().length;
}

// Get total items in bag
function getBagCount() {
  const bag = getBag();
  return bag.reduce((total, item) => total + item.quantity, 0);
}

// Update wishlist count badge
function updateWishlistCount() {
  const count = getWishlistCount();
  const badge = document.getElementById('wishlist-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Update bag count badge
function updateBagCount() {
  const count = getBagCount();
  const badge = document.getElementById('bag-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Get total price in bag
function getBagTotal() {
  const bag = getBag();
  return bag.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'vestra-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Move item from wishlist to bag
function moveToBag(productId) {
  const wishlist = getWishlist();
  const product = wishlist.find(item => item.id === productId);
  
  if (product) {
    addToBag(product);
    removeFromWishlist(productId);
    showNotification('Moved to Bag!');
  }
}

// Render wishlist page
function renderWishlistPage() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;
  
  const wishlist = getWishlist();
  
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-heart"></i>
        <h2>Your Wishlist is Empty</h2>
        <p>Save your favorite items here!</p>
        <a href="index.html" class="btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  container.innerHTML = wishlist.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <button class="remove-wishlist" onclick="removeFromWishlist('${product.id}')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="brand">${product.brand}</p>
        <p class="price">₹${product.price}</p>
        <div class="product-actions">
          <button class="btn-add-bag" onclick="moveToBag('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Move to Bag
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  updateWishlistCount();
}

// Render bag page
function renderBagPage() {
  const container = document.getElementById('bag-items');
  const totalContainer = document.getElementById('bag-total');
  
  if (!container) return;
  
  const bag = getBag();
  
  if (bag.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-bag-shopping"></i>
        <h2>Your Bag is Empty</h2>
        <p>Add items to your bag to get started!</p>
        <a href="index.html" class="btn-primary">Start Shopping</a>
      </div>
    `;
    if (totalContainer) totalContainer.style.display = 'none';
    return;
  }
  
  container.innerHTML = bag.map((item, index) => `
    <div class="bag-item">
      <div class="bag-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="bag-item-details">
        <h3>${item.name}</h3>
        <p class="brand">${item.brand}</p>
        ${item.size ? `<p class="size">Size: ${item.size}</p>` : ''}
        ${item.color ? `<p class="color">Color: ${item.color}</p>` : ''}
        <p class="price">₹${item.price}</p>
      </div>
      <div class="bag-item-actions">
        <div class="quantity-control">
          <button onclick="updateQuantity('${item.id}', '${item.size}', '${item.color}', -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', '${item.size}', '${item.color}', 1)">+</button>
        </div>
        <button class="btn-remove" onclick="removeFromBag('${item.id}', '${item.size}', '${item.color}')">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
      <div class="bag-item-total">
        ₹${item.price * item.quantity}
      </div>
    </div>
  `).join('');
  
  const total = getBagTotal();
  if (totalContainer) {
    totalContainer.style.display = 'block';
    document.getElementById('total-amount').textContent = `₹${total}`;
  }
  
  updateBagCount();
}

// Create product card HTML
function createProductCard(product) {
  const inWishlist = isInWishlist(product.id);
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <button class="btn-wishlist ${inWishlist ? 'active' : ''}" onclick="toggleWishlist(${JSON.stringify(product).replace(/"/g, '"')})">
          <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="brand">${product.brand}</p>
        <p class="price">₹${product.price}</p>
        <button class="btn-add-bag" onclick="addToBagFromCard(${JSON.stringify(product).replace(/"/g, '"')})">
          <i class="fa-solid fa-bag-shopping"></i> Add to Bag
        </button>
      </div>
    </div>
  `;
}

// Toggle wishlist from product card
function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
  } else {
    addToWishlist(product);
  }
}

// Add to bag from product card
function addToBagFromCard(product) {
  addToBag(product);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateWishlistCount();
  updateBagCount();
  
  // Render wishlist page if on wishlist page
  if (document.getElementById('wishlist-items')) {
    renderWishlistPage();
  }
  
  // Render bag page if on bag page
  if (document.getElementById('bag-items')) {
    renderBagPage();
  }
  
  // Listen for storage changes (cross-tab real-time updates)
  window.addEventListener('storage', (e) => {
    if (e.key === WISHLIST_KEY || e.key === BAG_KEY) {
      updateWishlistCount();
      updateBagCount();
      
      // Re-render pages if on wishlist or bag page
      if (document.getElementById('wishlist-items')) {
        renderWishlistPage();
      }
      if (document.getElementById('bag-items')) {
        renderBagPage();
      }
    }
  });
});

// Poll every 500ms for immediate updates on same page
setInterval(() => {
  updateWishlistCount();
  updateBagCount();
}, 500);
