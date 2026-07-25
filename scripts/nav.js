// controles the mobile nav toggle
const nav = document.querySelector("header nav");
const navToggle = document.getElementById("nav-toggle");

if (nav && navToggle) {
    // brackets stay put, "menu" and "x" roll through the slot between them.
    // aria-label carries the real label, so all of this is decorative
    navToggle.innerHTML =
        '<span aria-hidden="true">[</span>' +
        '<span class="nav-toggle-slot" aria-hidden="true">' +
            '<span class="nav-toggle-word word-open">menu</span>' +
            '<span class="nav-toggle-word word-close">x</span>' +
        '</span>' +
        '<span aria-hidden="true">]</span>';

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

// social links dropdown (desktop): click the trigger to open/close
document.querySelectorAll(".nav-socials").forEach((box) => {
    const toggle = box.querySelector(".nav-social-toggle");
    const menu = box.querySelector(".nav-social-menu");
    if (!toggle || !menu) return;

    toggle.setAttribute("aria-expanded", "false");

    const close = () => {
        box.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = box.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    // choosing a link closes the dropdown
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    // click outside or press Escape closes it
    document.addEventListener("click", (e) => {
        if (!box.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });
});
