const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginForm = document.getElementById("loginForm");
const fields = document.querySelectorAll(".input-wrap input");

togglePassword.addEventListener("click", () => {
    const willShow = passwordInput.type === "password";
    passwordInput.type = willShow ? "text" : "password";
    togglePassword.classList.toggle("is-visible", willShow);
    togglePassword.setAttribute("aria-label", willShow ? "Hide password" : "Show password");
    togglePassword.setAttribute("aria-pressed", String(willShow));
    passwordInput.focus();
});

fields.forEach((field) => {
    const wrap = field.closest(".input-wrap");
    const updateState = () => wrap.classList.toggle("has-value", field.value.trim().length > 0);
    field.addEventListener("input", updateState);
    field.addEventListener("blur", updateState);
    updateState();
});

loginForm.addEventListener("submit", () => {
    const button = loginForm.querySelector(".login-button");
    button.classList.add("is-loading");
    button.disabled = true;
    button.querySelector("span").textContent = "Logging in";
});
