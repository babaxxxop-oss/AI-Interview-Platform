// ==========================================
// AI Mock Register Page JavaScript
// ==========================================


// -------------------------------
// Show / Hide Password
// -------------------------------

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        password.type = "password";
        togglePassword.textContent = "👁️";

    }

});


// -------------------------------
// Show / Hide Confirm Password
// -------------------------------

const confirmPassword = document.getElementById("confirm_password");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";
        toggleConfirmPassword.textContent = "🙈";

    } else {

        confirmPassword.type = "password";
        toggleConfirmPassword.textContent = "👁️";

    }

});