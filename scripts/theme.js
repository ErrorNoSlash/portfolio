// theme toggle, dark default — light matches blog.errornoslash.be
const themeKey = "theme";
const themeRoot = document.documentElement;

themeRoot.dataset.theme =
    localStorage.getItem(themeKey) === "light" ? "light" : "dark";

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".theme-toggle");
    const isLight = () => themeRoot.dataset.theme === "light";

    // icon shows the theme you'd switch to
    const render = () => {
        buttons.forEach((btn) => {
            btn.textContent = isLight() ? "[ \u2600 ]" : "[ \u263E ]";
            btn.setAttribute(
                "aria-label",
                isLight() ? "schakel donker thema in" : "schakel licht thema in"
            );
        });
    };

    buttons.forEach((btn) =>
        btn.addEventListener("click", () => {
            themeRoot.dataset.theme = isLight() ? "dark" : "light";
            localStorage.setItem(themeKey, themeRoot.dataset.theme);
            render();
        })
    );

    render();
});
