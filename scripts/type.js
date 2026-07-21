// controles the typed hero line
document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("typed-line");
    if (!target) return;

    const text = "hey ik ben dias stas";
    const cursor = target.querySelector(".cursor-block");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
        target.insertBefore(document.createTextNode(text), cursor);
        return;
    }

    let i = 0;
    const type = () => {
        if (i >= text.length) return;
        target.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 60 + Math.random() * 60);
    };

    // wait for the boot screen to (mostly) finish
    const bootShowing = document.querySelector(".boot") !== null;
    setTimeout(type, bootShowing ? 1600 : 400);
});
