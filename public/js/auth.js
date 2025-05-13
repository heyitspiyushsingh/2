/**
 * Authentication page specific JavaScript
 */

// DOM Elements
const authTabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const registerPassword = document.getElementById('register-password');
const strengthLevel = document.querySelector('.strength-level');
const strengthText = document.querySelector('.strength-text');

// Functions
function switchTab(tabId) {
  // Update tab states
  authTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  
  // Show/hide forms
  document.getElementById('login-form').classList.toggle('hidden', tabId !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tabId !== 'register');
}

function togglePasswordVisibility(button) {
  const passwordField = button.closest('.password-field').querySelector('input');
  const type = passwordField.type === 'password' ? 'text' : 'password';
  passwordField.type = type;
  
  // Update the icon
  button.innerHTML = type === 'text' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
}

function checkPasswordStrength(password) {
  // Simple password strength checker
  if (!password) {
    return { score: 0, feedback: 'Password strength' };
  }
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety check
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Normalize score to 0-3 range
  const normalizedScore = Math.min(Math.floor(score / 2), 3);
  
  // Generate feedback
  let feedback = 'Password strength';
  if (normalizedScore === 1) feedback = 'Weak password';
  if (normalizedScore === 2) feedback = 'Medium strength';
  if (normalizedScore === 3) feedback = 'Strong password';
  
  return { score: normalizedScore, feedback };
}

function updatePasswordStrength() {
  if (!registerPassword || !strengthLevel || !strengthText) return;
  
  const password = registerPassword.value;
  const { score, feedback } = checkPasswordStrength(password);
  
  // Update strength bar
  strengthLevel.className = 'strength-level';
  if (score === 1) strengthLevel.classList.add('weak');
  if (score === 2) strengthLevel.classList.add('medium');
  if (score === 3) strengthLevel.classList.add('strong');
  
  // Update text
  strengthText.textContent = feedback;
}

function validateLoginForm() {
  const email = document.getElementById('login-email');
  const password = document.getElementById('login-password');
  
  // Check if all fields are filled
  if (!email.value.trim()) {
    showAuthMessage(loginForm, 'Please enter your email address', 'error');
    return false;
  }
  
  // Simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showAuthMessage(loginForm, 'Please enter a valid email address', 'error');
    return false;
  }
  
  if (!password.value) {
    showAuthMessage(loginForm, 'Please enter your password', 'error');
    return false;
  }
  
  return true;
}

function validateRegisterForm() {
  const firstName = document.getElementById('register-first-name');
  const lastName = document.getElementById('register-last-name');
  const email = document.getElementById('register-email');
  const password = document.getElementById('register-password');
  const confirmPassword = document.getElementById('register-confirm-password');
  const termsAgree = document.getElementById('terms-agree');
  
  // Check if all fields are filled
  if (!firstName.value.trim()) {
    showAuthMessage(registerForm, 'Please enter your first name', 'error');
    return false;
  }
  
  if (!lastName.value.trim()) {
    showAuthMessage(registerForm, 'Please enter your last name', 'error');
    return false;
  }
  
  if (!email.value.trim()) {
    showAuthMessage(registerForm, 'Please enter your email address', 'error');
    return false;
  }
  
  // Simple email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showAuthMessage(registerForm, 'Please enter a valid email address', 'error');
    return false;
  }
  
  if (!password.value) {
    showAuthMessage(registerForm, 'Please enter your password', 'error');
    return false;
  }
  
  // Password strength check
  const { score } = checkPasswordStrength(password.value);
  if (score < 2) {
    showAuthMessage(registerForm, 'Please choose a stronger password', 'error');
    return false;
  }
  
  if (password.value !== confirmPassword.value) {
    showAuthMessage(registerForm, 'Passwords do not match', 'error');
    return false;
  }
  
  if (!termsAgree.checked) {
    showAuthMessage(registerForm, 'You must agree to the Terms of Service', 'error');
    return false;
  }
  
  return true;
}

function showAuthMessage(form, message, type) {
  // Find message container
  const messageContainer = form.querySelector('.auth-message');
  
  if (messageContainer) {
    // Set message and class
    messageContainer.textContent = message;
    messageContainer.className = `auth-message ${type}`;
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function loginUser(e) {
  e.preventDefault();
  
  // Validate the form
  if (!validateLoginForm()) {
    return;
  }
  
  // Get form data
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  // In a real app, this would send login request to the server
  // For now, we'll just simulate success
  
  // Simulate API call delay
  showAuthMessage(loginForm, 'Signing in...', 'info');
  
  setTimeout(() => {
    // Store user data in local storage
    const userData = {
      email,
      firstName: 'Demo',
      lastName: 'User',
      isLoggedIn: true
    };
    
    setStorageItem('user', userData);
    
    // Redirect to home
    window.location.href = '/';
  }, 1000);
}

function registerUser(e) {
  e.preventDefault();
  
  // Validate the form
  if (!validateRegisterForm()) {
    return;
  }
  
  // Get form data
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  // In a real app, this would send registration request to the server
  // For now, we'll just simulate success
  
  // Simulate API call delay
  showAuthMessage(registerForm, 'Creating your account...', 'info');
  
  setTimeout(() => {
    // Store user data in local storage
    const userData = {
      email,
      firstName,
      lastName,
      isLoggedIn: true
    };
    
    setStorageItem('user', userData);
    
    // Redirect to home
    window.location.href = '/';
  }, 1000);
}

// Event Listeners
function setupEventListeners() {
  // Tab switching
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });
  
  // Toggle password visibility
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
      togglePasswordVisibility(button);
    });
  });
  
  // Password strength checker
  if (registerPassword) {
    registerPassword.addEventListener('input', updatePasswordStrength);
  }
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', registerUser);
  }
}

// Initialize
function init() {
  setupEventListeners();
  
  // Check if user is already logged in
  const userData = getStorageItem('user');
  if (userData && userData.isLoggedIn) {
    // Redirect to home if already logged in
    window.location.href = '/';
  }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);