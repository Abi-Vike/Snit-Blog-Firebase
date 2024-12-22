// js/modules/text-rotator.js

$(document).ready(function () {
  $(".rotate").textrotator({
    animation: "fade", // Options: dissolve, fade, flip, flipUp, flipCube, flipCubeUp, spin
    separator: ",", // Define your own separator if needed
    speed: 2000, // Milliseconds until the next word shows
  });
});
