// js/modules/text-rotator.js

$(document).ready(function () {
  $(".rotate").textrotator({
    animation: "fade", // Options: dissolve, fade, flip, flipUp, flipCube, flipCubeUp, spin
    separator: ",", // Separator for phrases
    speed: 2000, // Time between rotations in milliseconds
  });
});
