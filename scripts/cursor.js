// controls the crosshair cursor, desktop only
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (cursor && finePointer.matches) {
    let shown = false;
    let framed = null;
    let lastX = 0;
    let lastY = 0;
    const PAD = 6;

    function moveTo(x, y) {
        const posX = x - cursor.offsetWidth / 2;
        const posY = y - cursor.offsetHeight / 2;
        cursor.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    function show() {
        if (shown) return;
        cursor.classList.add("visible");
        shown = true;
    }

    function hide() {
        cursor.classList.remove("visible", "framing", "on-link");
        cursor.style.width = "";
        cursor.style.height = "";
        framed = null;
        shown = false;
    }

    function frame(el) {
        const r = el.getBoundingClientRect();

        cursor.style.width = `${r.width + PAD * 2}px`;
        cursor.style.height = `${r.height + PAD * 2}px`;
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

    // Find the actual element under the pointer instead of relying on a
    // delegated mouseover/mouseout pair. This avoids stale hover state when
    // moving between nested elements, SVGs, buttons, and links.
    function syncTarget() {
        if (!shown || document.documentElement.classList.contains("transitioning")) {
            return;
        }

        const target = document.elementFromPoint(lastX, lastY);
        const btn = target && target.closest ? target.closest(".btn") : null;

        if (btn) {
            if (framed !== btn) frame(btn);
            return;
        }

        if (framed) {
            unframe();
        }

        if (target && target.closest && target.closest("a, button")) {
            cursor.classList.add("on-link");
        } else {
            cursor.classList.remove("on-link");
        }
    }

    document.addEventListener("pointermove", (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;

        lastX = e.clientX;
        lastY = e.clientY;

        // During the page transition the old page is still underneath the
        // overlay. Keep the pointer position, but don't calculate hover state
        // until the new page is visible.
        if (document.documentElement.classList.contains("transitioning")) {
            return;
        }

        show();

        // Always position from the real pointer coordinates. Do not use
        // movementX/movementY: browsers can legitimately report 0 movement
        // when the pointer re-enters a window or after a navigation.
        if (!framed) moveTo(lastX, lastY);
        syncTarget();
    });

    // The transition script removes .transitioning without necessarily
    // generating another pointer event. Re-sync once the new page is ready.
    const transitionObserver = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("transitioning") && shown) {
            moveTo(lastX, lastY);
            syncTarget();
        }
    });

    transitionObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Keep a button frame aligned with the viewport while scrolling.
    window.addEventListener("scroll", () => {
        if (framed) frame(framed);
    }, { passive: true });

    // If the pointer leaves the browser window, reset everything. The next
    // pointermove will start from the actual pointer location again.
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
}
