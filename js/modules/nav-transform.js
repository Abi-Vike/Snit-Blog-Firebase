document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector("#nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }
});
