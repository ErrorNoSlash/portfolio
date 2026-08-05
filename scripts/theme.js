// controles the theme toggle, dark is default
const themeKey = "theme";
const themeRoot = document.documentElement;

// localStorage can throw (SecurityError under file:// in Firefox/Safari,
// storage/cookies blocked by the user, private-browsing quota limits in
// older Safari, etc.) — guard every access so a thrown error can't abort
// the script before it reaches the code that attaches the toggle button's
// click listener. worst case without storage: the toggle still works for
// the current page, it just won't be remembered on the next visit.
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
        // ignore — see note above
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
