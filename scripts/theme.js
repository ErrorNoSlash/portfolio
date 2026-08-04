// controls the theme toggle. dark is the default (no "auto"/system-preference
// mode — this site deliberately always starts dark unless the visitor has
// chosen light before). structured after the standard render-blocking
// pattern for avoiding a flash of unthemed content: this script is placed
// in <head> without `defer`, right after the stylesheets, so data-theme is
// set on <html> before the browser paints anything.
//
// theme is carried two ways at once:
//  - localStorage, the standard approach — works seamlessly across pages on
//    any real http(s) origin, and persists across visits.
//  - a `?theme=light` URL param, kept in sync via history.replaceState and
//    added to internal links by transition.js. this exists specifically
//    because localStorage does not reliably share across separate pages
//    under file://, which many browsers scope per-file or restrict storage
//    on entirely — the URL param has no such dependency, since it's plain
//    navigation state rather than a storage API call.
// dark stays the default either way, so its URLs stay clean; only light
// adds the param.
const THEME_KEY = "theme";
const THEME_OWNER = document.documentElement;

function readStoredTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function writeStoredTheme(value) {
    try {
        localStorage.setItem(THEME_KEY, value);
    } catch {
        // storage unavailable — the URL param still carries the theme
    }
}

function syncThemeParam(value) {
    try {
        const url = new URL(location.href);
        if (value === "light") {
            url.searchParams.set("theme", "light");
        } else {
            url.searchParams.delete("theme");
        }
        history.replaceState(history.state, "", url);
    } catch {
        // ignore — worst case the URL just won't carry the theme forward
    }
}

const urlTheme = new URLSearchParams(location.search).get("theme");
const initialTheme = urlTheme === "light" ? "light" : (readStoredTheme() === "light" ? "light" : "dark");

THEME_OWNER.dataset.theme = initialTheme;
writeStoredTheme(initialTheme);
syncThemeParam(initialTheme);

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = isLight() ? "dark" : "light";
            THEME_OWNER.dataset.theme = next;
            writeStoredTheme(next);
            syncThemeParam(next);
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
