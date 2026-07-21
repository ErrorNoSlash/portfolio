// mobile nav toggle
const nav = document.querySelector("header nav");
const navToggle = document.getElementById("nav-toggle");

if (nav && navToggle) {
    const closeMenu = () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "menu openen");
        navToggle.textContent = "[ menu ]";
    };

    navToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "menu sluiten" : "menu openen");
        navToggle.textContent = open ? "[ x ]" : "[ menu ]";
    });

    // close after tapping a link
    nav.querySelectorAll("#nav-menu a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // close when resizing back to desktop
    window.matchMedia("(min-width: 37.5rem)").addEventListener("change", (e) => {
        if (e.matches) closeMenu();
    });
}

// hide navbar on scroll down, reveal on scroll up
const header = document.querySelector("header");

if (header) {
    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const y = window.scrollY;
            const delta = y - lastY;
            const menuOpen = nav && nav.classList.contains("open");

            if (y < 80 || menuOpen) {
                // near the top, or menu open: always show
                header.classList.remove("nav-hidden");
            } else if (delta > 5) {
                header.classList.add("nav-hidden");
            } else if (delta < -5) {
                header.classList.remove("nav-hidden");
            }

            lastY = y;
            ticking = false;
        });
    }, { passive: true });
}
