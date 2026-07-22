// mobile nav toggle
const nav = document.querySelector("header nav");
const navToggle = document.getElementById("nav-toggle");

if (nav && navToggle) {
    // both labels live in the button at once so CSS can cross-fade between them.
    // [ x ] is stacked on top of [ menu ], so the button never changes width.
    navToggle.innerHTML =
        '<span class="nav-toggle-label label-open">[ menu ]</span>' +
        '<span class="nav-toggle-label label-close" aria-hidden="true">[ x ]</span>';

    const setMenu = (open) => {
        nav.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "menu sluiten" : "menu openen");
    };

    const closeMenu = () => setMenu(false);

    navToggle.addEventListener("click", () => {
        setMenu(!nav.classList.contains("open"));
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
