// js/modules/youtube.js

import { db } from "./firebase-init.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

$(document).ready(function () {
  const youtubeSection = $("#youtube .row");
  const videosRef = collection(db, "videos");
  const q = query(videosRef, orderBy("timestamp", "desc"));

  // Fetch and display YouTube videos
  onSnapshot(q, (snapshot) => {
    youtubeSection.empty(); // Clear existing videos

    snapshot.forEach((docSnap) => {
      const video = docSnap.data();

      const videoCard = `
        <div class="col-sm-4 mb-4">
          <div class="card">
            <img src="${sanitizeURL(video.thumbnailURL)}" class="card-img-top" alt="Video Thumbnail">
            <div class="card-body">
              <h5 class="card-title">YouTube Video</h5>
              <button class="btn btn-primary view-video-btn" data-embed-url="${sanitizeURL(video.embedURL)}">View Video</button>
            </div>
          </div>
        </div>
      `;

      youtubeSection.append(videoCard);
    });

    // View Video Event
    $(".view-video-btn").off("click").on("click", function () {
      const embedURL = $(this).data("embed-url");
      if (isValidYouTubeEmbedURL(embedURL)) {
        $("#youtubeModalIframe").attr("src", embedURL); // Removed ?autoplay=1
        $("#youtubeModal").modal("show");
      } else {
        alert("Invalid YouTube URL.");
      }
    });
  });

  // Utility Function to Sanitize URLs
  function sanitizeURL(url) {
    const temp = document.createElement("a");
    temp.href = url;
    return temp.href;
  }

  // Validate YouTube Embed URL
  function isValidYouTubeEmbedURL(url) {
    const regex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/;
    return regex.test(url);
  }

  // Stop video when modal is closed
  $('#youtubeModal').on('hidden.bs.modal', function () {
    $("#youtubeModalIframe").attr("src", "");
  });
});
