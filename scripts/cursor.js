/*controles custom cursor: the dot sits on the pointer, the ring glides after it.
  One animation loop moves both, timed by the real time between frames, so it feels the same
  on a 60hz laptop, a 144hz monitor or a 4k screen at any windows scale*/
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const cursorFollow = 0.2;
const cursorGrow = 2;
const cursorPress = 0.8;
const cursorLinks = "a, button, label, input, textarea";

let pointerX = -100;
let pointerY = -100;
let ringX = -100;
let ringY = -100;
let ringScale = 1;
let isOverLink = false;
let isPressed = false;
let lastFrameTime = 0;
let cursorFrame = null;

// how much the ring catches up this frame: the same speed whatever the refresh rate of the screen
function catchUp(amount, frameTime) {
    return 1 - Math.pow(1 - amount, frameTime / (1000 / 60));
}

// one frame: the dot jumps to the pointer, the ring and its size glide after it
function moveCursor(time) {
    const frameTime = Math.min(time - (lastFrameTime || time), 100);
    lastFrameTime = time;
    const step = catchUp(cursorFollow, frameTime || 16.7);

    ringX += (pointerX - ringX) * step;
    ringY += (pointerY - ringY) * step;

    let targetScale = 1;
    if (isOverLink) targetScale = cursorGrow;
    if (isPressed) targetScale = cursorPress;
    ringScale += (targetScale - ringScale) * step;

    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorOutline.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`;

    // keep going until the ring has caught up, then rest until the mouse moves again
    const isMoving = Math.abs(pointerX - ringX) > 0.1 || Math.abs(pointerY - ringY) > 0.1 || Math.abs(targetScale - ringScale) > 0.01;
    cursorFrame = isMoving ? requestAnimationFrame(moveCursor) : null;
    if (!isMoving) lastFrameTime = 0;
}

// starts the loop if it is resting
function wakeCursor() {
    if (cursorFrame === null) cursorFrame = requestAnimationFrame(moveCursor);
}

/* only a real mouse moves the custom cursor, a finger or a pen keeps the normal one */
window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;

    // the first move: the ring starts on the pointer instead of flying in from the corner
    if (!document.body.classList.contains("cursor-visible")) {
        ringX = e.clientX;
        ringY = e.clientY;
    }

    pointerX = e.clientX;
    pointerY = e.clientY;
    // over something you can click: the ring fills in (the css turns it into an inverting disc)
    const isNowOverLink = Boolean(e.target.closest && e.target.closest(cursorLinks));
    if (isNowOverLink !== isOverLink) document.body.classList.toggle("cursor-on-link", isNowOverLink);
    isOverLink = isNowOverLink;
    document.body.classList.add("cursor-visible");
    document.body.classList.remove("cursor-away");
    wakeCursor();
}, { passive: true });

/* pressing the mouse button makes the ring smaller */
window.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    isPressed = true;
    wakeCursor();
});

/* letting go brings the ring back to its normal size */
window.addEventListener("pointerup", function () {
    isPressed = false;
    wakeCursor();
});

/* the mouse leaves the window: the cursor fades out instead of staying stuck at the edge */
document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) document.body.classList.add("cursor-away");
});
