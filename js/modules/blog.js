// js/modules/blog.js

$(document).ready(function () {
  // Function to truncate text to a specified length
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  // Iterate through each blog post to set truncated text
  $(".slides li").each(function () {
    var fullText = $(this).find(".truncate").data("full-text");
    var truncated = truncateText(fullText, 150); // Truncate to 150 characters
    $(this).find("p").text(truncated);
  });

  // Handle "Continue Reading" button click
  $(".continue-reading-btn").on("click", function () {
    var title = $(this).data("title");
    var content = $(this).data("content");

    // Populate the modal with title and content
    $("#blogPostModalLabel").text(title);
    $("#blogPostContent").html(content);

    // Show the modal
    $("#blogPostModal").modal("show");
  });

  // Initialize FlexSlider for Blog Slider
  $("#blogSlider").flexslider({
    animation: "slide",
    controlNav: false, // Hide default navigation
    directionNav: false, // Hide default direction navigation
    slideshow: true, // Enable auto-rotation
    slideshowSpeed: 5000, // 5 seconds per slide
    animationSpeed: 600, // Slide animation speed
    pauseOnHover: true, // Pause auto-rotation on hover
    start: function (slider) {
      // Optionally, we can add callbacks here
    },
  });

  // Handle custom navigation buttons
  $(".slider-prev").on("click", function () {
    $("#blogSlider").flexslider("prev");
  });

  $(".slider-next").on("click", function () {
    $("#blogSlider").flexslider("next");
  });
});
