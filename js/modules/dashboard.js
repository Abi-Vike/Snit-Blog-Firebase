// js/modules/dashboard.js

import { auth, db } from "./firebase-init.js"; // Import Auth and Firestore instances
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

$(document).ready(function () {
  const logoutBtn = $("#logout-btn");
  const createPostForm = $("#create-post-form");
  const postsList = $("#posts-list");
  const addVideoForm = $("#add-video-form");
  const videosList = $("#videos-list");

  // Authentication State Listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().roles.admin) {
        // User is admin
        loadExistingPosts();
        loadExistingVideos();
      } else {
        alert("Access denied. Admins only.");
        window.location.href = "index.html"; // Redirect to home or another page
      }
    } else {
      // No user is signed in
      window.location.href = "admin.html"; // Redirect to login if not authenticated
    }
  });

  // Logout Functionality
  logoutBtn.on("click", async function () {
    try {
      await signOut(auth);
      console.log("User signed out.");
      window.location.href = "admin.html";
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Logout failed. Please try again.");
    }
  });

  // Create New Post
  createPostForm.on("submit", async function (e) {
    e.preventDefault();

    // Reset previous error messages
    $("#create-post-error").text("");
    $("#post-title").removeClass("is-invalid is-valid");
    $("#post-content").removeClass("is-invalid is-valid");

    const title = $("#post-title").val().trim();
    const content = $("#post-content").val().trim();

    let isValid = true;

    // Validate Title
    if (!title) {
      $("#post-title").addClass("is-invalid");
      isValid = false;
    } else {
      $("#post-title").addClass("is-valid");
    }

    // Validate Content
    if (!content) {
      $("#post-content").addClass("is-invalid");
      isValid = false;
    } else {
      $("#post-content").addClass("is-valid");
    }

    if (!isValid) {
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        timestamp: serverTimestamp(),
      });
      // Display success message using Bootstrap alerts
      $("#create-post-error").html(`<div class="alert alert-success" role="alert">Post created successfully!</div>`);
      createPostForm[0].reset();
      quill.setContents([{ insert: "\n" }]); // Reset Quill editor
      loadExistingPosts();
    } catch (error) {
      console.error("Error adding document:", error);
      $("#create-post-error").html(`<div class="alert alert-danger" role="alert">Failed to create post. Please try again.</div>`);
    }
  });

  // Load Existing Posts
  async function loadExistingPosts() {
    try {
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(postsQuery);
      postsList.empty();

      querySnapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const postId = docSnap.id;

        const postItem = `
          <div class="card mb-3" id="post-${postId}">
            <div class="card-body">
              <h5 class="card-title">${sanitizeText(post.title)}</h5>
              ${
                post.imageURL
                  ? `<img src="${sanitizeURL(post.imageURL)}" alt="${sanitizeText(post.title)}" class="img-fluid mb-2">`
                  : ""
              }
              <p class="card-text">${truncateText(post.content, 200)}</p>
              <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
              <button class="btn btn-secondary edit-post-btn" data-id="${postId}">Edit</button>
            </div>
          </div>
        `;

        postsList.append(postItem);
      });

      // Delete Post Event
      $(".delete-post-btn").off("click").on("click", async function () {
        const postId = $(this).data("id");
        if (confirm("Are you sure you want to delete this post?")) {
          try {
            await deleteDoc(doc(db, "posts", postId));
            alert("Post deleted successfully!");
            loadExistingPosts();
          } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete post. Please try again.");
          }
        }
      });

      // Edit Post Event
      $(".edit-post-btn").off("click").on("click", function () {
        const postId = $(this).data("id");
        window.location.href = `edit-post.html?postId=${postId}`;
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      $("#posts-error").html(`<div class="alert alert-danger" role="alert">Failed to load posts. Please try again.</div>`);
    }
  }

  // Add Video Functionality
  addVideoForm.on("submit", async function (e) {
    e.preventDefault();

    // Reset previous error messages
    $("#add-video-error").text("");
    $("#video-url").removeClass("is-invalid is-valid");

    const videoURL = $("#video-url").val().trim();

    let isValid = true;

    // Validate Video URL
    if (!videoURL) {
      $("#video-url").addClass("is-invalid");
      isValid = false;
    } else {
      const videoId = extractYouTubeID(videoURL);
      if (!videoId) {
        $("#video-url").addClass("is-invalid");
        isValid = false;
      } else {
        $("#video-url").addClass("is-valid");
      }
    }

    if (!isValid) {
      return;
    }

    const videoId = extractYouTubeID(videoURL);
    const thumbnailURL = `https://img.youtube.com/vi/${videoId}/0.jpg`;
    const embedURL = `https://www.youtube.com/embed/${videoId}`;

    try {
      await addDoc(collection(db, "videos"), {
        videoId,
        thumbnailURL,
        embedURL,
        timestamp: serverTimestamp(),
      });
      // Display success message using Bootstrap alerts
      $("#add-video-error").html(`<div class="alert alert-success" role="alert">Video added successfully!</div>`);
      addVideoForm[0].reset();
      loadExistingVideos();
    } catch (error) {
      console.error("Error adding video:", error);
      $("#add-video-error").html(`<div class="alert alert-danger" role="alert">Failed to add video. Please try again.</div>`);
    }
  });

  // Load Existing Videos
  async function loadExistingVideos() {
    try {
      const videosQuery = query(collection(db, "videos"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(videosQuery);
      videosList.empty();

      querySnapshot.forEach((docSnap) => {
        const video = docSnap.data();
        const videoId = docSnap.id;

        const videoItem = `
          <div class="card mb-3" id="video-${videoId}" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="${sanitizeURL(video.thumbnailURL)}" class="card-img" alt="Video Thumbnail">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">YouTube Video ID: ${sanitizeText(video.videoId)}</h5>
                  <a href="${sanitizeURL(video.embedURL)}" target="_blank" class="btn btn-primary">View Video</a>
                  <button class="btn btn-danger delete-video-btn" data-id="${videoId}">Delete</button>
                </div>
              </div>
            </div>
          </div>
        `;

        videosList.append(videoItem);
      });

      // Delete Video Event
      $(".delete-video-btn").off("click").on("click", async function () {
        const videoId = $(this).data("id");
        if (confirm("Are you sure you want to delete this video?")) {
          try {
            await deleteDoc(doc(db, "videos", videoId));
            alert("Video deleted successfully!");
            loadExistingVideos();
          } catch (error) {
            console.error("Error deleting video:", error);
            alert("Failed to delete video. Please try again.");
          }
        }
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      $("#videos-error").html(`<div class="alert alert-danger" role="alert">Failed to load videos. Please try again.</div>`);
    }
  }

  // Utility Function to Sanitize Text
  function sanitizeText(text) {
    const temp = document.createElement("div");
    temp.textContent = text;
    return temp.innerHTML;
  }

  // Utility Function to Sanitize URLs
  function sanitizeURL(url) {
    const temp = document.createElement("a");
    temp.href = url;
    return temp.href;
  }

  // Utility Function to Truncate Text
  function truncateText(text, maxLength) {
    // Strip HTML tags to get plain text
    const plainText = stripHTML(text);

    // Normalize whitespace: replace multiple spaces and newlines with a single space
    const normalizedText = plainText.replace(/\s+/g, " ").trim();

    if (normalizedText.length > maxLength) {
      // Truncate without cutting words
      const truncated = normalizedText.substring(0, maxLength);
      const lastSpace = truncated.lastIndexOf(" ");
      return lastSpace > 0
        ? truncated.substring(0, lastSpace) + "..."
        : truncated + "...";
    } else {
      return normalizedText;
    }
  }

  // Utility Function to Strip HTML Tags
  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  // Utility Function to Extract YouTube Video ID
  function extractYouTubeID(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
});
