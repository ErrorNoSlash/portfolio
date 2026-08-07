// Controls the theme toggle. Dark is the default.
const themeKey = "theme";
const themeRoot = document.documentElement;

function readCookieTheme() {
    const match = document.cookie.match(/(?:^|;\s*)theme=(light|dark)(?:;|$)/);
    return match ? match[1] : null;
}

function readStoredTheme() {
    // Cookie is a same-origin fallback for browsers/privacy modes where
    // localStorage is unavailable or unreliable.
    const cookieTheme = readCookieTheme();
    if (cookieTheme) return cookieTheme;

    try {
        const stored = localStorage.getItem(themeKey);
        return stored === "light" || stored === "dark" ? stored : null;
    } catch {
        return null;
    }
}

function writeStoredTheme(value) {
    try {
        localStorage.setItem(themeKey, value);
    } catch {
        // Cookie below remains available when localStorage is blocked.
    }

    try {
        document.cookie = `${themeKey}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch {
        // The theme still applies to the current page.
    }
}

function applyStoredTheme() {
    themeRoot.dataset.theme = readStoredTheme() === "light" ? "light" : "dark";
}

function isLight() {
    return themeRoot.dataset.theme === "light";
}

function renderThemeButtons(buttons) {
    buttons.forEach((btn) => {
        btn.textContent = isLight() ? "[ ☀ ]" : "[ ☾ ]";
        btn.setAttribute(
            "aria-label",
            isLight() ? "schakel donker thema in" : "schakel licht thema in"
        );
    });
}

// Apply before the first paint on every page.
applyStoredTheme();

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const nextTheme = isLight() ? "dark" : "light";
            themeRoot.dataset.theme = nextTheme;
            writeStoredTheme(nextTheme);
            renderThemeButtons(buttons);
        });
    });

    renderThemeButtons(buttons);
});

// Firefox can restore a page from its back/forward cache without executing
// the head scripts again. Re-apply the persisted theme when that happens.
window.addEventListener("pageshow", () => {
    applyStoredTheme();
    renderThemeButtons(document.querySelectorAll(".theme-toggle"));
});
