// js/modules/maps.js

$(document).ready(function () {
  // Check if the googlemaps div exists before initializing
  if ($("#googlemaps").length) {
    initMap();
  }
});

function initMap() {
  // Basic options for a simple Google Map
  var mapOptions = {
    zoom: 15,
    scrollwheel: false,
    center: new google.maps.LatLng(40.68961985411178, -74.01618003845215), // Addis Ababa
    styles: [
      {
        featureType: "water",
        stylers: [{ color: "#F2F2F2" }, { visibility: "on" }],
      },
      { featureType: "landscape", stylers: [{ color: "#FFFFFF" }] },
      {
        featureType: "road",
        stylers: [{ saturation: -100 }, { lightness: 45 }],
      },
      {
        featureType: "road.highway",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#ADADAD" }],
      },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
    ],
  };

  // Get the HTML DOM element that will contain your map
  var mapElement = document.getElementById("googlemaps");

  // Create the Google Map using the element and options defined above
  var map = new google.maps.Map(mapElement, mapOptions);
}
