// js/modules/blog.js

import { db } from "./firebase-init.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

$(document).ready(function () {
  const blogSlider = $("#blogSlider");
  const slidesList = blogSlider.find(".slides");
  const sliderPrev = $(".slider-prev");
  const sliderNext = $(".slider-next");

  function fetchAndDisplayPosts() {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
      slidesList.empty();

      snapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const postId = docSnap.id;

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
                <button class="btn btn-primary continue-reading-btn" data-id="${postId}">Keep Reading</button>
              </div>
            </div>
          </li>
        `;

        slidesList.append(slideItem);
      });

      initializeFlexSlider();
    });
  }

  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  function initializeFlexSlider() {
    if (blogSlider.hasClass("flexslider-initialized")) return;

    blogSlider.flexslider({
      animation: "slide",
      controlNav: false,
      directionNav: false,
      slideshow: true,
      slideshowSpeed: 5000,
      animationSpeed: 600,
      pauseOnHover: true,
      start: function () {
        blogSlider.addClass("flexslider-initialized");
      },
    });

    sliderPrev.on("click", function () {
      blogSlider.flexslider("prev");
    });

    sliderNext.on("click", function () {
      blogSlider.flexslider("next");
    });
  }

  slidesList.on("click", "button.continue-reading-btn", async function () {
    const postId = $(this).data("id");
    await displayFullPost(postId);
  });

  async function displayFullPost(postId) {
    const postDoc = doc(db, "posts", postId);
    const docSnap = await getDoc(postDoc);

    if (docSnap.exists()) {
      const post = docSnap.data();
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
  }

  fetchAndDisplayPosts();
});
