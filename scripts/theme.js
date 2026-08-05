// controles the theme toggle, dark is default
const themeKey = "theme";
const themeRoot = document.documentElement;

// localStorage throws a SecurityError under file:// in Firefox and Safari
// (a valid origin restriction, not a bug). guard it — without this, the
// line below would throw and abort the whole script before it ever
// reaches the code that attaches the toggle button's click listener,
// leaving the toggle completely non-functional.
function readStoredTheme() {
    try {
        return localStorage.getItem(themeKey);
    } catch {
        return null;
    }
}

function writeStoredTheme(value) {
    try {
        localStorage.setItem(themeKey, value);
    } catch {
        // storage unavailable — the toggle still works for this page,
        // it just won't be remembered on the next visit
    }
}

themeRoot.dataset.theme = readStoredTheme() === "light" ? "light" : "dark";

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            themeRoot.dataset.theme = isLight() ? "dark" : "light";
            writeStoredTheme(themeRoot.dataset.theme);
            renderThemeButtons(buttons);
        });
    });

    renderThemeButtons(buttons);
});

function isLight() {
    return themeRoot.dataset.theme === "light";
}

// icon shows the theme you would switch to
function renderThemeButtons(buttons) {
    buttons.forEach((btn) => {
        btn.textContent = isLight() ? "[ ☀ ]" : "[ ☾ ]";
        btn.setAttribute("aria-label", isLight() ? "schakel donker thema in" : "schakel licht thema in");
    });
}
