/*
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (cursor && finePointer.matches) {
    let shown = false;
    let framed = null;
    let lastX = 0, lastY = 0;
    let firstMove = true;
    const PAD = 6;

    function moveTo(x, y) {
        const posX = x - cursor.offsetWidth / 2;
        const posY = y - cursor.offsetHeight / 2;
        cursor.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    document.addEventListener("mousemove", (e) => {
        if (firstMove) {
            firstMove = false;
            return;
        }

        lastX = e.clientX;
        lastY = e.clientY;

        if (!shown) {
            cursor.classList.add("visible");
            shown = true;
        }
        
        if (framed) return;

        moveTo(lastX, lastY);
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
        moveTo(lastX, lastY);
    }

    document.addEventListener("mouseover", (e) => {
        if (!shown) return;

        const btn = e.target.closest(".btn");
        if (btn) {
            frame(btn);
            return;
        }
        if (e.target.closest("a, button")) cursor.classList.add("on-link");
    });

    document.addEventListener("mouseout", (e) => {
        const btn = e.target.closest(".btn");
        if (btn) {
            if (!e.relatedTarget || !btn.contains(e.relatedTarget)) unframe();
            return;
        }
        if (e.target.closest("a, button")) cursor.classList.remove("on-link");
    });

    window.addEventListener("scroll", () => {
        if (framed) frame(framed);
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("visible");
        shown = false;
    });
}
*/

/*controles custom cursor*/
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.style.left = `${posY}px`;
    cursorOutline.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" })
})
