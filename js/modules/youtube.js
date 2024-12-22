// js/modules/youtube.js

$(document).ready(function () {
  // Function to handle modal show event
  $("#youtubeModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget); // Element that triggered the modal
    var videoId = button.data("video-id"); // Extract video ID from data-* attributes

    // Construct the YouTube embed URL with autoplay
    var videoSrc =
      "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";

    // Update the iframe's src attribute
    $("#youtubeModalIframe").attr("src", videoSrc);

    // Optionally, set the modal title based on the video's title
    var videoTitle = button.closest(".col-sm-4").find("h2").text();
    $("#youtubeModalLabel").text(videoTitle);
  });

  // Function to handle modal hide event
  $("#youtubeModal").on("hidden.bs.modal", function (event) {
    // Reset the iframe's src attribute to stop the video
    $("#youtubeModalIframe").attr("src", "");
  });
});
