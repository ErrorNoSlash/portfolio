// controls the theme toggle. dark is the default (no "auto"/system-preference
// mode — this site deliberately always starts dark unless the visitor has
// chosen light before). structured after the standard render-blocking
// pattern for avoiding a flash of unthemed content: this script is placed
// in <head> without `defer`, right after the stylesheets, so data-theme is
// set on <html> before the browser paints anything.
const THEME_KEY = "theme";
const THEME_OWNER = document.documentElement;

const cachedTheme = localStorage.getItem(THEME_KEY);
THEME_OWNER.dataset.theme = cachedTheme === "light" ? "light" : "dark";

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = isLight() ? "dark" : "light";
            THEME_OWNER.dataset.theme = next;
            localStorage.setItem(THEME_KEY, next);
            renderThemeButtons(buttons);
        });
    });

    renderThemeButtons(buttons);
});

function isLight() {
    return THEME_OWNER.dataset.theme === "light";
}

// icon shows the theme you would switch to
function renderThemeButtons(buttons) {
    buttons.forEach((btn) => {
        btn.textContent = isLight() ? "[ ☀ ]" : "[ ☾ ]";
        btn.setAttribute("aria-label", isLight() ? "schakel donker thema in" : "schakel licht thema in");
    });
}
