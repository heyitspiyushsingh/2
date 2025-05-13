/**
 * Marketplace page specific JavaScript
 */

// DOM Elements
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sortSelect = document.getElementById('sort-select');
const categoryFilters = document.querySelectorAll('.category-filter');
const dietaryFilters = document.querySelectorAll('.dietary-filter');
const priceSlider = document.getElementById('price-slider');
const priceValue = document.getElementById('price-value');
const resetFiltersButton = document.getElementById('reset-filters');
const paginationPrev = document.querySelector('.pagination-prev');
const paginationNext = document.querySelector('.pagination-next');
const paginationNumbers = document.querySelector('.pagination-numbers');

// Mobile Elements
const filterToggle = document.querySelector('.filter-toggle');
const mobileFilters = document.getElementById('mobile-filters');
const closeFilters = document.querySelector('.close-filters');
const categoryFiltersMobile = document.querySelectorAll('.category-filter-mobile');
const dietaryFiltersMobile = document.querySelectorAll('.dietary-filter-mobile');
const priceSliderMobile = document.getElementById('price-slider-mobile');
const priceValueMobile = document.getElementById('price-value-mobile');
const resetFiltersMobile = document.getElementById('reset-filters-mobile');
const applyFiltersMobile = document.getElementById('apply-filters-mobile');

// Variables
let allProducts = [];
let filteredProducts = [];
const productsPerPage = 12;
let currentPage = 1;
let totalPages = 1;

// Filter State
const filters = {
  search: '',
  categories: [],
  dietary: [],
  maxPrice: 100,
  sort: 'default'
};

// Product Template
const productTemplate = document.getElementById('product-template');

// Functions
async function fetchProducts() {
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
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 2,
        name: 'Farm Fresh Eggs',
        category: 'Dairy',
        price: 5.99,
        unit: 'dozen',
        image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: [],
        badge: 'Local'
      },
      {
        id: 3,
        name: 'Organic Spinach',
        category: 'Vegetables',
        price: 2.49,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 4,
        name: 'Fresh Strawberries',
        category: 'Fruits',
        price: 4.99,
        unit: 'box',
        image: 'https://images.pexels.com/photos/934066/pexels-photo-934066.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['vegan', 'gluten-free'],
        badge: 'In Season'
      },
      {
        id: 5,
        name: 'Heirloom Tomatoes',
        category: 'Vegetables',
        price: 3.49,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['vegan', 'gluten-free'],
        badge: 'Local'
      },
      {
        id: 6,
        name: 'Raw Honey',
        category: 'Pantry',
        price: 8.99,
        unit: 'jar',
        image: 'https://images.pexels.com/photos/6422025/pexels-photo-6422025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        dietary: ['organic', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 7,
        name: 'Artisan Sourdough Bread',
        category: 'Bakery',
        price: 6.99,
        unit: 'loaf',
        image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['vegan'],
        badge: 'Fresh'
      },
      {
        id: 8,
        name: 'Fresh Basil',
        category: 'Herbs',
        price: 2.29,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/1087902/pexels-photo-1087902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Local'
      },
      {
        id: 9,
        name: 'Grass-Fed Ground Beef',
        category: 'Meat',
        price: 7.99,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['gluten-free'],
        badge: 'Grass-Fed'
      },
      {
        id: 10,
        name: 'Organic Blueberries',
        category: 'Fruits',
        price: 4.49,
        unit: 'pint',
        image: 'https://images.pexels.com/photos/87818/pexels-photo-87818.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 11,
        name: 'Artisan Goat Cheese',
        category: 'Dairy',
        price: 6.49,
        unit: 'pack',
        image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['gluten-free'],
        badge: 'Local'
      },
      {
        id: 12,
        name: 'Organic Kale',
        category: 'Vegetables',
        price: 2.99,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/2998957/pexels-photo-2998957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 13,
        name: 'Cold-Pressed Olive Oil',
        category: 'Pantry',
        price: 12.99,
        unit: 'bottle',
        image: 'https://images.pexels.com/photos/1022385/pexels-photo-1022385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Cold-Pressed'
      },
      {
        id: 14,
        name: 'Free-Range Chicken',
        category: 'Meat',
        price: 9.99,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['gluten-free'],
        badge: 'Free-Range'
      },
      {
        id: 15,
        name: 'Organic Carrots',
        category: 'Vegetables',
        price: 1.99,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 16,
        name: 'Artisan Baguette',
        category: 'Bakery',
        price: 3.99,
        unit: 'each',
        image: 'https://images.pexels.com/photos/461060/pexels-photo-461060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=20',
        dietary: ['vegan'],
        badge: 'Fresh'
      },
      {
        id: 17,
        name: 'Fresh Mint',
        category: 'Herbs',
        price: 1.99,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/1437424/pexels-photo-1437424.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Fresh'
      },
      {
        id: 18,
        name: 'Organic Apples',
        category: 'Fruits',
        price: 1.29,
        unit: 'each',
        image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 19,
        name: 'Fresh Salmon Fillet',
        category: 'Seafood',
        price: 12.99,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['gluten-free'],
        badge: 'Wild-Caught'
      },
      {
        id: 20,
        name: 'Organic Bell Peppers',
        category: 'Vegetables',
        price: 2.49,
        unit: 'each',
        image: 'https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 21,
        name: 'Fresh Rosemary',
        category: 'Herbs',
        price: 1.99,
        unit: 'bunch',
        image: 'https://images.pexels.com/photos/4198805/pexels-photo-4198805.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Fresh'
      },
      {
        id: 22,
        name: 'Organic Green Tea',
        category: 'Pantry',
        price: 6.99,
        unit: 'box',
        image: 'https://images.pexels.com/photos/4240959/pexels-photo-4240959.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      },
      {
        id: 23,
        name: 'Almond Milk',
        category: 'Dairy',
        price: 3.99,
        unit: 'carton',
        image: 'https://images.pexels.com/photos/11111603/pexels-photo-11111603.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['vegan', 'gluten-free'],
        badge: 'Dairy-Free'
      },
      {
        id: 24,
        name: 'Organic Bananas',
        category: 'Fruits',
        price: 0.69,
        unit: 'lb',
        image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=600',
        dietary: ['organic', 'vegan', 'gluten-free'],
        badge: 'Organic'
      }
    ];
    
    return mockProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category.toLowerCase())) {
      return false;
    }
    
    // Dietary filter
    if (filters.dietary.length > 0 && !filters.dietary.every(tag => product.dietary.includes(tag))) {
      return false;
    }
    
    // Price filter
    if (product.price > filters.maxPrice) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  sortProducts();
  
  // Update pagination
  totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  currentPage = 1;
  
  // Render
  renderProducts();
  renderPagination();
}

function sortProducts() {
  switch (filters.sort) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // Default sorting (featured)
      filteredProducts.sort((a, b) => a.id - b.id);
  }
}

function renderProducts() {
  if (!productsContainer) return;
  
  // Clear container
  productsContainer.innerHTML = '';
  
  // Calculate slice indexes for pagination
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  
  // Get products for current page
  const productsToShow = filteredProducts.slice(startIndex, endIndex);
  
  if (productsToShow.length === 0) {
    // No products found
    productsContainer.innerHTML = `
      <div class="no-products">
        <p>No products found matching your criteria. Try adjusting your filters.</p>
        <button class="btn btn-outline" id="clear-all-filters">Clear All Filters</button>
      </div>
    `;
    
    const clearAllBtn = document.getElementById('clear-all-filters');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', resetAllFilters);
    }
    
    return;
  }
  
  // Create product cards
  productsToShow.forEach(product => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

function createProductCard(product) {
  if (!productTemplate) return document.createElement('div');
  
  // Clone the template
  const template = productTemplate.content.cloneNode(true);
  const card = template.querySelector('.product-card');
  
  // Set product data
  const { id, name, category, price, unit, image, badge } = product;
  
  const imgElement = card.querySelector('.product-image img');
  imgElement.src = image;
  imgElement.alt = name;
  
  const badgeElement = card.querySelector('.product-badge');
  if (badge) {
    badgeElement.textContent = badge;
  } else {
    badgeElement.remove();
  }
  
  card.querySelector('.product-category').textContent = category;
  card.querySelector('.product-name').textContent = name;
  card.querySelector('.product-price').textContent = formatCurrency(price);
  card.querySelector('.product-unit').textContent = `/ ${unit}`;
  
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  addToCartBtn.dataset.productId = id;
  addToCartBtn.addEventListener('click', () => {
    addToCart(product);
  });
  
  return card;
}

function renderPagination() {
  if (!paginationNumbers) return;
  
  // Clear pagination numbers
  paginationNumbers.innerHTML = '';
  
  // Update buttons state
  if (paginationPrev) {
    paginationPrev.disabled = currentPage === 1;
  }
  
  if (paginationNext) {
    paginationNext.disabled = currentPage === totalPages || totalPages === 0;
  }
  
  // If no pages, don't render numbers
  if (totalPages === 0) return;
  
  // Determine which page numbers to show
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 2);
  
  // Adjust startPage if endPage is at max
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 2);
  }
  
  // Add pagination numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageSpan = document.createElement('span');
    pageSpan.textContent = i;
    pageSpan.classList.toggle('active', i === currentPage);
    pageSpan.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
      renderPagination();
    });
    
    paginationNumbers.appendChild(pageSpan);
  }
  
  // Add ellipsis if needed
  if (endPage < totalPages) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('ellipsis');
    paginationNumbers.appendChild(ellipsis);
    
    const lastPage = document.createElement('span');
    lastPage.textContent = totalPages;
    lastPage.addEventListener('click', () => {
      currentPage = totalPages;
      renderProducts();
      renderPagination();
    });
    
    paginationNumbers.appendChild(lastPage);
  }
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

function resetAllFilters() {
  // Reset all filter state
  filters.search = '';
  filters.categories = [];
  filters.dietary = [];
  filters.maxPrice = 100;
  filters.sort = 'default';
  
  // Reset form elements
  if (searchInput) searchInput.value = '';
  
  categoryFilters.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  dietaryFilters.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  if (priceSlider) {
    priceSlider.value = 100;
    if (priceValue) priceValue.textContent = '$100';
  }
  
  if (sortSelect) sortSelect.value = 'default';
  
  // Reset mobile filters too
  categoryFiltersMobile.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  dietaryFiltersMobile.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  if (priceSliderMobile) {
    priceSliderMobile.value = 100;
    if (priceValueMobile) priceValueMobile.textContent = '$100';
  }
  
  // Apply filters
  applyFilters();
}

function updateFilterState() {
  // Update category filters
  filters.categories = Array.from(categoryFilters)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  // Update dietary filters
  filters.dietary = Array.from(dietaryFilters)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  // Update price filter
  filters.maxPrice = parseInt(priceSlider.value);
  
  // Update search filter
  filters.search = searchInput.value.trim();
  
  // Update sort filter
  filters.sort = sortSelect.value;
}

function updateMobileFilters() {
  // Copy desktop filter values to mobile
  categoryFilters.forEach((checkbox, index) => {
    if (categoryFiltersMobile[index]) {
      categoryFiltersMobile[index].checked = checkbox.checked;
    }
  });
  
  dietaryFilters.forEach((checkbox, index) => {
    if (dietaryFiltersMobile[index]) {
      dietaryFiltersMobile[index].checked = checkbox.checked;
    }
  });
  
  if (priceSliderMobile && priceValueMobile) {
    priceSliderMobile.value = priceSlider.value;
    priceValueMobile.textContent = `$${priceSlider.value}`;
  }
}

function applyMobileFilters() {
  // Copy mobile filter values to desktop
  categoryFiltersMobile.forEach((checkbox, index) => {
    if (categoryFilters[index]) {
      categoryFilters[index].checked = checkbox.checked;
    }
  });
  
  dietaryFiltersMobile.forEach((checkbox, index) => {
    if (dietaryFilters[index]) {
      dietaryFilters[index].checked = checkbox.checked;
    }
  });
  
  if (priceSlider && priceValue) {
    priceSlider.value = priceSliderMobile.value;
    priceValue.textContent = `$${priceSliderMobile.value}`;
  }
  
  // Update filter state and apply
  updateFilterState();
  applyFilters();
  
  // Close mobile filters
  closeMobileFilters();
}

function openMobileFilters() {
  if (mobileFilters) {
    updateMobileFilters();
    mobileFilters.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileFilters() {
  if (mobileFilters) {
    mobileFilters.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Event Listeners
function setupEventListeners() {
  // Search
  if (searchInput && searchButton) {
    searchButton.addEventListener('click', () => {
      updateFilterState();
      applyFilters();
    });
    
    searchInput.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        updateFilterState();
        applyFilters();
      }
    });
  }
  
  // Sorting
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      updateFilterState();
      applyFilters();
    });
  }
  
  // Category filters
  categoryFilters.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateFilterState();
      applyFilters();
    });
  });
  
  // Dietary filters
  dietaryFilters.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateFilterState();
      applyFilters();
    });
  });
  
  // Price slider
  if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', () => {
      priceValue.textContent = `$${priceSlider.value}`;
    });
    
    priceSlider.addEventListener('change', () => {
      updateFilterState();
      applyFilters();
    });
  }
  
  // Reset filters
  if (resetFiltersButton) {
    resetFiltersButton.addEventListener('click', resetAllFilters);
  }
  
  // Pagination
  if (paginationPrev) {
    paginationPrev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        renderPagination();
      }
    });
  }
  
  if (paginationNext) {
    paginationNext.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        renderPagination();
      }
    });
  }
  
  // Mobile filters
  if (filterToggle) {
    filterToggle.addEventListener('click', openMobileFilters);
  }
  
  if (closeFilters) {
    closeFilters.addEventListener('click', closeMobileFilters);
  }
  
  if (resetFiltersMobile) {
    resetFiltersMobile.addEventListener('click', () => {
      categoryFiltersMobile.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      dietaryFiltersMobile.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      if (priceSliderMobile && priceValueMobile) {
        priceSliderMobile.value = 100;
        priceValueMobile.textContent = '$100';
      }
    });
  }
  
  if (priceSliderMobile && priceValueMobile) {
    priceSliderMobile.addEventListener('input', () => {
      priceValueMobile.textContent = `$${priceSliderMobile.value}`;
    });
  }
  
  if (applyFiltersMobile) {
    applyFiltersMobile.addEventListener('click', applyMobileFilters);
  }
  
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
    
    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-xxl) 0;
    }
    
    .no-products p {
      margin-bottom: var(--spacing-md);
      color: var(--color-gray-600);
    }
  `;
  document.head.appendChild(style);
}

// Initialize
async function init() {
  // Fetch products
  allProducts = await fetchProducts();
  
  // Set initial filtered products
  filteredProducts = [...allProducts];
  
  // Set total pages
  totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Render products
  renderProducts();
  
  // Render pagination
  renderPagination();
  
  // Setup event listeners
  setupEventListeners();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
