'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});

// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

  // mobile menu function
  const mobileMenuCloseFunc = function () {
    mobileMenu[i].classList.remove('active');
    overlay.classList.remove('active');
  }

  mobileMenuOpenBtn[i].addEventListener('click', function () {
    mobileMenu[i].classList.add('active');
    overlay.classList.add('active');
  });

  mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
  overlay.addEventListener('click', mobileMenuCloseFunc);

}

// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

  accordionBtn[i].addEventListener('click', function () {

    const clickedBtn = this.nextElementSibling.classList.contains('active');

    for (let i = 0; i < accordion.length; i++) {

      if (clickedBtn) break;

      if (accordion[i].classList.contains('active')) {

        accordion[i].classList.remove('active');
        accordionBtn[i].classList.remove('active');

      }

    }

    this.nextElementSibling.classList.toggle('active');
    this.classList.toggle('active');

  });

}


// ===============================================
// === CART & WISHLIST FUNCTIONALITY (UPDATED) ===
// ===============================================

// Arrays to store item IDs
const cart = [];
const wishlist = [];

// Select all interactive buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');

// Select count elements
const cartCountElements = document.querySelectorAll('.header-user-actions .action-btn:nth-child(3) .count, .mobile-bottom-navigation .action-btn:nth-child(2) .count');
const wishlistCountElements = document.querySelectorAll('.header-user-actions .action-btn:nth-child(2) .count, .mobile-bottom-navigation .action-btn:nth-child(4) .count');

// Select header cart icons for animation
const headerCartIcons = document.querySelectorAll('.header-user-actions .action-btn:nth-child(3), .mobile-bottom-navigation .action-btn:nth-child(2)');


/**
 * Updates the cart count display in the header.
 */
const updateCartCount = () => {
  cartCountElements.forEach(el => el.textContent = cart.length);
};

/**
 * Updates the wishlist count display in the header.
 */
const updateWishlistCount = () => {
  wishlistCountElements.forEach(el => el.textContent = wishlist.length);
};


/**
 * Handles the "fly to cart" animation.
 * @param {HTMLElement} product - The product card element.
 */
const flyToCartAnimation = (product) => {
  const productImage = product.querySelector('.product-img.default');
  const cartIcon = document.querySelector('.header-main .header-user-actions .action-btn:nth-child(3)'); // Target desktop cart icon

  if (!productImage || !cartIcon) return;

  // Get position of the product image and the cart icon
  const imgRect = productImage.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Create a clone of the product image
  const flyingImg = productImage.cloneNode(true);
  flyingImg.classList.add('fly-to-cart-img');
  document.body.appendChild(flyingImg);

  // Set initial position of the clone
  flyingImg.style.top = `${imgRect.top}px`;
  flyingImg.style.left = `${imgRect.left}px`;
  flyingImg.style.width = `${imgRect.width}px`;
  flyingImg.style.height = `${imgRect.height}px`;

  // Animate the clone to the cart icon's position
  requestAnimationFrame(() => {
    flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
    flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
    flyingImg.style.transform = 'scale(0.1)';
    flyingImg.style.opacity = '0';
  });

  // Remove the clone after the animation and bounce the cart icon
  setTimeout(() => {
    flyingImg.remove();
    // Add bounce effect to cart icons
    headerCartIcons.forEach(icon => {
      icon.classList.add('cart-bounce');
      setTimeout(() => icon.classList.remove('cart-bounce'), 600); // Duration of the bounce animation
    });
  }, 1000); // 1s matches the transition duration in CSS
};


/**
 * Adds a product to the cart and triggers animation.
 * @param {Event} event - The click event.
 */
const addToCart = (event) => {
  event.preventDefault();
  const button = event.currentTarget;
  const product = button.closest('.showcase');
  const productId = product.dataset.productId;

  if (cart.includes(productId)) {
    // Optionally, give feedback that it's already in the cart
    button.classList.add('shake');
    setTimeout(() => button.classList.remove('shake'), 500);
  } else {
    cart.push(productId);
    updateCartCount();
    flyToCartAnimation(product); // Trigger the new animation
    console.log('Cart Item IDs:', cart);
  }
};


/**
 * Adds a product to the wishlist and triggers animation.
 * @param {Event} event - The click event.
 */
const addToWishlist = (event) => {
  event.preventDefault();
  const button = event.currentTarget;
  const product = button.closest('.showcase');
  const productId = product.dataset.productId;
  const icon = button.querySelector('ion-icon');

  if (wishlist.includes(productId)) {
    // If you want to implement "unliking", you'd add logic here.
    // For now, we'll just prevent duplicates.
    return;
  }
  
  wishlist.push(productId);
  updateWishlistCount();

  // Visually update the button with the "pop" animation
  icon.setAttribute('name', 'heart');
  icon.style.color = 'var(--salmon-pink)';
  icon.classList.add('liked-pop');
  
  // Remove the animation class so it can be re-triggered
  setTimeout(() => {
    icon.classList.remove('liked-pop');
  }, 500); // Matches the animation duration

  console.log('Wishlist Item IDs:', wishlist);
};


// Attach the event listeners
addToCartButtons.forEach(button => button.addEventListener('click', addToCart));
addToWishlistButtons.forEach(button => button.addEventListener('click', addToWishlist));

// Initialize counts on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistCount();
});