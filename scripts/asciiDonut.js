/*controles the spinning ascii donut on the landing page: it spins on its own and tilts towards the mouse*/
const donutElement = document.querySelector("#ascii-art");
const donutColumns = 60;
const donutRows = 30;
const shadeCharacters = ".,-~:;=!*#$@";
const donutFrameTime = 50;
const tiltStrength = 1.2;
const tiltEase = 0.08;

let spinAngleX = 0;
let spinAngleZ = 0;
let tiltSideways = 0;
let tiltUpDown = 0;
let targetTiltSideways = 0;
let targetTiltUpDown = 0;

// the sine and cosine of every step around the tube (theta) and around the donut (phi), worked out once,
// so a frame only multiplies instead of calling Math.sin and Math.cos thousands of times
const thetaStep = 0.07;
const phiStep = 0.03;
const thetaCos = [], thetaSin = [], phiCos = [], phiSin = [];
for (let theta = 0; theta < 6.28; theta += thetaStep) {
    thetaCos.push(Math.cos(theta));
    thetaSin.push(Math.sin(theta));
}
for (let phi = 0; phi < 6.28; phi += phiStep) {
    phiCos.push(Math.cos(phi));
    phiSin.push(Math.sin(phi));
}

// the buffers of one frame, reused every frame instead of making new ones
const donutCharacters = new Array(donutColumns * donutRows);
const closestDepth = new Float32Array(donutColumns * donutRows);
const donutLines = new Array(donutRows);

// draws one frame: every point of the donut is turned, lit and written as a character, closest ones win
function drawDonut() {
    donutCharacters.fill(" ");
    closestDepth.fill(0);

    // the two spin angles (plus the mouse tilt) as sine and cosine, used for every point
    const cosSpinX = Math.cos(spinAngleX + tiltUpDown), sinSpinX = Math.sin(spinAngleX + tiltUpDown);
    const cosSpinZ = Math.cos(spinAngleZ + tiltSideways), sinSpinZ = Math.sin(spinAngleZ + tiltSideways);

    // theta goes around the tube, phi goes around the whole donut
    for (let thetaIndex = 0; thetaIndex < thetaCos.length; thetaIndex++) {
        const cosTheta = thetaCos[thetaIndex], sinTheta = thetaSin[thetaIndex];
        const circleX = cosTheta + 2;
        const circleY = sinTheta;

        for (let phiIndex = 0; phiIndex < phiCos.length; phiIndex++) {
            const cosPhi = phiCos[phiIndex], sinPhi = phiSin[phiIndex];

            const x = circleX * (cosSpinZ * cosPhi + sinSpinX * sinSpinZ * sinPhi) - circleY * cosSpinX * sinSpinZ;
            const y = circleX * (sinSpinZ * cosPhi - sinSpinX * cosSpinZ * sinPhi) + circleY * cosSpinX * cosSpinZ;
            const z = 5 + cosSpinX * circleX * sinPhi + circleY * sinSpinX;
            const oneOverZ = 1 / z;

            const column = Math.floor(donutColumns / 2 + 22 * oneOverZ * x);
            const line = Math.floor(donutRows / 2 - 11 * oneOverZ * y);
            if (line < 0 || line >= donutRows || column < 0 || column >= donutColumns) continue;

            // only keep the point closest to the screen
            const index = column + line * donutColumns;
            if (oneOverZ > closestDepth[index]) {
                const light = cosPhi * cosTheta * sinSpinZ
                    - cosSpinX * cosTheta * sinPhi
                    - sinSpinX * sinTheta
                    + cosSpinZ * (cosSpinX * sinTheta - cosTheta * sinSpinX * sinPhi);

                closestDepth[index] = oneOverZ;
                donutCharacters[index] = shadeCharacters[Math.max(0, Math.floor(light * 8))];
            }
        }
    }

    for (let line = 0; line < donutRows; line++) {
        donutLines[line] = donutCharacters.slice(line * donutColumns, (line + 1) * donutColumns).join("");
    }
    donutElement.textContent = donutLines.join("\n");
}

// one step of the spin: turn a bit further and let the tilt slide towards the mouse
function spinDonut() {
    spinAngleX += 0.04;
    spinAngleZ += 0.02;
    tiltSideways += (targetTiltSideways - tiltSideways) * tiltEase;
    tiltUpDown += (targetTiltUpDown - tiltUpDown) * tiltEase;
    drawDonut();
}

let isDonutInView = true;
let donutTimer = null;

// spins only while the donut can be seen: not when it is scrolled away or the tab is hidden
function updateDonutSpin() {
    const shouldSpin = isDonutInView && !document.hidden && !isInsidePreview;
    if (shouldSpin && donutTimer === null) donutTimer = setInterval(spinDonut, donutFrameTime);
    if (!shouldSpin && donutTimer !== null) {
        clearInterval(donutTimer);
        donutTimer = null;
    }
}

// inside the small live preview on the personal-website page the donut stands still, one moving donut is enough
const isInsidePreview = window.self !== window.top;
document.documentElement.classList.toggle("is-preview", isInsidePreview);

/* draw the first frame, then spin while it is in view */
drawDonut();
new IntersectionObserver(function (entries) {
    isDonutInView = entries[0].isIntersecting;
    updateDonutSpin();
}).observe(donutElement);

/* switching to another tab and back stops and starts the spin */
document.addEventListener("visibilitychange", updateDonutSpin);

/* the mouse position, from -0.5 to 0.5 over the window, tilts the donut */
window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;

    targetTiltSideways = (e.clientX / window.innerWidth - 0.5) * tiltStrength;
    targetTiltUpDown = (e.clientY / window.innerHeight - 0.5) * tiltStrength;
}, { passive: true });
