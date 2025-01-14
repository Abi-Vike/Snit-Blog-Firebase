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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.es.js";

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
        quillEditor.root.innerHTML = DOMPurify.sanitize(post.content, {
          ALLOWED_TAGS: [
            "b",
            "i",
            "em",
            "strong",
            "a",
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "ol",
            "li",
            "br",
            "img",
          ],
          ALLOWED_ATTR: ["href", "src", "alt", "title"],
        });
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

    // Reset previous error messages
    $(".form-control").removeClass("is-invalid is-valid");
    $("#edit-post-error").text("");

    const updatedTitle = editPostTitle.val().trim();
    const updatedContent = $("#quill-editor").html().trim(); // Get content from Quill

    let isValid = true;

    // Validate Title
    if (!updatedTitle) {
      $("#edit-post-title").addClass("is-invalid");
      isValid = false;
    } else {
      $("#edit-post-title").addClass("is-valid");
    }

    // Validate Content
    if (!updatedContent || stripHTML(updatedContent).length === 0) {
      $("#quill-editor").addClass("is-invalid");
      isValid = false;
    } else {
      $("#quill-editor").addClass("is-valid");
    }

    if (!isValid) {
      return;
    }

    try {
      const postDoc = doc(db, "posts", postId);
      await updateDoc(postDoc, {
        title: updatedTitle,
        content: updatedContent,
        timestamp: serverTimestamp(),
      });
      // Display success message using Bootstrap alerts
      $("#edit-post-error").html(`<div class="alert alert-success" role="alert">Post updated successfully!</div>`);
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Error updating post:", error);
      $("#edit-post-error").html(`<div class="alert alert-danger" role="alert">Failed to update post. Please try again.</div>`);
    }
  });

  // Utility Function to Get Query Parameter
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Utility Function to Strip HTML Tags
  function stripHTML(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  // Initialize Quill Editor Content Synchronization
  quillEditor.on("text-change", function () {
    const content = quillEditor.root.innerHTML;
    $("#edit-post-content").val(content);
  });
});
