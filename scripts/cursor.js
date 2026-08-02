// controls the crosshair cursor, desktop only
const cursor = document.getElementById("cursor");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (cursor && finePointer.matches) {
    const POINTER_KEY = "cursorPosition";
    const PAD = 6;

    let shown = false;
    let framed = null;
    let lastX = null;
    let lastY = null;

    function moveTo(x, y) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;

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
        cursor.classList.remove("visible");
        shown = false;
        framed = null;
        cursor.style.width = "";
        cursor.style.height = "";
        cursor.classList.remove("framing", "on-link");
    }

    function setPointer(x, y) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        lastX = x;
        lastY = y;
        moveTo(x, y);
        show();
    }

    function frame(el) {
        if (!el || !el.isConnected) {
            unframe();
            return;
        }

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

        if (lastX !== null && lastY !== null) {
            moveTo(lastX, lastY);
        }
    }

    // Determine the actual element under the pointer instead of depending on
    // mouseover/mouseout bubbling. This also works after a full page transition.
    function syncHover() {
        if (lastX === null || lastY === null) return;

        const target = document.elementFromPoint(lastX, lastY);
        const btn = target && target.closest ? target.closest(".btn") : null;
        const link = target && target.closest ? target.closest("a, button") : null;

        if (btn) {
            frame(btn);
        } else {
            unframe();
            cursor.classList.toggle("on-link", !!link);
        }
    }

    // A browser navigation creates a new document, so the new cursor instance
    // cannot receive the old page's mousemove event. Save the pointer location
    // before navigation and restore it immediately on the next page.
    function savePointer() {
        if (lastX === null || lastY === null) return;

        try {
            sessionStorage.setItem(POINTER_KEY, JSON.stringify({
                x: lastX,
                y: lastY,
                time: Date.now()
            }));
        } catch (_) {
            // sessionStorage can be unavailable in restricted browsing modes.
        }
    }

    function restorePointer() {
        try {
            const raw = sessionStorage.getItem(POINTER_KEY);
            if (!raw) return false;

            const point = JSON.parse(raw);
            sessionStorage.removeItem(POINTER_KEY);

            if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;

            // Only restore a position that came from the immediately preceding
            // navigation. Never resurrect an old cursor position on a later visit.
            if (!Number.isFinite(point.time) || Date.now() - point.time > 5000) return false;

            lastX = Math.max(0, Math.min(window.innerWidth, point.x));
            lastY = Math.max(0, Math.min(window.innerHeight, point.y));
            moveTo(lastX, lastY);
            show();
            return true;
        } catch (_) {
            return false;
        }
    }

    // Track real pointer movement continuously, including while the transition
    // overlay is visible. Do not gate this on the transition state.
    document.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;

        setPointer(e.clientX, e.clientY);

        if (!framed) {
            syncHover();
        }
    });

    // The pointer can already be sitting over a link when the new document lands.
    // Re-run hit testing whenever the transition class is removed.
    const transitionObserver = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("transitioning")) {
            requestAnimationFrame(() => syncHover());
        }
    });

    transitionObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Save the exact pointer position before the transition's navigation happens.
    document.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") {
            lastX = e.clientX;
            lastY = e.clientY;
            savePointer();
        }
    }, true);

    window.addEventListener("scroll", () => {
        if (framed) {
            frame(framed);
        } else if (lastX !== null && lastY !== null) {
            moveTo(lastX, lastY);
        }
    }, { passive: true });

    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    // Restore the pointer immediately after this document loads. This is the
    // critical hand-off that keeps the cursor alive across page transitions even
    // when the browser emits no mousemove event on the new document.
    restorePointer();

    // If there was no navigation hand-off, let the normal first pointermove
    // initialize the cursor. Also sync once after DOM/layout is ready.
    window.addEventListener("pageshow", () => {
        if (lastX !== null && lastY !== null) {
            moveTo(lastX, lastY);
            syncHover();
        }
    });
}
