$(window).on("load", function () {
  $("#blogSlider").flexslider({
    animation: "slide",
    directionNav: false,
    controlNav: true,
    touch: false,
    pauseOnHover: true,
    start: function () {
      $.waypoints("refresh");
    },
  });

  $("#servicesSlider").flexslider({
    animation: "slide",
    directionNav: false,
    controlNav: true,
    touch: true,
    pauseOnHover: true,
    start: function () {
      $.waypoints("refresh");
    },
  });

  $("#teamSlider").flexslider({
    animation: "slide",
    directionNav: false,
    controlNav: true,
    touch: true,
    pauseOnHover: true,
    start: function () {
      $.waypoints("refresh");
    },
  });

  $("#clientSlider").flexslider({
    animation: "slide",
    directionNav: false,
    controlNav: true,
    touch: true,
    pauseOnHover: true,
    start: function () {
      $.waypoints("refresh");
    },
  });
});
