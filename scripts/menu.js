/*the menu pill (phones) blurs the page and opens the menu panel*/
const veil = document.querySelector("#veil");
const sheet = document.querySelector(".sheet");
const menuPill = document.querySelector(".nav-tabs a[href='#menu']");
let wasOpenedByPill = false;
let lastPressPoint = null;

// opens or closes the menu: the blur, the page behind it and the focus go along
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

// closes the menu and takes #menu out of the address bar
function closeMenu() {
    showMenu(false);
    if (location.hash === "#menu") history.replaceState(null, "", location.pathname + location.search);
}

/* remember where the finger or mouse really went down, phones move the click to the nearest button */
document.addEventListener("pointerdown", function (e) {
    lastPressPoint = { x: e.clientX, y: e.clientY };
});

/* a key press has no point, so it is always allowed */
document.addEventListener("keydown", function () {
    lastPressPoint = null;
});

// was the last press really on this element (not just close to it)?
function isPressInside(element) {
    if (!lastPressPoint) return true;

    const box = element.getBoundingClientRect();
    return lastPressPoint.x >= box.left && lastPressPoint.x <= box.right
        && lastPressPoint.y >= box.top && lastPressPoint.y <= box.bottom;
}

/* the menu pill opens it, but only when the press really was on the pill: a tap next to it does nothing */
menuPill.addEventListener("click", function (e) {
    e.preventDefault();
    if (!isPressInside(menuPill)) return;

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

/* Escape closes it */
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && veil.classList.contains("is-open")) closeMenu();
});

/* back / forward: #menu in the address opens it, anything else closes it */
window.addEventListener("hashchange", function () {
    showMenu(location.hash === "#menu");
});

// back on a wide screen the pill is hidden, so the menu closes too
window.matchMedia("(min-width: 761px)").addEventListener("change", function (e) {
    if (e.matches && veil.classList.contains("is-open")) closeMenu();
});

showMenu(location.hash === "#menu");
