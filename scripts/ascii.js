/*controles the spinning ascii donut on the landing page: it spins on its own and tilts towards the mouse*/
const asciiArt = document.querySelector("#ascii-art");
const asciiWidth = 60;
const asciiHeight = 30;
const asciiShades = ".,-~:;=!*#$@";
const frameTime = 50;
const tiltStrength = 1.2;
const tiltEase = 0.08;

let angleA = 0;
let angleB = 0;
let tiltX = 0;
let tiltY = 0;
let targetTiltX = 0;
let targetTiltY = 0;

function drawDonut() {
    const output = new Array(asciiWidth * asciiHeight).fill(" ");
    const depth = new Array(asciiWidth * asciiHeight).fill(0);

    const cosA = Math.cos(angleA + tiltY), sinA = Math.sin(angleA + tiltY);
    const cosB = Math.cos(angleB + tiltX), sinB = Math.sin(angleB + tiltX);

    // theta goes around the tube, phi goes around the whole donut
    for (let theta = 0; theta < 6.28; theta += 0.07) {
        const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);

        for (let phi = 0; phi < 6.28; phi += 0.02) {
            const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

            const circleX = cosTheta + 2;
            const circleY = sinTheta;

            const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
            const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
            const z = 5 + cosA * circleX * sinPhi + circleY * sinA;
            const oneOverZ = 1 / z;

            const column = Math.floor(asciiWidth / 2 + 22 * oneOverZ * x);
            const line = Math.floor(asciiHeight / 2 - 11 * oneOverZ * y);

            const light = cosPhi * cosTheta * sinB
                - cosA * cosTheta * sinPhi
                - sinA * sinTheta
                + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

            const index = column + line * asciiWidth;
            const isOnScreen = line >= 0 && line < asciiHeight && column >= 0 && column < asciiWidth;

            // only keep the point closest to the screen
            if (isOnScreen && oneOverZ > depth[index]) {
                depth[index] = oneOverZ;
                output[index] = asciiShades[Math.max(0, Math.floor(light * 8))];
            }
        }
    }

    let frame = "";
    for (let line = 0; line < asciiHeight; line++) {
        frame += output.slice(line * asciiWidth, (line + 1) * asciiWidth).join("") + "\n";
    }
    asciiArt.textContent = frame;
}

/* reduced motion: one still frame, otherwise spin (and rest while the tab is hidden) */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    angleA = 1;
    angleB = 0.5;
    drawDonut();
} else {
    drawDonut();
    setInterval(function () {
        if (document.hidden) return;

        angleA += 0.04;
        angleB += 0.02;

        // the tilt slides towards the mouse instead of jumping
        tiltX += (targetTiltX - tiltX) * tiltEase;
        tiltY += (targetTiltY - tiltY) * tiltEase;
        drawDonut();
    }, frameTime);

    /* the mouse position, from -0.5 to 0.5 over the window, tilts the donut */
    window.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;

        targetTiltX = (e.clientX / window.innerWidth - 0.5) * tiltStrength;
        targetTiltY = (e.clientY / window.innerHeight - 0.5) * tiltStrength;
    });
}
