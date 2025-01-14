// js/modules/menu.js

(function () {
  const bodyEl = document.body;
  const openBtn = document.getElementById("open-button");
  const closeBtn = document.getElementById("close-button");

  function init() {
    if (openBtn) {
      openBtn.addEventListener("click", toggleMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", toggleMenu);
    }
  }

  function toggleMenu() {
    bodyEl.classList.toggle("show-menu");
    // Optionally, toggle an active class for animation on buttons
    openBtn.classList.toggle("active");
    closeBtn.classList.toggle("active");
  }

  init();
})();
