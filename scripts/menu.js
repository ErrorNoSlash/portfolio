/*the menu pill (phones) blurs the page and opens the menu panel*/
const veil = document.querySelector("#veil");
const sheet = document.querySelector(".sheet");
const menuPill = document.querySelector(".nav-tabs a[href='#menu']");
let wasOpenedByPill = false;

function showMenu(isOpen) {
    veil.classList.toggle("is-open", isOpen);
    veil.setAttribute("aria-hidden", String(!isOpen));
    sheet.toggleAttribute("inert", isOpen);
    menuPill.classList.toggle("is-active", isOpen);

    if (isOpen) {
        veil.querySelector("[data-close]").focus();
    } else if (wasOpenedByPill) {
        menuPill.focus();
        wasOpenedByPill = false;
    }
}

function closeMenu() {
    showMenu(false);
    if (location.hash === "#menu") history.replaceState(null, "", location.pathname + location.search);
}

menuPill.addEventListener("click", function (e) {
    e.preventDefault();
    wasOpenedByPill = true;
    showMenu(true);
    history.replaceState(null, "", "#menu");
});

/* a click on the blur, the close button or a link closes the menu */
veil.addEventListener("click", function (e) {
    if (e.target === veil || e.target.closest("[data-close]")) closeMenu();
    else if (e.target.closest("a")) {
        wasOpenedByPill = false;
        showMenu(false);
    }
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && veil.classList.contains("is-open")) closeMenu();
});

window.addEventListener("hashchange", function () {
    showMenu(location.hash === "#menu");
});

// back on a wide screen the pill is hidden, so the menu closes too
window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) {
    if (e.matches && veil.classList.contains("is-open")) closeMenu();
});

showMenu(location.hash === "#menu");
