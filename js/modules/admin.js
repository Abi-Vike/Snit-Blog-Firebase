// js/modules/admin.js

import { auth } from "./firebase-init.js"; // Import Auth instance
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

$(document).ready(function () {
  const loginForm = $("#login-form");

  loginForm.on("submit", async function (e) {
    e.preventDefault();

    const email = $("#login-email").val().trim(); // Correct selector
    const password = $("#password").val().trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      // Redirect to admin dashboard
      window.location.href = "dashboard.html"; // Ensure this path is correct
    } catch (error) {
      console.error("Error logging in:", error);
      // Display specific error messages
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/user-disabled":
          alert("This user has been disabled.");
          break;
        case "auth/user-not-found":
          alert("No user found with this email.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password.");
          break;
        default:
          alert("Login failed. Please try again.");
      }
    }
  });
});
