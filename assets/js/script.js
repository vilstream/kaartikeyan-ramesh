'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  if (!formBtn || !form || formInputs.length === 0) {
    console.error('Form or Button element not found!');
    return;
  }

  // Check form validation initially
  const checkFormValidity = () => {
    formBtn.disabled = !form.checkValidity();
  };

  formInputs.forEach(input => input.addEventListener("input", checkFormValidity));

  // Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    formBtn.disabled = true;
    formBtn.innerHTML = `<span>Sending...</span>`;

    emailjs.sendForm("service_igbk7kp", "template_0ej1xyp", form)
      .then(() => {
        alert('✅ Email sent successfully!');
        form.reset();
        formBtn.innerHTML = `<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>`;
        formBtn.disabled = true; // disable again after success
      })
      .catch((error) => {
        alert('❌ Failed to send email: ' + JSON.stringify(error));
        formBtn.innerHTML = `<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>`;
        checkFormValidity(); // Recheck form validity on error
      });
  });

  // Initial check for validity on page load
  checkFormValidity();
});

// Certificate Lightbox
function openLightboxFunc(imageUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const loadingSpinner = document.querySelector('.loading-spinner');

  if (!lightbox || !lightboxImg) {
    console.error('Lightbox elements not found');
    return;
  }

  // Reset transform and show loading state
  lightboxImg.style.transform = 'scale(1)';
  lightboxImg.style.transformOrigin = 'center center';
  lightboxImg.classList.remove('loaded');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'block';
  }

  // First set the src
  lightboxImg.src = imageUrl;

  // Handle image load
  lightboxImg.onload = function() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    lightboxImg.classList.add('loaded');
    lightboxImg.style.opacity = '1';
    // Reset any previous transform
    lightboxImg.style.transform = 'scale(1)';
    lightboxImg.style.transformOrigin = 'center center';
  };

  // Handle image error
  lightboxImg.onerror = function() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    console.error('Error loading image:', imageUrl);
  };

  // Show the dialog
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Add event listeners for both click and touch
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleCertificateClick);
  btn.addEventListener('touchend', handleCertificateClick);
});

function handleCertificateClick(e) {
  e.preventDefault();
  const imageUrl = this.getAttribute('data-image') ||
    this.parentElement.getAttribute('data-image');
  if (imageUrl) {
    openLightboxFunc(imageUrl);
  }
}

// Close button handling
document.querySelector('.close-btn').addEventListener('click', closeLightbox);
document.querySelector('.close-btn').addEventListener('touchend', closeLightbox);

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    // Reset zoom
    updateZoom(1);
  }
}

// Zoom controls
let currentScale = 1;
const ZOOM_STEP = 0.2;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

const lightboxImg = document.getElementById('lightbox-img');
const zoomInBtn = document.querySelector('.zoom-in');
const zoomOutBtn = document.querySelector('.zoom-out');
const lightboxContainer = document.querySelector('.lightbox-image-container');

function updateZoom(scale) {
  if (!lightboxImg) return;
  
  currentScale = Math.min(Math.max(scale, MIN_ZOOM), MAX_ZOOM);
  lightboxImg.style.transform = `scale(${currentScale})`;
  lightboxImg.style.transformOrigin = 'center center';
  
  // Update button states
  if (zoomInBtn) zoomInBtn.disabled = currentScale >= MAX_ZOOM;
  if (zoomOutBtn) zoomOutBtn.disabled = currentScale <= MIN_ZOOM;

  // Add or remove zoomed class
  if (currentScale > 1) {
    lightboxImg.classList.add('zoomed');
  } else {
    lightboxImg.classList.remove('zoomed');
  }
}

if (zoomInBtn) {
  zoomInBtn.addEventListener('click', () => {
    updateZoom(currentScale + ZOOM_STEP);
  });
}

if (zoomOutBtn) {
  zoomOutBtn.addEventListener('click', () => {
    updateZoom(currentScale - ZOOM_STEP);
  });
}

// Pinch to zoom functionality
let initialDistance = 0;
let isPinching = false;

if (lightboxImg) {
  lightboxImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;
      initialDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      const scale = currentDistance / initialDistance;
      updateZoom(scale);
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchend', () => {
    isPinching = false;
    if (currentScale < 1.5) {
      updateZoom(1);
    }
  });
}

// Close lightbox when clicking outside the image
if (lightboxContainer) {
  lightboxContainer.addEventListener('click', (e) => {
    if (e.target === lightboxContainer) {
      closeLightbox();
    }
  });
}

// Close lightbox when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}