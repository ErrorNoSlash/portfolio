/*controles the soft snapping on the one page: when you stop scrolling close to the start of a screen,
  the page glides the rest of the way so that screen fits the window. It never pulls you back into a screen
  you are reading, and any new scroll, key or touch stops it at once (the same on windows, mac, linux and phones)*/
const snapScreens = [...document.querySelectorAll(".screen")];
const snapNav = document.querySelector(".nav");
const snapDesktop = window.matchMedia("(min-width: 761px)");
const snapWaitTime = 180;
const snapGlideTime = 700;
const snapReach = 0.28;

let snapTimer = null;
let snapFrame = null;
let isSnapping = false;
let isTouching = false;

// soft start and soft stop
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// where the page has to be for a screen to start right under the nav (the first one: the very top of the page)
function screenStart(screen) {
    if (screen === snapScreens[0]) return 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const start = screen.getBoundingClientRect().top + window.scrollY - snapNav.offsetHeight;
    return Math.min(Math.max(start, 0), maxScroll);
}

// the closest screen start within reach, or nothing when you are reading in the middle of a screen
function findSnapTarget() {
    const now = window.scrollY;
    const room = window.innerHeight - snapNav.offsetHeight;
    let target = null;

    snapScreens.forEach(function (screen) {
        const start = screenStart(screen);
        const distance = Math.abs(start - now);
        if (distance < 2 || distance > window.innerHeight * snapReach) return;

        // going back up is only allowed into a screen that fits the window, so a tall screen never pulls you up
        if (start < now && screen.offsetHeight > room + 2) return;

        if (target === null || distance < Math.abs(target - now)) target = start;
    });

    return target;
}

// glides the page to a position, it stops as soon as the visitor does something
function glideTo(target) {
    const from = window.scrollY;
    const startTime = performance.now();
    isSnapping = true;

    function step(time) {
        const progress = Math.min((time - startTime) / snapGlideTime, 1);
        window.scrollTo({ top: from + (target - from) * easeInOutCubic(progress), behavior: "instant" });

        if (progress < 1 && isSnapping) {
            snapFrame = requestAnimationFrame(step);
        } else {
            isSnapping = false;
        }
    }

    snapFrame = requestAnimationFrame(step);
}

// stops a glide that is still going
function stopSnapping() {
    isSnapping = false;
    cancelAnimationFrame(snapFrame);
    clearTimeout(snapTimer);
}

// a short moment after the last scroll: snap if a screen start is close
function snapWhenStill() {
    clearTimeout(snapTimer);
    if (isSnapping || isTouching || !snapDesktop.matches) return;

    snapTimer = setTimeout(function () {
        const target = findSnapTarget();
        if (target !== null) glideTo(target);
    }, snapWaitTime);
}

/* every scroll waits again, so it only snaps once the page is still */
window.addEventListener("scroll", snapWhenStill, { passive: true });

/* the visitor takes over: a wheel, a key, a click on the scrollbar or a finger stops the glide */
["wheel", "keydown", "mousedown"].forEach(function (eventName) {
    window.addEventListener(eventName, stopSnapping, { passive: true });
});

/* a finger on the screen: no snapping until it lets go */
window.addEventListener("touchstart", function () {
    isTouching = true;
    stopSnapping();
}, { passive: true });

window.addEventListener("touchend", function () {
    isTouching = false;
    snapWhenStill();
}, { passive: true });
