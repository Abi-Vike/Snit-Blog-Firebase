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
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

$(document).ready(function () {
  const adminSection = $("#admin-section");
  const logoutBtn = $("#logout-btn");
  const createPostForm = $("#create-post-form");
  const postsList = $("#posts-list");

  // Authentication State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      adminSection.show();
      loadExistingPosts();
    } else {
      // No user is signed in
      adminSection.hide();
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

    const title = $("#post-title").val().trim();
    const content = $("#post-content").val().trim();

    if (!title || !content) {
      alert("Title and Content are required.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        timestamp: new Date(),
      });
      alert("Post created successfully!");
      createPostForm[0].reset();
      loadExistingPosts();
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to create post. Please try again.");
    }
  });

  // Load Existing Posts
  async function loadExistingPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      postsList.empty();

      querySnapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const postId = docSnap.id;

        const postItem = `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              ${
                post.imageURL
                  ? `<img src="${post.imageURL}" alt="${post.title}" class="img-fluid mb-2">`
                  : ""
              }
              <p class="card-text">${truncateText(post.content, 200)}</p>
              <button class="btn btn-danger delete-post-btn" data-id="${postId}">Delete</button>
            </div>
          </div>
        `;

        postsList.append(postItem);
      });

      // Delete Post Event
      $(".delete-post-btn").on("click", async function () {
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
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to load posts. Please try again.");
    }
  }

  // Utility Function to Truncate Text
  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
});
