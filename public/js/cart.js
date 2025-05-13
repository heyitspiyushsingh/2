/**
 * Cart page specific JavaScript
 */

// DOM Elements
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptySection = document.querySelector('.cart-empty');
const cartContentSection = document.querySelector('.cart-content');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const applyCouponBtn = document.getElementById('apply-coupon');
const couponInput = document.getElementById('coupon-input');

// Checkout Modal Elements
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelCheckoutBtn = document.getElementById('cancel-checkout');
const placeOrderBtn = document.getElementById('place-order');
const modalSubtotalEl = document.getElementById('modal-subtotal');
const modalTaxEl = document.getElementById('modal-tax');
const modalTotalEl = document.getElementById('modal-total');

// Order Success Elements
const orderSuccessModal = document.getElementById('order-success');
const continueAfterOrderBtn = document.getElementById('continue-after-order');
const orderNumberEl = document.getElementById('order-number');

// Item Template
const cartItemTemplate = document.getElementById('cart-item-template');

// Variables
const shippingFee = 5.99;
const taxRate = 0.08; // 8% tax
let cart = [];
let orderTotal = 0;
let subtotal = 0;
let tax = 0;
let appliedCoupon = null;

// Functions
function loadCart() {
  cart = getCart();
  
  if (cart.length === 0) {
    showEmptyCart();
    return;
  }
  
  showCartContent();
  renderCartItems();
  calculateTotals();
}

function showEmptyCart() {
  cartEmptySection.classList.remove('hidden');
  cartContentSection.classList.add('hidden');
}

function showCartContent() {
  cartEmptySection.classList.add('hidden');
  cartContentSection.classList.remove('hidden');
}

function renderCartItems() {
  if (!cartItemsContainer) return;
  
  // Clear the container
  cartItemsContainer.innerHTML = '';
  
  // Add each cart item to the container
  cart.forEach(item => {
    const cartItemElement = createCartItemElement(item);
    cartItemsContainer.appendChild(cartItemElement);
  });
}

function createCartItemElement(item) {
  if (!cartItemTemplate) return document.createElement('div');
  
  // Clone the template
  const template = cartItemTemplate.content.cloneNode(true);
  const cartItem = template.querySelector('.cart-item');
  
  // Set item data
  const { id, name, category, price, image, quantity } = item;
  
  const imgElement = cartItem.querySelector('.item-image img');
  imgElement.src = image;
  imgElement.alt = name;
  
  cartItem.querySelector('.item-name').textContent = name;
  cartItem.querySelector('.item-category').textContent = category;
  cartItem.querySelector('.item-price').textContent = formatCurrency(price);
  
  const quantityInput = cartItem.querySelector('.quantity-input');
  quantityInput.value = quantity;
  quantityInput.dataset.id = id;
  
  const decreaseBtn = cartItem.querySelector('.quantity-decrease');
  decreaseBtn.dataset.id = id;
  decreaseBtn.addEventListener('click', () => {
    updateItemQuantity(id, Math.max(1, quantity - 1));
  });
  
  const increaseBtn = cartItem.querySelector('.quantity-increase');
  increaseBtn.dataset.id = id;
  increaseBtn.addEventListener('click', () => {
    updateItemQuantity(id, quantity + 1);
  });
  
  quantityInput.addEventListener('change', () => {
    const newQty = parseInt(quantityInput.value);
    if (newQty > 0) {
      updateItemQuantity(id, newQty);
    } else {
      quantityInput.value = quantity;
    }
  });
  
  const totalPrice = price * quantity;
  cartItem.querySelector('.item-total').textContent = formatCurrency(totalPrice);
  
  const removeBtn = cartItem.querySelector('.remove-item');
  removeBtn.dataset.id = id;
  removeBtn.addEventListener('click', () => {
    removeCartItem(id);
  });
  
  return cartItem;
}

function calculateTotals() {
  // Calculate subtotal
  subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax
  tax = subtotal * taxRate;
  
  // Apply coupon if any
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = subtotal * (appliedCoupon.value / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }
  
  // Calculate final total
  orderTotal = subtotal + tax + shippingFee - discount;
  
  // Update DOM
  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(orderTotal);
  
  // Update modal totals
  if (modalSubtotalEl) modalSubtotalEl.textContent = formatCurrency(subtotal);
  if (modalTaxEl) modalTaxEl.textContent = formatCurrency(tax);
  if (modalTotalEl) modalTotalEl.textContent = formatCurrency(orderTotal);
}

function updateItemQuantity(id, newQuantity) {
  // Find the item in the cart
  const itemIndex = cart.findIndex(item => item.id === id);
  
  if (itemIndex !== -1) {
    // Update quantity
    cart[itemIndex].quantity = newQuantity;
    
    // Save updated cart
    setStorageItem('cart', cart);
    
    // Update cart count
    updateCartCount();
    
    // Re-render cart items
    renderCartItems();
    
    // Recalculate totals
    calculateTotals();
  }
}

function removeCartItem(id) {
  // Filter out the item from the cart
  cart = cart.filter(item => item.id !== id);
  
  // Save updated cart
  setStorageItem('cart', cart);
  
  // Update cart count
  updateCartCount();
  
  // Check if cart is empty
  if (cart.length === 0) {
    showEmptyCart();
    return;
  }
  
  // Re-render cart items
  renderCartItems();
  
  // Recalculate totals
  calculateTotals();
}

function applyCoupon() {
  const couponCode = couponInput.value.trim().toUpperCase();
  
  if (!couponCode) {
    showCouponMessage('Please enter a coupon code', 'error');
    return;
  }
  
  // In a real app, this would validate against the server
  // For now, we'll just use a few mock coupons
  const mockCoupons = {
    'FRESH10': { type: 'percentage', value: 10 },
    'WELCOME15': { type: 'percentage', value: 15 },
    'FREESHIP': { type: 'fixed', value: shippingFee }
  };
  
  if (mockCoupons[couponCode]) {
    appliedCoupon = mockCoupons[couponCode];
    showCouponMessage(`Coupon applied: ${couponDisplayText(appliedCoupon)}`, 'success');
    calculateTotals();
  } else {
    showCouponMessage('Invalid coupon code', 'error');
  }
}

function couponDisplayText(coupon) {
  if (coupon.type === 'percentage') {
    return `${coupon.value}% off`;
  } else {
    return `$${coupon.value.toFixed(2)} off`;
  }
}

function showCouponMessage(message, type) {
  // Create or get message element
  let messageEl = document.querySelector('.coupon-message');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'coupon-message';
    couponInput.parentNode.appendChild(messageEl);
  }
  
  // Set message and class
  messageEl.textContent = message;
  messageEl.className = `coupon-message ${type}`;
  
  // Add styles if not already added
  if (!document.querySelector('#coupon-message-styles')) {
    const style = document.createElement('style');
    style.id = 'coupon-message-styles';
    style.textContent = `
      .coupon-message {
        font-size: 0.875rem;
        margin-top: 5px;
      }
      .coupon-message.error {
        color: var(--color-error);
      }
      .coupon-message.success {
        color: var(--color-success);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Automatically hide after 3 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 3000);
}

function openCheckoutModal() {
  if (checkoutModal) {
    checkoutModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  if (checkoutModal) {
    checkoutModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function placeOrder() {
  // In a real app, this would send the order to the server
  // For now, we'll just simulate success
  
  // Generate a random order number
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  if (orderNumberEl) {
    orderNumberEl.textContent = `#${orderNumber}`;
  }
  
  // Close checkout modal
  closeCheckoutModal();
  
  // Show success modal
  if (orderSuccessModal) {
    orderSuccessModal.classList.remove('hidden');
  }
  
  // Clear cart
  cart = [];
  setStorageItem('cart', cart);
  updateCartCount();
}

function completeOrder() {
  // Close success modal
  if (orderSuccessModal) {
    orderSuccessModal.classList.add('hidden');
  }
  
  // Reset body overflow
  document.body.style.overflow = '';
  
  // Redirect to home
  window.location.href = '/';
}

// Event Listeners
function setupEventListeners() {
  // Apply coupon
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', applyCoupon);
  }
  
  if (couponInput) {
    couponInput.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        applyCoupon();
      }
    });
  }
  
  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openCheckoutModal);
  }
  
  // Close modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCheckoutModal);
  }
  
  if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);
  }
  
  // Place order
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
  }
  
  // Continue shopping after order
  if (continueAfterOrderBtn) {
    continueAfterOrderBtn.addEventListener('click', completeOrder);
  }
}

// Initialize
function init() {
  loadCart();
  setupEventListeners();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);