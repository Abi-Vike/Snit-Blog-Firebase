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

  /**
   * Fetches posts from Firestore and displays them in the slider.
   */
  function fetchAndDisplayPosts() {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
      slidesList.empty();

      snapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const postId = docSnap.id;

        const plainText = stripHTML(post.content);
        const normalizedText = plainText.replace(/\s+/g, " ").trim();
        const isTruncated = normalizedText.length > 150;
        const truncatedContent = isTruncated
          ? truncateText(normalizedText, 150)
          : normalizedText;

        const continueReadingLink = isTruncated
          ? `<a href="#" class="continue-reading-link" data-id="${postId}">Keep Reading</a>`
          : "";

        const slideItem = `
          <li>
            <div class="post-card card mb-3">
              <div class="card-body">
                <h4 class="card-title">${sanitizeText(post.title)}</h4>
                ${
                  post.imageURL
                    ? `<img src="${sanitizeURL(
                        post.imageURL
                      )}" alt="${sanitizeText(
                        post.title
                      )}" class="img-fluid mb-2">`
                    : ""
                }
                <p class="card-text">${sanitizeText(truncatedContent)}</p>
                ${continueReadingLink}
              </div>
            </div>
          </li>
        `;

        slidesList.append(slideItem);
      });

      initializeFlexSlider();
    });
  }

  /**
   * Sanitizes text by stripping all HTML tags and escaping special characters.
   * @param {string} text - The text to sanitize.
   * @returns {string} - The sanitized text.
   */
  function sanitizeText(text) {
    const temp = document.createElement("div");
    temp.textContent = text;
    return temp.innerHTML;
  }

  /**
   * Sanitizes URLs to ensure they are safe.
   * @param {string} url - The URL to sanitize.
   * @returns {string} - The sanitized URL.
   */
  function sanitizeURL(url) {
    const temp = document.createElement("a");
    temp.href = url;
    return temp.href;
  }

  /**
   * Strips all HTML tags from a string.
   * @param {string} html - The HTML string to strip.
   * @returns {string} - The plain text string.
   */
  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  /**
   * Truncates text without cutting off words.
   * @param {string} text - The text to truncate.
   * @param {number} maxLength - The maximum number of characters.
   * @returns {string} - The truncated text.
   */
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      const truncated = text.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      return lastSpace > 0
        ? truncated.substring(0, lastSpace) + "..."
        : truncated + "...";
    } else {
      return text;
    }
  }

  /**
   * Initializes the FlexSlider if not already initialized.
   */
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

  /**
   * Handles the click event for "Keep Reading" links to display the full post in a modal.
   */
  slidesList.on("click", "a.continue-reading-link", async function (e) {
    e.preventDefault();
    const postId = $(this).data("id");
    await displayFullPost(postId);
  });

  /**
   * Displays the full post content in a modal.
   * @param {string} postId - The ID of the post to display.
   */
  async function displayFullPost(postId) {
    const postDoc = doc(db, "posts", postId);
    const docSnap = await getDoc(postDoc);

    if (docSnap.exists()) {
      const post = docSnap.data();
      $("#blogPostModalLabel").text(post.title);
      $("#blogPostContent").html(`
        ${
          post.imageURL
            ? `<img src="${sanitizeURL(post.imageURL)}" alt="${sanitizeText(
                post.title
              )}" class="img-fluid mb-2">`
            : ""
        }
        <p>${sanitizeText(post.content).replace(/\s+/g, " ").trim()}</p>
      `);
      $("#blogPostModal").modal("show");
    } else {
      console.log("No such document!");
    }
  }

  // Initial fetch and display of posts
  fetchAndDisplayPosts();
});
