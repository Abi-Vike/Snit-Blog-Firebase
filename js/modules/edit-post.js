// js/modules/edit-post.js

import { auth, db } from "./firebase-init.js"; // Import Auth and Firestore instances
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  doc,
  getDoc as getDocFirestore,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

$(document).ready(function () {
  const logoutBtn = $("#logout-btn");
  const editPostForm = $("#edit-post-form");
  const editPostTitle = $("#edit-post-title");
  const editPostContent = $("#edit-post-content");
  const quillEditor = new Quill("#quill-editor", {
    theme: "snow",
    placeholder: "Edit your post here...",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  });

  let postId = getQueryParam("postId");

  // Authentication State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!postId) {
        alert("No post ID provided.");
        window.location.href = "dashboard.html";
      } else {
        loadPostData(postId);
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

  // Load Post Data
  async function loadPostData(id) {
    try {
      const postDoc = doc(db, "posts", id);
      const docSnap = await getDocFirestore(postDoc);

      if (docSnap.exists()) {
        const post = docSnap.data();
        editPostTitle.val(post.title);
        quillEditor.root.innerHTML = post.content;
      } else {
        alert("No such post exists.");
        window.location.href = "dashboard.html";
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Failed to load post. Please try again.");
      window.location.href = "dashboard.html";
    }
  }

  // Handle Edit Post Form Submission
  editPostForm.on("submit", async function (e) {
    e.preventDefault();

    const updatedTitle = editPostTitle.val().trim();
    const updatedContent = editPostContent.val().trim();

    if (!updatedTitle || !updatedContent) {
      alert("Title and Content are required.");
      return;
    }

    try {
      const postDoc = doc(db, "posts", postId);
      await updateDoc(postDoc, {
        title: updatedTitle,
        content: updatedContent,
        timestamp: new Date(),
      });
      alert("Post updated successfully!");
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  });

  // Utility Function to Get Query Parameter
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
});
