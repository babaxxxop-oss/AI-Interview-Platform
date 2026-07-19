document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");

    // Default = Light Mode
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }

    if (!toggle) return;

    updateIcon();

    toggle.addEventListener("click", () => {

        html.classList.toggle("dark");

        if (html.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }

        updateIcon();

    });

    function updateIcon() {

        if (html.classList.contains("dark")) {
            toggle.innerHTML =
                '<i class="fa-solid fa-sun text-yellow-400"></i>';
        } else {
            toggle.innerHTML =
                '<i class="fa-solid fa-moon text-gray-700"></i>';
        }

    }

});