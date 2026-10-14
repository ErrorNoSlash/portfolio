/*controles custom cursor*/
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

/* runs on every mouse move */
window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    document.body.classList.add("cursor-visible");

    /* the dot follows the pointer right away, both move with transform so it stays smooth on slow screens */
    cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;

    /* the ring trails behind for half a second */
    cursorOutline.animate({
        transform: `translate(${posX}px, ${posY}px)`
    }, { duration: 500, fill: "forwards" })
})
