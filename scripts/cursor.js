// crosshair cursor, desktop / fine pointers only
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (cursor && finePointer.matches) {
    let shown = false;

    document.addEventListener("mousemove", (e) => {
        cursor.style.transform =
            `translate(${e.clientX - cursor.offsetWidth / 2}px, ${e.clientY - cursor.offsetHeight / 2}px)`;
        if (!shown) {
            cursor.classList.add("visible");
            shown = true;
        }
    });

    // reticle over links and buttons
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest("a, button")) cursor.classList.add("on-link");
    });
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest("a, button")) cursor.classList.remove("on-link");
    });

    // hide when the pointer leaves the window
    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("visible");
        shown = false;
    });
}
