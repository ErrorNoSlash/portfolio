// controles the theme toggle, dark is default
const themeKey = "theme";
const themeRoot = document.documentElement;

themeRoot.dataset.theme = localStorage.getItem(themeKey) === "light" ? "light" : "dark";

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            themeRoot.dataset.theme = isLight() ? "dark" : "light";
            localStorage.setItem(themeKey, themeRoot.dataset.theme);
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
