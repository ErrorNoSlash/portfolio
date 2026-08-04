// controls the crosshair cursor, desktop only
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (cursor && finePointer.matches) {
    let shown = false;
    let framed = null; // the .chips button the cursor is currently wrapped around
    const PAD = 6;      // px the frame sits outside the button

    document.addEventListener("mousemove", (e) => {
        if (!shown) {
            cursor.classList.add("visible");
            shown = true;
        }
        // while wrapped around a button, stay locked to it instead of following
        if (framed) return;

        const posX = e.clientX - cursor.offsetWidth / 2;
        const posY = e.clientY - cursor.offsetHeight / 2;
        cursor.style.transform = `translate(${posX}px, ${posY}px)`;
    });

    function frame(el) {
        const r = el.getBoundingClientRect();
        cursor.style.width = r.width + PAD * 2 + "px";
        cursor.style.height = r.height + PAD * 2 + "px";
        cursor.style.transform = `translate(${r.left - PAD}px, ${r.top - PAD}px)`;
        cursor.classList.add("framing", "on-link");
        framed = el;
    }

    function unframe() {
        cursor.style.width = "";
        cursor.style.height = "";
        cursor.classList.remove("framing", "on-link");
        framed = null;
    }

    document.addEventListener("mouseover", (e) => {
        const btn = e.target.closest(".chips button");
        if (btn) {
            frame(btn);
            return;
        }
        // other links/commands keep the small reticle that follows the pointer
        if (e.target.closest("a, button, .cmd")) cursor.classList.add("on-link");
    });

    document.addEventListener("mouseout", (e) => {
        const btn = e.target.closest(".chips button");
        if (btn) {
            // ignore moves that stay inside the same button
            if (!e.relatedTarget || !btn.contains(e.relatedTarget)) unframe();
            return;
        }
        if (e.target.closest("a, button, .cmd")) cursor.classList.remove("on-link");
    });

    // keep the frame aligned if the terminal output scrolls while hovering a button
    window.addEventListener("scroll", () => {
        if (framed) frame(framed);
    }, { passive: true, capture: true });

    // hide when the pointer leaves the window
    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("visible");
        shown = false;
    });
}
