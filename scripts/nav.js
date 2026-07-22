// controles the mobile nav toggle
const nav = document.querySelector("header nav");
const navToggle = document.getElementById("nav-toggle");

if (nav && navToggle) {
    // [ x ] sits on top of [ menu ] so the button keeps its width
    navToggle.innerHTML =
        '<span class="nav-toggle-label label-open">[ menu ]</span>' +
        '<span class="nav-toggle-label label-close" aria-hidden="true">[ x ]</span>';

    navToggle.addEventListener("click", () => {
        setMenu(!nav.classList.contains("open"));
    });

    // close after tapping a link
    nav.querySelectorAll("#nav-menu a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    // close when resizing back to desktop
    window.matchMedia("(min-width: 37.5rem)").addEventListener("change", (e) => {
        if (e.matches) setMenu(false);
    });
}

function setMenu(open) {
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "menu sluiten" : "menu openen");
}

// controles the navbar hiding on scroll down
const header = document.querySelector("header");

if (header) {
    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(updateHeader);
    }, { passive: true });

    function updateHeader() {
        const y = window.scrollY;
        const delta = y - lastY;
        const menuOpen = nav && nav.classList.contains("open");

        // near the top, or menu open: always show
        if (y < 80 || menuOpen) {
            header.classList.remove("nav-hidden");
        } else if (delta > 5) {
            header.classList.add("nav-hidden");
        } else if (delta < -5) {
            header.classList.remove("nav-hidden");
        }

        lastY = y;
        ticking = false;
    }
}
