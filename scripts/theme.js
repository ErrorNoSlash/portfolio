/*the light / dark toggle in the nav: dark is the default, light is remembered once picked.
  firstPaint.js already applied the saved choice before the page was drawn; this only handles the
  button. pages and canvases that draw with the colors listen for "themechange" and redraw*/

const themeButtons = document.querySelectorAll(".theme-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        // a soft cross-fade where the browser can do it, an instant switch otherwise
        if (document.startViewTransition && !reduceMotion.matches) {
            document.startViewTransition(function () { setTheme(next); });
        } else {
            setTheme(next);
        }
    });
});

// another tab switched: follow it
window.addEventListener("storage", function (e) {
    if (e.key === "theme") setTheme(e.newValue === "light" ? "light" : "dark");
});

labelThemeButtons();
