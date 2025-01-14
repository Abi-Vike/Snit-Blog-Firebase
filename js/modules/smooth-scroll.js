// js/modules/smooth-scroll.js

$(document).ready(function () {
  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();

    var target = this.hash;
    var $target = $(target);

    if ($target.length) {
      $("html, body").animate(
        {
          scrollTop: $target.offset().top - 125, // Adjust offset as needed
        },
        800,
        "swing",
        function () {
          window.location.hash = target;
        }
      );
    }
  });
});
