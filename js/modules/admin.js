import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyD1mc1rUDQQkL9CUMJKIh9Ybk-H2IBw1Hw",
  authDomain: "betty-thinks.firebaseapp.com",
  projectId: "betty-thinks",
  storageBucket: "betty-thinks.firebasestorage.app",
  messagingSenderId: "145409410703",
  appId: "1:145409410703:web:08888f5adc7c9c7dddd2fa",
  measurementId: "G-5C9Q452TZD",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");
const adminSection = document.getElementById("admin-section");
const loginSection = document.getElementById("login-section");
const logoutBtn = document.getElementById("logout-btn");

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    loginSection.style.display = "none";
    adminSection.style.display = "block";
    displayPosts();
  } else {
    // User is signed out
    loginSection.style.display = "block";
    adminSection.style.display = "none";
  }
});

// Handle Login Form Submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      loginError.textContent = "";
      loginForm.reset();
    })
    .catch((error) => {
      loginError.textContent = error.message;
    });
});

// Handle Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error("Sign Out Error", error);
      });
  });
}

//==================================================== CRUD OPERATIONS =======================================================//

// DOM Elements for Creating Posts
const createPostForm = document.getElementById("create-post-form");
const postTitle = document.getElementById("post-title");
const postContent = document.getElementById("post-content");
const postImage = document.getElementById("post-image");

// DOM Element for Listing Posts
const postsList = document.getElementById("posts-list");

// Handle Create Post Form Submission
createPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = postTitle.value;
  const content = postContent.value;
  const imageURL = postImage.value || "";
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  db.collection("posts")
    .add({
      title,
      content,
      imageURL,
      author: "Dawit Solomon",
      timestamp,
    })
    .then(() => {
      createPostForm.reset();
      alert("Post created successfully!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

// Function to Display Existing Posts
function displayPosts() {
  db.collection("posts")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      postsList.innerHTML = "";
      snapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;

        const postDiv = document.createElement("div");
        postDiv.classList.add("card", "mb-3");
        postDiv.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${truncateText(post.content, 100)}</p>
          ${
            post.imageURL
              ? `<img src="${post.imageURL}" alt="${post.title}" class="img-fluid mb-2">`
              : ""
          }
          <button class="btn btn-primary btn-sm edit-post-btn" data-id="${postId}">Edit</button>
          <button class="btn btn-danger btn-sm delete-post-btn" data-id="${postId}">Delete</button>
          <!-- Edit Modal -->
          <div class="modal fade" id="editModal-${postId}" tabindex="-1" role="dialog" aria-labelledby="editModalLabel-${postId}" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="editModalLabel-${postId}">Edit Post</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form id="edit-post-form-${postId}">
                    <div class="form-group">
                      <label for="edit-title-${postId}">Title</label>
                      <input type="text" class="form-control" id="edit-title-${postId}" value="${
          post.title
        }" required>
                    </div>
                    <div class="form-group">
                      <label for="edit-content-${postId}">Content</label>
                      <textarea class="form-control" id="edit-content-${postId}" rows="5" required>${
          post.content
        }</textarea>
                    </div>
                    <div class="form-group">
                      <label for="edit-image-${postId}">Image URL</label>
                      <input type="url" class="form-control" id="edit-image-${postId}" value="${
          post.imageURL
        }">
                    </div>
                    <button type="submit" class="btn btn-success">Update Post</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

        postsList.appendChild(postDiv);

        // Handle Delete Post
        const deleteBtn = postDiv.querySelector(".delete-post-btn");
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this post?")) {
            db.collection("posts")
              .doc(postId)
              .delete()
              .then(() => {
                alert("Post deleted successfully!");
              })
              .catch((error) => {
                console.error("Error deleting document: ", error);
              });
          }
        });

        // Handle Edit Post
        const editBtn = postDiv.querySelector(".edit-post-btn");
        editBtn.addEventListener("click", () => {
          $(`#editModal-${postId}`).modal("show");
        });

        // Handle Edit Post Form Submission
        const editForm = document.getElementById(`edit-post-form-${postId}`);
        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const updatedTitle = document.getElementById(
            `edit-title-${postId}`
          ).value;
          const updatedContent = document.getElementById(
            `edit-content-${postId}`
          ).value;
          const updatedImageURL =
            document.getElementById(`edit-image-${postId}`).value || "";

          db.collection("posts")
            .doc(postId)
            .update({
              title: updatedTitle,
              content: updatedContent,
              imageURL: updatedImageURL,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              alert("Post updated successfully!");
              $(`#editModal-${postId}`).modal("hide");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        });
      });
    });
}

// Utility Function to Truncate Text
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}
