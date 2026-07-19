document.addEventListener("DOMContentLoaded", () => {

    const toasts = document.querySelectorAll(".toast");

    toasts.forEach((toast) => {

        setTimeout(() => {

            toast.style.opacity = "0";
            toast.style.transform = "translateX(40px)";
            toast.style.transition = "all 0.5s ease";

            setTimeout(() => {
                toast.remove();
            }, 500);

        }, 2000);

    });

});