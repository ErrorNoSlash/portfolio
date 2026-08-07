// Controls the theme toggle and persists the choice across page navigation.
// Dark is the default theme.

const themeKey = "theme";
const themeRoot = document.documentElement;

function readCookieTheme() {
    const match = document.cookie.match(/(?:^|;\s*)theme=(light|dark)(?:;|$)/);
    return match ? match[1] : null;
}

function readStoredTheme() {
    // localStorage is the primary store. Some Firefox/privacy configurations
    // can deny storage access, so keep a cookie as a same-origin fallback.
    try {
        const value = localStorage.getItem(themeKey);
        if (value === "light" || value === "dark") return value;
    } catch {
        // Fall through to the cookie.
    }

    return readCookieTheme();
}

function writeStoredTheme(value) {
    try {
        localStorage.setItem(themeKey, value);
    } catch {
        // The cookie below is the fallback when localStorage is unavailable.
    }

    // Explicitly set Path=/ so the theme is shared by index.html and pages/*
    // on the same origin. Max-Age keeps it across browser sessions.
    try {
        document.cookie = `${themeKey}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch {
        // If both storage mechanisms are blocked, the current page still works.
    }
}

function applyStoredTheme() {
    const stored = readStoredTheme();
    themeRoot.dataset.theme = stored === "light" ? "light" : "dark";
}

function isLight() {
    return themeRoot.dataset.theme === "light";
}

// Apply before the rest of the page is rendered so every page starts with
// exactly the same theme as the previous page.
applyStoredTheme();

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const nextTheme = isLight() ? "dark" : "light";

            // Update the DOM first for immediate visual feedback, then persist.
            themeRoot.dataset.theme = nextTheme;
            writeStoredTheme(nextTheme);
            renderThemeButtons(buttons);
        });
    });

    renderThemeButtons(buttons);
});

// If a page is restored from Firefox's back/forward cache, re-apply the
// persisted value instead of relying on the cached DOM state.
window.addEventListener("pageshow", () => {
    applyStoredTheme();
    renderThemeButtons(document.querySelectorAll(".theme-toggle"));
});

// Icon shows the theme you would switch to.
function renderThemeButtons(buttons) {
    buttons.forEach((btn) => {
        btn.textContent = isLight() ? "[ ☀ ]" : "[ ☾ ]";
        btn.setAttribute(
            "aria-label",
            isLight() ? "schakel donker thema in" : "schakel licht thema in"
        );
    });
}
