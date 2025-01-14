// js/modules/sliders.js

$(window).on("load", function () {
  const sliderConfigs = [
    {
      selector: "#servicesSlider",
      options: {
        animation: "slide",
        directionNav: false,
        controlNav: true,
        touch: true,
        pauseOnHover: true,
        start: function () {
          $.waypoints("refresh");
        },
      },
    },
    {
      selector: "#teamSlider",
      options: {
        animation: "slide",
        directionNav: false,
        controlNav: true,
        touch: true,
        pauseOnHover: true,
        start: function () {
          $.waypoints("refresh");
        },
      },
    },
    {
      selector: "#clientSlider",
      options: {
        animation: "slide",
        directionNav: false,
        controlNav: true,
        touch: true,
        pauseOnHover: true,
        start: function () {
          $.waypoints("refresh");
        },
      },
    },
    // Add more sliders here if needed
  ];

  sliderConfigs.forEach((slider) => {
    const $slider = $(slider.selector);
    if (!$slider.hasClass("flexslider-initialized")) {
      $slider.flexslider(slider.options);
      $slider.addClass("flexslider-initialized");
    }
  });
});
