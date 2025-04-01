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

  // First set the src
  lightboxImg.src = imageUrl;

  // Then show the dialog
  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
  } else {
    // Fallback for browsers that don't support showModal()
    lightbox.style.display = "block";
    lightbox.setAttribute("open", "true");
  }
}
// Add event listeners for both click and touch
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleCertificateClick);
  btn.addEventListener('touchstart', handleCertificateClick);
});

function handleCertificateClick(e) {
  e.preventDefault();
  const imageUrl = this.getAttribute('data-image') ||
    this.parentElement.getAttribute('data-image');
  openLightboxFunc(imageUrl);
}

// Close button handling
document.querySelector('.close-btn').addEventListener('click', closeLightbox);
document.querySelector('.close-btn').addEventListener('touchstart', closeLightbox);
document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-backdrop').addEventListener('touchstart', closeLightbox);

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (typeof lightbox.close === 'function') {
    lightbox.close();
  } else {
    lightbox.style.display = "none";
    lightbox.removeAttribute("open");
  }
}

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