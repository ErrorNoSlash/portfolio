/*controles the dot field under the big title: a grid of dots that waves on its own, lights up around the mouse
  (or finger) and ripples out from every click. In the middle it works like an led sign: words light up dot by dot,
  long ones scroll by, and anything you type on the page shows up on it*/
const dotField = document.querySelector("#dot-field");
const dotCanvas = dotField.querySelector("canvas");
const dotContext = dotCanvas.getContext("2d");
const dotTitle = dotField.closest(".title");

// what the sign says, one after the other
const signMessages = ["HALLO WERELD", "WELKOM!", "TYP IETS...", "KLIK MAAR!", "SUDO ZEG HALLO", "SCROLL VERDER"];

// 5 x 7 dot-matrix letters: every letter is 7 rows of 5 dots, 1 is lit
const signFont = {
    "A": "01110|10001|10001|11111|10001|10001|10001",
    "B": "11110|10001|10001|11110|10001|10001|11110",
    "C": "01110|10001|10000|10000|10000|10001|01110",
    "D": "11110|10001|10001|10001|10001|10001|11110",
    "E": "11111|10000|10000|11110|10000|10000|11111",
    "F": "11111|10000|10000|11110|10000|10000|10000",
    "G": "01110|10001|10000|10111|10001|10001|01111",
    "H": "10001|10001|10001|11111|10001|10001|10001",
    "I": "01110|00100|00100|00100|00100|00100|01110",
    "J": "00111|00010|00010|00010|00010|10010|01100",
    "K": "10001|10010|10100|11000|10100|10010|10001",
    "L": "10000|10000|10000|10000|10000|10000|11111",
    "M": "10001|11011|10101|10101|10001|10001|10001",
    "N": "10001|10001|11001|10101|10011|10001|10001",
    "O": "01110|10001|10001|10001|10001|10001|01110",
    "P": "11110|10001|10001|11110|10000|10000|10000",
    "Q": "01110|10001|10001|10001|10101|10010|01101",
    "R": "11110|10001|10001|11110|10100|10010|10001",
    "S": "01111|10000|10000|01110|00001|00001|11110",
    "T": "11111|00100|00100|00100|00100|00100|00100",
    "U": "10001|10001|10001|10001|10001|10001|01110",
    "V": "10001|10001|10001|10001|10001|01010|00100",
    "W": "10001|10001|10001|10101|10101|10101|01010",
    "X": "10001|10001|01010|00100|01010|10001|10001",
    "Y": "10001|10001|01010|00100|00100|00100|00100",
    "Z": "11111|00001|00010|00100|01000|10000|11111",
    "0": "01110|10001|10011|10101|11001|10001|01110",
    "1": "00100|01100|00100|00100|00100|00100|01110",
    "2": "01110|10001|00001|00010|00100|01000|11111",
    "3": "11111|00010|00100|00010|00001|10001|01110",
    "4": "00010|00110|01010|10010|11111|00010|00010",
    "5": "11111|10000|11110|00001|00001|10001|01110",
    "6": "00110|01000|10000|11110|10001|10001|01110",
    "7": "11111|00001|00010|00100|01000|01000|01000",
    "8": "01110|10001|10001|01110|10001|10001|01110",
    "9": "01110|10001|10001|01111|00001|00010|01100",
    " ": "00000|00000|00000|00000|00000|00000|00000",
    "!": "00100|00100|00100|00100|00100|00000|00100",
    "?": "01110|10001|00001|00010|00100|00000|00100",
    ".": "00000|00000|00000|00000|00000|01100|01100",
    ",": "00000|00000|00000|00000|01100|00100|01000",
    "-": "00000|00000|00000|11111|00000|00000|00000",
    "/": "00001|00001|00010|00100|01000|10000|10000",
    ":": "00000|01100|01100|00000|01100|01100|00000",
    "'": "01100|00100|01000|00000|00000|00000|00000",
    "&": "01100|10010|10100|01000|10101|10010|01101",
    "@": "01110|10001|00001|01101|10101|10101|01110",
    "#": "01010|01010|11111|01010|11111|01010|01010",
    "*": "00000|00100|10101|01110|10101|00100|00000",
    "+": "00000|00100|00100|11111|00100|00100|00000",
    "=": "00000|00000|11111|00000|11111|00000|00000",
    "_": "00000|00000|00000|00000|00000|00000|11111"
};

const dotSpacing = 22;
const dotRadius = 1.8;
const signRadius = 8.5;
const pointerReach = 150;
const rippleSpeed = 0.45;
const rippleWidth = 70;
const rippleLife = 2200;
const signStartDelay = 1400;
const signWipeIn = 900;
const signHold = 2400;
const signWipeOut = 700;
const signPopTime = 260;
const signScanTime = 1100;
const signScrollSpeed = 14;
const signTypedHold = 5000;
const signTypedMax = 24;
const minimumFieldHeight = 190;

let dotColumns = 0;
let dotRows = 0;
let dotColor = "#000";
let pointer = null;
let ripples = [];
let isFieldVisible = false;
let isFieldDrawing = false;
let messageIndex = 0;
let messageStart = performance.now() + signStartDelay;
let signTypedText = "";
let signLastTyped = 0;
const fieldStartTime = performance.now();
const isFieldStill = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* the field only shows when there is room under the word (otherwise the title just keeps the word) */
function checkFieldRoom() {
    dotTitle.classList.add("has-room");
    if (dotField.clientHeight < minimumFieldHeight) dotTitle.classList.remove("has-room");
    sizeField();
}

// the canvas matches the field in real pixels, so the dots stay sharp on every screen
function sizeField() {
    const ratio = window.devicePixelRatio || 1;
    const width = dotField.clientWidth;
    const height = dotField.clientHeight;

    dotCanvas.width = Math.round(width * ratio);
    dotCanvas.height = Math.round(height * ratio);
    dotContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    dotColumns = Math.floor(width / dotSpacing);
    dotRows = Math.floor(height / dotSpacing);

    readDotColor();
    if (isFieldStill) drawField(performance.now());
}

function readDotColor() {
    dotColor = getComputedStyle(dotField).color;
}

// the lit dots of a text: every letter is 5 dots wide with one empty column after it
function textDots(text) {
    const dots = [];
    [...text].forEach(function (letter, index) {
        const glyph = signFont[letter] || signFont["?"];
        glyph.split("|").forEach(function (line, row) {
            [...line].forEach(function (dot, column) {
                if (dot === "1") dots.push({ column: index * 6 + column, row: row });
            });
        });
    });
    return { dots: dots, width: text.length * 6 - 1 };
}

// which grid places the sign lights up right now, and how bright (0 to 1)
function signLights(time) {
    const lights = new Map();
    const top = Math.floor((dotRows - 7) / 2);
    const age = time - fieldStartTime;
    const isTyping = signTypedText && time - signLastTyped < signTypedHold;

    if (!isTyping && age < signStartDelay && !isFieldStill) return lights;

    if (isTyping) {
        // what you type: centred, or the end of it when it gets too long, with a blinking caret
        const typed = textDots(signTypedText);
        const left = Math.min(Math.floor((dotColumns - typed.width) / 2), dotColumns - typed.width - 3);
        typed.dots.forEach(function (dot) {
            lights.set((top + dot.row) * dotColumns + left + dot.column, 1);
        });
        if (Math.floor(time / 500) % 2 === 0) {
            for (let row = 0; row < 7; row++) lights.set((top + row) * dotColumns + left + typed.width + 2, 1);
        }
        return lights;
    }

    const message = textDots(signMessages[messageIndex]);
    const elapsed = isFieldStill ? signWipeIn + signPopTime : time - messageStart;
    if (elapsed < 0) return lights;

    const fits = message.width <= dotColumns - 4;
    const left = fits
        ? Math.floor((dotColumns - message.width) / 2)
        : dotColumns - Math.floor(elapsed / 1000 * signScrollSpeed);

    // a bright scan line sweeps over the word while it is held
    const holdTime = elapsed - signWipeIn - signPopTime;
    const scanColumn = (holdTime % signScanTime) / signScanTime * (message.width + 8) - 4;

    message.dots.forEach(function (dot) {
        const column = left + dot.column;
        if (column < 0 || column >= dotColumns) return;

        let light = 1;
        if (fits) {
            // in: column by column every dot pops up, a bit too big first, then settles
            const popStart = (dot.column / message.width) * signWipeIn;
            const pop = Math.min(Math.max((elapsed - popStart) / signPopTime, 0), 1);
            if (pop === 0) return;
            light = pop < 1 ? Math.sin(pop * Math.PI * 0.75) * 1.25 : 1;

            // while it pops it flickers, like a display switching on
            if (pop < 1 && Math.random() < 0.25) light *= 0.35;

            // out: column by column the dots shrink away
            const outStart = signWipeIn + signPopTime + signHold + (dot.column / message.width) * signWipeOut;
            const out = Math.min(Math.max((elapsed - outStart) / signPopTime, 0), 1);
            light *= 1 - out;
        }

        // the scan line makes the dots under it a little bigger
        if (holdTime > 0 || !fits) {
            const scanDistance = Math.abs(dot.column - (fits ? scanColumn : (elapsed / 70) % (message.width + 16) - 8));
            if (scanDistance < 2.5) light *= 1 + (1 - scanDistance / 2.5) * 0.4;
        }

        if (light > 0.01) lights.set((top + dot.row) * dotColumns + column, light);
    });

    // the next word starts when this one has gone, or scrolled out
    if (!isFieldStill) {
        const isDone = fits
            ? elapsed > signWipeIn + signPopTime * 2 + signHold + signWipeOut
            : left < -message.width;
        if (isDone) nextMessage(time);
    }
    return lights;
}

function nextMessage(time) {
    messageIndex = (messageIndex + 1) % signMessages.length;
    messageStart = time;
}

function drawField(time) {
    const width = dotField.clientWidth;
    const height = dotField.clientHeight;
    const offsetX = (width - (dotColumns - 1) * dotSpacing) / 2;
    const offsetY = (height - (dotRows - 1) * dotSpacing) / 2;
    const age = time - fieldStartTime;
    const lights = signLights(time);

    dotContext.clearRect(0, 0, width, height);
    dotContext.fillStyle = dotColor;

    // old ripples fade out and are dropped
    ripples = ripples.filter(function (ripple) {
        return time - ripple.start < rippleLife;
    });

    for (let row = 0; row < dotRows; row++) {
        for (let column = 0; column < dotColumns; column++) {
            const x = offsetX + column * dotSpacing;
            const y = offsetY + row * dotSpacing;

            // a slow wave runs over the field
            const wave = isFieldStill ? 0.5 : (Math.sin(column * 0.32 + row * 0.18 - age * 0.0016) + 1) / 2;

            // dots close to the pointer grow and light up
            let glow = 0;
            if (pointer) {
                const distance = Math.hypot(x - pointer.x, y - pointer.y);
                glow = Math.max(0, 1 - distance / pointerReach);
            }

            // every ripple is a ring that grows from where you clicked
            let ring = 0;
            ripples.forEach(function (ripple) {
                const elapsed = time - ripple.start;
                const ringDistance = Math.abs(Math.hypot(x - ripple.x, y - ripple.y) - elapsed * rippleSpeed);
                if (ringDistance < rippleWidth) ring += (1 - ringDistance / rippleWidth) * (1 - elapsed / rippleLife);
            });
            ring = Math.min(ring, 1);

            let radius = dotRadius * (1 + glow * 1.8 + ring * 1.6);
            let alpha = 0.12 + wave * 0.18 + glow * 0.7 + ring * 0.7;

            // the dots of the sign are big and bright
            const light = lights.get(row * dotColumns + column) || 0;
            if (light > 0) {
                radius = radius + (signRadius - radius) * light + ring * 2;
                alpha = Math.max(alpha, Math.min(light, 1));
            }

            dotContext.globalAlpha = Math.min(alpha, 1);
            dotContext.beginPath();
            dotContext.arc(x, y, radius, 0, Math.PI * 2);
            dotContext.fill();
        }
    }
    dotContext.globalAlpha = 1;
}

function drawLoop(time) {
    if (!isFieldVisible || !dotTitle.classList.contains("has-room")) {
        isFieldDrawing = false;
        return;
    }
    drawField(time);
    requestAnimationFrame(drawLoop);
}

function startDrawing() {
    if (isFieldStill || isFieldDrawing) return;
    isFieldDrawing = true;
    requestAnimationFrame(drawLoop);
}

/* the pointer lights up the dots, a click sends a ripple */
dotField.addEventListener("pointermove", function (e) {
    const box = dotField.getBoundingClientRect();
    pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
});

dotField.addEventListener("pointerleave", function () {
    pointer = null;
});

dotField.addEventListener("pointerdown", function (e) {
    const box = dotField.getBoundingClientRect();
    ripples.push({ x: e.clientX - box.left, y: e.clientY - box.top, start: performance.now() });
    if (isFieldStill) drawField(performance.now());
});

/* typing anywhere on the page (not in a field, no shortcuts) writes on the sign while it is on screen */
window.addEventListener("keydown", function (e) {
    if (!isFieldVisible || !dotTitle.classList.contains("has-room")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest("input, textarea, [contenteditable]")) return;

    const now = performance.now();
    const isTyping = signTypedText && now - signLastTyped < signTypedHold;
    const letter = e.key.toUpperCase();

    if (e.key === "Backspace" && isTyping) {
        signTypedText = signTypedText.slice(0, -1);
    } else if (e.key.length === 1 && signFont[letter] && (letter !== " " || isTyping)) {
        if (!isTyping) signTypedText = "";
        signTypedText = (signTypedText + letter).slice(-signTypedMax);
        // a space would scroll the page, but while typing it belongs on the sign
        if (letter === " ") e.preventDefault();
    } else {
        return;
    }

    signLastTyped = now;
    // when you stop typing, the sign picks up its own words again
    messageStart = now + signTypedHold;
    if (isFieldStill) drawField(now);
});

/* only draw while the field is on screen */
new IntersectionObserver(function (entries) {
    isFieldVisible = entries[0].isIntersecting;
    if (isFieldVisible) startDrawing();
}).observe(dotField);

new ResizeObserver(function () {
    checkFieldRoom();
    startDrawing();
}).observe(dotTitle);

// the dots follow the light / dark theme of the system
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readDotColor);
