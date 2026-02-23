// Cart and Wishlist Management for Vestra

// Initialize storage keys
const WISHLIST_KEY = 'vestra_wishlist';
const BAG_KEY = 'vestra_bag';

// Store products temporarily for button clicks
let currentProducts = [];

// Get wishlist from localStorage
function getWishlist() {
  const wishlist = localStorage.getItem(WISHLIST_KEY);
  return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistCount();
  updateProductCards();
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
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      discount: product.discount,
      image: product.image,
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
  const badges = document.querySelectorAll('#wishlist-count');
  badges.forEach(badge => {
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

// Update bag count badge
function updateBagCount() {
  const count = getBagCount();
  const badges = document.querySelectorAll('#bag-count');
  badges.forEach(badge => {
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

// Get total price in bag
function getBagTotal() {
  const bag = getBag();
  return bag.reduce((total, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);
    return total + (discountedPrice * item.quantity);
  }, 0);
}

// Show notification
function showNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector('.vestra-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = 'vestra-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
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

// Calculate discounted price
function getDiscountedPrice(price, discount) {
  if (!discount || discount === 0) return price;
  return Math.round(price - (price * discount / 100));
}

// Toggle wishlist - called from button click
function toggleWishlistBtn(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (product) {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  }
}

// Add to bag - called from button click
function addToBagBtn(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (product) {
    addToBag(product);
  }
}

// Update all product cards to reflect wishlist status
function updateProductCards() {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const btn = card.querySelector('.btn-wishlist');
    if (btn && btn.dataset.productId) {
      const productId = btn.dataset.productId;
      if (isInWishlist(productId)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      }
    }
  });
}

// Render wishlist page
function renderWishlistPage() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;
  
  const wishlist = getWishlist();
  
  // Update count display
  const countDisplay = document.getElementById('wishlist-count-display');
  if (countDisplay) {
    countDisplay.textContent = wishlist.length;
  }
  
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
  
  container.innerHTML = wishlist.map(product => {
    const discountedPrice = getDiscountedPrice(product.price, product.discount);
    return `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${product.discount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
          <button class="remove-wishlist" onclick="removeFromWishlist('${product.id}')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="brand">${product.brand}</p>
          <p class="price">
            <span class="discounted-price">₹${discountedPrice}</span>
            ${product.discount ? `<span class="original-price">₹${product.price}</span>` : ''}
          </p>
          <div class="product-actions">
            <button class="btn-add-bag" onclick="moveToBag('${product.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Move to Bag
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  updateWishlistCount();
}

// Render bag page
function renderBagPage() {
  const container = document.getElementById('bag-items');
  const totalContainer = document.getElementById('bag-total');
  
  if (!container) return;
  
  const bag = getBag();
  
  // Update count display
  const countDisplay = document.getElementById('bag-count-display');
  if (countDisplay) {
    countDisplay.textContent = bag.reduce((sum, item) => sum + item.quantity, 0);
  }
  
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
  
  if (totalContainer) totalContainer.style.display = 'block';
  
  container.innerHTML = bag.map((item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);
    const itemSize = item.size || '';
    const itemColor = item.color || '';
    return `
      <div class="bag-item">
        <div class="bag-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="bag-item-details">
          <h3>${item.name}</h3>
          <p class="brand">${item.brand}</p>
          ${itemSize ? `<p class="size">Size: ${itemSize}</p>` : ''}
          ${itemColor ? `<p class="color">Color: ${itemColor}</p>` : ''}
          <p class="price">
            <span class="discounted-price">₹${discountedPrice}</span>
            ${item.discount ? `<span class="original-price">₹${item.price}</span>` : ''}
          </p>
        </div>
        <div class="bag-item-actions">
          <div class="quantity-control">
            <button onclick="updateQuantity('${item.id}', '${itemSize}', '${itemColor}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', '${itemSize}', '${itemColor}', 1)">+</button>
          </div>
          <button class="btn-remove" onclick="removeFromBag('${item.id}', '${itemSize}', '${itemColor}')">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
        <div class="bag-item-total">
          ₹${discountedPrice * item.quantity}
        </div>
      </div>
    `;
  }).join('');
  
  const total = getBagTotal();
  if (totalContainer) {
    const totalAmountEl = document.getElementById('total-amount');
    if (totalAmountEl) {
      totalAmountEl.textContent = `₹${total}`;
    }
    const totalMrpEl = document.getElementById('total-mrp');
    if (totalMrpEl) {
      totalMrpEl.textContent = `₹${total}`;
    }
  }
  
  updateBagCount();
}

// Create product card HTML with simplified click handlers
function createProductCard(product) {
  const inWishlist = isInWishlist(product.id);
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${product.discount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
        <button class="btn-wishlist ${inWishlist ? 'active' : ''}" data-product-id="${product.id}" onclick="toggleWishlistBtn('${product.id}')">
          <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="brand">${product.brand}</p>
        <p class="price">
          <span class="discounted-price">₹${discountedPrice}</span>
          ${product.discount ? `<span class="original-price">₹${product.price}</span>` : ''}
        </p>
        <div class="product-actions">
          <button class="btn-add-bag" onclick="addToBagBtn('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
        </div>
      </div>
    </div>
  `;
}

// Set current products array
function setCurrentProducts(products) {
  currentProducts = products;
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
});
