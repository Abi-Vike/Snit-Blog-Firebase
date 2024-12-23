// js/modules/blog.js

import { db } from "./firebase-init.js"; // Import Firestore instance

// maybe temp logging
console.log("Firestore Instance:", db); // Debugging Line

$(document).ready(function () {
  // DOM Elements
  const blogSlider = $("#blogSlider");
  const slidesList = blogSlider.find(".slides");
  const sliderPrev = $(".slider-prev");
  const sliderNext = $(".slider-next");

  // Function to Fetch and Display Posts
  function fetchAndDisplayPosts() {
    const postsRef = db.collection("posts").orderBy("timestamp", "desc");

    postsRef.onSnapshot((snapshot) => {
      slidesList.empty(); // Clear existing slides

      snapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;

        const slideItem = `
          <li>
            <div class="post-card card mb-3">
              <div class="card-body">
                <h4 class="card-title">${post.title}</h4>
                ${
                  post.imageURL
                    ? `<img src="${post.imageURL}" alt="${post.title}" class="img-fluid mb-2">`
                    : ""
                }
                <p class="card-text">${truncateText(post.content, 150)}</p>
                <button class="btn btn-primary continue-reading-btn" data-id="${postId}">Continue to Read</button>
              </div>
            </div>
          </li>
        `;

        slidesList.append(slideItem);
      });

      initializeFlexSlider(); // Initialize FlexSlider after loading slides
    });
  }

  // Utility Function to Truncate Text
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  // Initialize FlexSlider
  function initializeFlexSlider() {
    if (blogSlider.hasClass("flexslider-initialized")) return; // Prevent re-initialization

    blogSlider.flexslider({
      animation: "slide",
      controlNav: false, // Hide default navigation
      directionNav: false, // Hide default direction navigation
      slideshow: true, // Enable auto-rotation
      slideshowSpeed: 5000, // 5 seconds per slide
      animationSpeed: 600, // Slide animation speed
      pauseOnHover: true, // Pause auto-rotation on hover
      start: function () {
        blogSlider.addClass("flexslider-initialized");
      },
    });

    // Handle custom navigation buttons
    sliderPrev.on("click", function () {
      blogSlider.flexslider("prev");
    });

    sliderNext.on("click", function () {
      blogSlider.flexslider("next");
    });
  }

  // Handle "Continue Reading" Button Click (Event Delegation)
  slidesList.on("click", "button.continue-reading-btn", function () {
    const postId = $(this).data("id");
    displayFullPost(postId);
  });

  // Function to Display Full Post in Modal
  function displayFullPost(postId) {
    db.collection("posts")
      .doc(postId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const post = doc.data();
          $("#blogPostModalLabel").text(post.title);
          $("#blogPostContent").html(`
            ${
              post.imageURL
                ? `<img src="${post.imageURL}" alt="${post.title}" class="img-fluid mb-2">`
                : ""
            }
            <p>${post.content}</p>
          `);
          $("#blogPostModal").modal("show");
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  // Initialize Fetching Posts
  fetchAndDisplayPosts();
});
