/* ============================================================
   SEYLUNE — HOME PAGE JAVASCRIPT
   Handles:
   1. Mobile hamburger menu toggle
   2. Cart badge count (from localStorage)
   3. Add-to-cart functionality (localStorage)
   4. Search form redirection
   5. Newsletter form validation
   Keep this logic simple so it can be reused on every page.
============================================================ */


/* ============================================================
   1. MOBILE HAMBURGER MENU
   Toggles the mobile navigation drawer.
============================================================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("active");

    // Update ARIA state for accessibility
    const isOpen = mobileMenu.classList.contains("open");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close the mobile menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });
}


/* ============================================================
   2. CART — localStorage helpers
   The cart is stored as an array of product objects in
   localStorage under the key "seylune_cart".
============================================================ */
const CART_KEY = "seylune_cart";

// Read the cart (returns [] if empty)
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Save the cart back to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Count total number of items (sum of all quantities)
function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

// Update the small cart badge in the navbar
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = count;

  // Hide badge when cart is empty
  badge.style.display = count > 0 ? "flex" : "none";
}

// Add a product to the cart
function addToCart(product) {
  const cart = getCart();

  // Check if the product already exists
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
}


/* ============================================================
   3. ADD TO CART BUTTONS
   Every product card has an "Add to Cart" button with
   data-attributes. We read those and push to the cart.
============================================================ */
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price, 10),
      image: btn.dataset.image
    };

    addToCart(product);

    // Small UX feedback: change button text briefly
    const originalText = btn.textContent;
    btn.textContent = "Added ✓";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1200);
  });
});


/* ============================================================
   4. SEARCH FORM
   The forms natively submit to search.html?q=...
   We also make sure empty searches do not submit.
============================================================ */
const navSearch = document.getElementById("navSearch");
if (navSearch) {
  navSearch.addEventListener("submit", (e) => {
    const input = document.getElementById("searchInput");
    if (!input.value.trim()) {
      e.preventDefault(); // block empty search
    }
  });
}


/* ============================================================
   5. NEWSLETTER FORM VALIDATION
   Simple email format check, shows success message.
============================================================ */
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value.trim();

    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email address.";
      newsletterMessage.style.color = "#E08B8B";
      return;
    }

    newsletterMessage.textContent = "Thank you — you're on the list.";
    newsletterMessage.style.color = "var(--gold)";
    newsletterForm.reset();
  });
}


/* ============================================================
   6. INITIALISE CART BADGE ON PAGE LOAD
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});