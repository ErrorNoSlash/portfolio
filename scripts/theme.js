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
