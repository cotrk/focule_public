// Main JavaScript for Focule Landing Page

// Lemon Squeezy Setup
window.createLemonSqueezy = function () {
  if (window.createLemonSqueezy) {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        console.log('LemonSqueezy Event:', event);
      }
    });
  }
};

// Error handling for Lemon Squeezy
function createErrorOverlay(message) {
  const overlay = document.createElement('div');
  overlay.className = 'ls-error-overlay';
  overlay.innerHTML = `
    <div class="ls-error-content">
      <button class="ls-error-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <h3>Checkout Error</h3>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth scrolling to all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading states to buttons
  const lemonsqueezyButtons = document.querySelectorAll('.lemonsqueezy-button');
  lemonsqueezyButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.innerHTML = 'Loading...';
      this.disabled = true;
      
      // Reset after 5 seconds if checkout doesn't load
      setTimeout(() => {
        this.innerHTML = this.getAttribute('data-original-text') || 'Buy Focule Now';
        this.disabled = false;
      }, 5000);
    });
    
    // Store original text
    this.setAttribute('data-original-text', this.innerHTML);
  });
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Add scroll-based header shadow
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Analytics placeholder (if needed)
function trackEvent(eventName, properties = {}) {
  // Add your analytics tracking here
  console.log('Track Event:', eventName, properties);
}

// Track button clicks
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('lemonsqueezy-button')) {
    trackEvent('checkout_button_clicked', {
      button_text: e.target.textContent,
      button_location: e.target.closest('section')?.className || 'unknown'
    });
  }
});
