// js/modules/admin.js

import { auth } from "./firebase-init.js"; // Import Auth instance
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

$(document).ready(function () {
  const loginForm = $("#login-form");
  const loginError = $("#login-error");

  loginForm.on("submit", async function (e) {
    e.preventDefault();

    // Reset previous error messages
    loginError.text("");
    $(".form-control").removeClass("is-invalid is-valid");

    const email = $("#login-email").val().trim();
    const password = $("#password").val().trim();

    let isValid = true;

    // Validate Email
    if (!validateEmail(email)) {
      $("#login-email").addClass("is-invalid");
      isValid = false;
    } else {
      $("#login-email").addClass("is-valid");
    }

    // Validate Password
    if (!password) {
      $("#password").addClass("is-invalid");
      isValid = false;
    } else {
      $("#password").addClass("is-valid");
    }

    if (!isValid) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      // Redirect to admin dashboard
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Error logging in:", error);
      // Display specific error messages using Bootstrap alerts
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-disabled":
          errorMessage = "This user has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        default:
          errorMessage = "Login failed. Please try again.";
      }
      loginError.html(`<div class="alert alert-danger" role="alert">${errorMessage}</div>`);
    }
  });

  // Email Validation Function
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
