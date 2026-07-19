(() => {
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let transitionTimer;
    let themeApplyTimer;

    // localStorage.theme is the single theme source for the entire application.
    html.classList.toggle("dark", localStorage.getItem("theme") === "dark");

    if (!toggle) return;

    const updateIcon = () => {
        toggle.innerHTML = html.classList.contains("dark")
            ? '<i class="fa-solid fa-sun text-yellow-400"></i>'
            : '<i class="fa-solid fa-moon text-gray-700"></i>';
    };

    updateIcon();

    const applyTheme = (isDark) => {
        html.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateIcon();
    };

    const createCinematicOverlay = (direction) => {
        const overlay = document.createElement("div");
        overlay.className = `theme-cinematic theme-cinematic--${direction}`;
        overlay.setAttribute("aria-hidden", "true");

        const celestial = direction === "night"
            ? '<div class="theme-shadow"></div><div class="theme-moon"><i></i><b></b></div><div class="theme-aurora"></div><div class="theme-stars"></div><div class="theme-shooting-star"></div><div class="theme-particles"></div>'
            : '<div class="theme-sunrise"></div><div class="theme-sun"><i></i></div><div class="theme-cloud theme-cloud--one"></div><div class="theme-cloud theme-cloud--two"></div><div class="theme-birds"><svg viewBox="0 0 120 32" fill="none"><path d="M4 18c5-8 10-8 15 0 5-8 10-8 15 0M42 10c4-6 8-6 12 0 4-6 8-6 12 0M78 22c3-5 7-5 10 0 3-5 7-5 10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>';

        overlay.innerHTML = celestial;

        if (direction === "night") {
            const stars = overlay.querySelector(".theme-stars");
            const particles = overlay.querySelector(".theme-particles");
            const starFragment = document.createDocumentFragment();
            const particleFragment = document.createDocumentFragment();

            for (let index = 0; index < 68; index += 1) {
                const star = document.createElement("i");
                star.style.setProperty("--x", `${Math.random() * 100}%`);
                star.style.setProperty("--y", `${Math.random() * 68}%`);
                star.style.setProperty("--size", `${1 + Math.random() * 2.6}px`);
                star.style.setProperty("--delay", `${0.75 + Math.random() * 1.2}s`);
                star.style.setProperty("--twinkle", `${2.4 + Math.random() * 2.8}s`);
                starFragment.appendChild(star);
            }

            for (let index = 0; index < 11; index += 1) {
                const particle = document.createElement("i");
                particle.style.setProperty("--x", `${22 + Math.random() * 65}%`);
                particle.style.setProperty("--drift", `${-18 + Math.random() * 36}px`);
                particle.style.setProperty("--delay", `${1.15 + Math.random() * .7}s`);
                particleFragment.appendChild(particle);
            }

            stars.appendChild(starFragment);
            particles.appendChild(particleFragment);
        }

        return overlay;
    };

    const playTransition = (isDark) => {
        window.clearTimeout(transitionTimer);
        window.clearTimeout(themeApplyTimer);
        document.querySelector(".theme-cinematic")?.remove();

        if (reducedMotion.matches) {
            applyTheme(isDark);
            return;
        }

        const direction = isDark ? "night" : "day";
        const duration = isDark ? 2200 : 2300;
        const overlay = createCinematicOverlay(direction);
        const toggleBounds = toggle.getBoundingClientRect();
        overlay.style.setProperty("--theme-origin-x", `${toggleBounds.left + toggleBounds.width / 2}px`);
        overlay.style.setProperty("--theme-origin-y", `${toggleBounds.top + toggleBounds.height / 2}px`);

        document.body.appendChild(overlay);
        html.classList.add("theme-is-transitioning");
        toggle.classList.add("theme-toggle-bounce");

        // A single frame ensures the overlay is painted before its keyframes begin.
        requestAnimationFrame(() => overlay.classList.add("is-playing"));

        themeApplyTimer = window.setTimeout(() => applyTheme(isDark), 120);
        transitionTimer = window.setTimeout(() => {
            overlay.remove();
            html.classList.remove("theme-is-transitioning");
            toggle.classList.remove("theme-toggle-bounce");
        }, duration);
    };

    toggle.addEventListener("click", () => playTransition(!html.classList.contains("dark")));
})();
