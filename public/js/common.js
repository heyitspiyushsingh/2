/**
 * Common JavaScript functionality shared across all pages
 */

// Global variables
const API_URL = 'http://localhost:3000/api';
const storagePrefix = 'fresh_market_';

// DOM Elements
const cartCountElements = document.querySelectorAll('.cart-count');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const headerActions = document.querySelector('.header-actions');

// Helper Functions
function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2);
}

function getStorageItem(key) {
  const item = localStorage.getItem(`${storagePrefix}${key}`);
  return item ? JSON.parse(item) : null;
}

function setStorageItem(key, value) {
  localStorage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
}

function getCart() {
  return getStorageItem('cart') || [];
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    element.textContent = count;
    element.style.display = count > 0 ? 'flex' : 'none';
  });
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function showLoadingSpinner(container) {
  container.innerHTML = `
    <div class="spinner"></div>
    <p>Loading...</p>
  `;
}

function handleApiError(error) {
  console.error('API Error:', error);
  return { error: 'An error occurred. Please try again later.' };
}

// Event Listeners
function setupMobileMenu() {
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      headerActions.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
}

// HTTP Request Functions
async function fetchAPI(endpoint, options = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Setup Newsletter Subscription
function setupNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        // In a real implementation, this would send the email to the server
        // For now, we'll just simulate success
        emailInput.value = '';
        alert('Thank you for subscribing to our newsletter!');
      }
    });
  });
}

// Initialize common functionality
function initCommon() {
  updateCartCount();
  setupMobileMenu();
  setupNewsletterForm();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initCommon);