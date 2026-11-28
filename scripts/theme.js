/*the light / dark toggle in the nav: dark is the default, light is remembered once picked.
  firstPaint.js already applied the saved choice before the page was drawn; this handles the button.
  going to light asks first: the site is made for dark, light is there for people who prefer it or
  need it for accessibility. pages and canvases that draw with the colors listen for "themechange"*/

const themeButtons = document.querySelectorAll(".theme-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let themeWarn = null;
let themeWarnFrom = null;

// the label for screen readers and the tooltip: what a click does
function labelThemeButtons() {
    const light = document.documentElement.dataset.theme === "light";
    themeButtons.forEach(function (button) {
        const text = light ? button.dataset.titleDark : button.dataset.titleLight;
        button.setAttribute("aria-label", text);
        button.title = text;
        button.setAttribute("aria-pressed", String(light));
    });
}

function setTheme(theme) {
    const html = document.documentElement;
    if (theme === "light") html.dataset.theme = "light";
    else delete html.dataset.theme;
    const bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.content = theme === "light" ? "#e4e4e4" : "#040507";
    try {
        if (theme === "light") localStorage.setItem("theme", "light");
        else localStorage.removeItem("theme");
    } catch (error) { }
    labelThemeButtons();
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
}

// a soft cross-fade where the browser can do it, an instant switch otherwise
function switchTheme(theme) {
    if (document.startViewTransition && !reduceMotion.matches) {
        document.startViewTransition(function () { setTheme(theme); });
    } else {
        setTheme(theme);
    }
}

function closeThemeWarn(focusBack) {
    if (!themeWarn || !themeWarn.classList.contains("is-shown")) return;
    themeWarn.classList.remove("is-shown");
    themeWarnFrom.setAttribute("aria-expanded", "false");
    if (focusBack) themeWarnFrom.focus();
}

// the card under the toggle: switch to light, or stay dark (the suggested answer, focused first)
function openThemeWarn(button) {
    if (!themeWarn) {
        themeWarn = document.createElement("div");
        themeWarn.className = "theme-warn";
        themeWarn.id = "theme-warn";
        themeWarn.setAttribute("role", "dialog");
        themeWarn.setAttribute("aria-labelledby", "theme-warn-head");
        themeWarn.setAttribute("aria-describedby", "theme-warn-body");
        const head = document.createElement("strong");
        head.id = "theme-warn-head";
        head.textContent = button.dataset.warnHead;
        const body = document.createElement("span");
        body.id = "theme-warn-body";
        body.textContent = button.dataset.warnBody;
        const actions = document.createElement("div");
        actions.className = "theme-warn-actions";
        const yes = document.createElement("button");
        yes.type = "button";
        yes.className = "pill theme-warn-yes";
        yes.textContent = button.dataset.warnYes;
        yes.addEventListener("click", function () { closeThemeWarn(true); switchTheme("light"); });
        const no = document.createElement("button");
        no.type = "button";
        no.className = "pill theme-warn-no";
        no.textContent = button.dataset.warnNo;
        no.addEventListener("click", function () { closeThemeWarn(true); });
        actions.append(yes, no);
        themeWarn.append(head, body, actions);
        document.body.append(themeWarn);
    }
    themeWarnFrom = button;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "theme-warn");
    // just under the toggle, right edges lined up (kept on screen on small phones)
    const box = button.getBoundingClientRect();
    themeWarn.style.top = Math.round(box.bottom + 10) + "px";
    themeWarn.style.right = Math.max(12, Math.round(window.innerWidth - box.right)) + "px";
    requestAnimationFrame(function () {
        themeWarn.classList.add("is-shown");
        themeWarn.querySelector(".theme-warn-no").focus({ preventScroll: true });
    });
}

themeButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
        e.stopPropagation();
        if (document.documentElement.dataset.theme === "light") {
            // back to dark needs no question
            switchTheme("dark");
        } else if (themeWarn && themeWarn.classList.contains("is-shown")) {
            closeThemeWarn(false);
        } else {
            openThemeWarn(button);
        }
    });
});

// the card closes with escape, a click elsewhere, or when the page scrolls
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeThemeWarn(true);
});
document.addEventListener("click", function (e) {
    if (themeWarn && !themeWarn.contains(e.target)) closeThemeWarn(false);
});
window.addEventListener("scroll", function () { closeThemeWarn(false); }, { passive: true });

// another tab switched: follow it
window.addEventListener("storage", function (e) {
    if (e.key === "theme") setTheme(e.newValue === "light" ? "light" : "dark");
});

labelThemeButtons();
