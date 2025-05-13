/**
 * Home page specific JavaScript
 */

// DOM Elements
const carouselContainer = document.getElementById('featured-products-carousel');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');

// Variables
let featuredProducts = [];
let currentIndex = 0;
const productsPerView = window.innerWidth < 576 ? 1 : 
                        window.innerWidth < 768 ? 2 : 
                        window.innerWidth < 992 ? 3 : 4;

// Functions
async function fetchFeaturedProducts() {
  try {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockProducts = [
      {
        id: 1,
        name: 'Organic Avocados',
        category: 'Fruits',
        price: 3.99,
        unit: 'each',
        image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Organic'
      },
      {
        id: 2,
        name: 'Farm Fresh Eggs',
        category: 'Dairy',
        price: 5.99,
        unit: 'dozen',
        image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Local'
      },
      {
        id: 3,
        name: 'Organic Spinach',
        category: 'Vegetables',
        price: 2.49,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Organic'
      },
      {
        id: 4,
        name: 'Fresh Strawberries',
        category: 'Fruits',
        price: 4.99,
        unit: 'box',
        image: 'https://images.pexels.com/photos/934066/pexels-photo-934066.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'In Season'
      },
      {
        id: 5,
        name: 'Heirloom Tomatoes',
        category: 'Vegetables',
        price: 3.49,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Local'
      },
      {
        id: 6,
        name: 'Raw Honey',
        category: 'Pantry',
        price: 8.99,
        unit: 'jar',
        image: 'https://images.pexels.com/photos/266583/pexels-photo-266583.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Organic'
      },
      {
        id: 7,
        name: 'Artisan Sourdough Bread',
        category: 'Bakery',
        price: 6.99,
        unit: 'loaf',
        image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Fresh'
      },
      {
        id: 8,
        name: 'Fresh Basil',
        category: 'Herbs',
        price: 2.29,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/5503207/pexels-photo-5503207.jpeg?auto=compress&cs=tinysrgb&w=600',
        isFeatured: true,
        badge: 'Local'
      }
    ];
    
    return mockProducts;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

function renderCarousel() {
  if (!carouselContainer) return;
  
  const totalSlides = Math.ceil(featuredProducts.length / productsPerView);
  const maxIndex = totalSlides - 1;
  
  // Create carousel wrapper
  const carouselItemsContainer = document.createElement('div');
  carouselItemsContainer.className = 'carousel-items';
  
  // Add products to carousel
  featuredProducts.forEach(product => {
    const productCard = createProductCard(product);
    carouselItemsContainer.appendChild(productCard);
  });
  
  // Replace loading spinner with carousel
  carouselContainer.innerHTML = '';
  carouselContainer.appendChild(carouselItemsContainer);
  
  // Update navigation buttons state
  updateNavButtons(maxIndex);
  
  // Add event listeners for navigation
  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        slideCarousel();
        updateNavButtons(maxIndex);
      }
    });
    
    nextButton.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        slideCarousel();
        updateNavButtons(maxIndex);
      }
    });
  }
}

function createProductCard(product) {
  const { id, name, category, price, unit, image, badge } = product;
  
  const card = document.createElement('div');
  card.className = 'carousel-item';
  
  card.innerHTML = `
    <div class="product-card">
      <div class="product-image">
        <img src="${image}" alt="${name}">
        ${badge ? `<div class="product-badge">${badge}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${category}</div>
        <h3 class="product-name">${name}</h3>
        <div class="product-price-container">
          <span class="product-price">${formatCurrency(price)}</span>
          <span class="product-unit">/ ${unit}</span>
        </div>
        <button class="btn btn-primary add-to-cart-btn" data-product-id="${id}">
          Add to Cart
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>
    </div>
  `;
  
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  addToCartBtn.addEventListener('click', () => {
    addToCart(product);
  });
  
  return card;
}

function updateNavButtons(maxIndex) {
  if (!prevButton || !nextButton) return;
  
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === maxIndex;
}

function slideCarousel() {
  const carouselItems = carouselContainer.querySelector('.carousel-items');
  if (!carouselItems) return;
  
  const slideAmount = -currentIndex * (100 / productsPerView) * productsPerView;
  carouselItems.style.transform = `translateX(${slideAmount}%)`;
}

function addToCart(product) {
  const cart = getCart();
  
  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // If product exists, increment quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // If product doesn't exist, add it with quantity 1
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  // Save updated cart
  setStorageItem('cart', cart);
  
  // Update cart count
  updateCartCount();
  
  // Show feedback
  showAddToCartFeedback(product.name);
}

function showAddToCartFeedback(productName) {
  // Create a temporary element for feedback
  const feedback = document.createElement('div');
  feedback.className = 'add-to-cart-feedback';
  feedback.textContent = `${productName} added to cart!`;
  
  // Add to body
  document.body.appendChild(feedback);
  
  // Trigger animation
  setTimeout(() => {
    feedback.classList.add('active');
    
    // Remove after animation
    setTimeout(() => {
      feedback.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(feedback);
      }, 300);
    }, 2000);
  }, 10);
}

function handleResize() {
  // Update productsPerView and re-render carousel if needed
  const newProductsPerView = window.innerWidth < 576 ? 1 : 
                           window.innerWidth < 768 ? 2 : 
                           window.innerWidth < 992 ? 3 : 4;
  
  if (newProductsPerView !== productsPerView) {
    // Reset current index and re-render
    currentIndex = 0;
    renderCarousel();
  }
}

// Initialize
async function init() {
  // Fetch products
  featuredProducts = await fetchFeaturedProducts();
  
  // Render carousel
  if (featuredProducts.length > 0) {
    renderCarousel();
  }
  
  // Add resize event listener
  window.addEventListener('resize', debounce(handleResize, 200));
  
  // Add custom styles for cart feedback
  const style = document.createElement('style');
  style.textContent = `
    .add-to-cart-feedback {
      position: fixed;
      bottom: -50px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--color-primary);
      color: white;
      padding: 10px 20px;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
      opacity: 0;
      transition: bottom 0.3s, opacity 0.3s;
      z-index: 9999;
    }
    
    .add-to-cart-feedback.active {
      bottom: 20px;
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);