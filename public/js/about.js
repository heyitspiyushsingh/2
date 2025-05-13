/**
 * About page specific JavaScript
 */

// DOM Elements
const contactForm = document.getElementById('contact-form');
const messageSuccessModal = document.getElementById('message-success');
const closeSuccessBtn = document.getElementById('close-success');

// Functions
function validateContactForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  
  // Check if all fields are filled
  if (!name.value.trim()) {
    showValidationError(name, 'Please enter your name');
    return false;
  }
  
  if (!email.value.trim()) {
    showValidationError(email, 'Please enter your email address');
    return false;
  }
  
  // Simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showValidationError(email, 'Please enter a valid email address');
    return false;
  }
  
  if (!subject.value.trim()) {
    showValidationError(subject, 'Please enter a subject');
    return false;
  }
  
  if (!message.value.trim()) {
    showValidationError(message, 'Please enter your message');
    return false;
  }
  
  return true;
}

function showValidationError(inputElement, message) {
  // Remove any existing error messages
  const existingError = inputElement.parentElement.querySelector('.validation-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message
  const errorElement = document.createElement('div');
  errorElement.className = 'validation-error';
  errorElement.textContent = message;
  
  // Add to DOM after the input
  inputElement.parentElement.appendChild(errorElement);
  
  // Focus on the input
  inputElement.focus();
  
  // Add error styles if not already added
  if (!document.querySelector('#validation-error-styles')) {
    const style = document.createElement('style');
    style.id = 'validation-error-styles';
    style.textContent = `
      .validation-error {
        color: var(--color-error);
        font-size: 0.875rem;
        margin-top: 5px;
      }
      
      input.error, textarea.error {
        border-color: var(--color-error);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add error class to input
  inputElement.classList.add('error');
  
  // Remove error on input focus
  inputElement.addEventListener('focus', function() {
    this.classList.remove('error');
    const error = this.parentElement.querySelector('.validation-error');
    if (error) {
      error.remove();
    }
  }, { once: true });
}

function submitContactForm(e) {
  e.preventDefault();
  
  // Validate the form
  if (!validateContactForm()) {
    return;
  }
  
  // In a real app, this would send the form data to the server
  // For now, we'll just simulate success
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  // Simulate API call delay
  setTimeout(() => {
    // Reset form
    contactForm.reset();
    
    // Show success message
    showMessageSuccess();
  }, 800);
}

function showMessageSuccess() {
  if (messageSuccessModal) {
    messageSuccessModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeMessageSuccess() {
  if (messageSuccessModal) {
    messageSuccessModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Event Listeners
function setupEventListeners() {
  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
  }
  
  // Close success modal
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeMessageSuccess);
  }
}

// Initialize
function init() {
  setupEventListeners();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);