// controles the theme toggle, dark is default every fresh visit. carried
// across pages primarily via a `?theme=light` URL param — set on every
// internal link by transition.js, and kept in sync with this page's own
// history entry below — since sessionStorage alone doesn't reliably share
// across separate pages under file://. sessionStorage is kept as a same-tab
// fallback for pages reached outside the transition system (typed URLs,
// bookmarks, etc.) on origins where it does work.
const themeKey = "theme-v2";
const themeRoot = document.documentElement;

function readStoredTheme() {
    try {
        return sessionStorage.getItem(themeKey);
    } catch {
        return null;
    }
}

function writeStoredTheme(value) {
    try {
        sessionStorage.setItem(themeKey, value);
    } catch {
        // storage unavailable (e.g. file://) — the URL param below still
        // carries the theme across page transitions regardless
    }
}

// keep this page's own address/history entry in sync with the theme, so
// the browser's back/forward buttons restore the right one. dark is the
// default, so its URLs stay clean — only light adds the param.
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

themeRoot.dataset.theme = initialTheme;
writeStoredTheme(initialTheme);
syncThemeParam(initialTheme);

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            themeRoot.dataset.theme = isLight() ? "dark" : "light";
            writeStoredTheme(themeRoot.dataset.theme);
            syncThemeParam(themeRoot.dataset.theme);
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
