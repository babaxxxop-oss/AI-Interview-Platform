/* ==========================================
   AI Mock Login JavaScript
========================================== */

// Get HTML Elements

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Show / Hide Password

togglePassword.addEventListener("click", () => {

    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePassword.textContent = isHidden ? "🙈" : "👁️";

});