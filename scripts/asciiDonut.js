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

// draws one frame: every point of the donut is turned, lit and written as a character, closest ones win
function drawDonut() {
    const donutCharacters = new Array(donutColumns * donutRows).fill(" ");
    const closestDepth = new Array(donutColumns * donutRows).fill(0);

    // the two spin angles (plus the mouse tilt) as sine and cosine, used for every point
    const cosSpinX = Math.cos(spinAngleX + tiltUpDown), sinSpinX = Math.sin(spinAngleX + tiltUpDown);
    const cosSpinZ = Math.cos(spinAngleZ + tiltSideways), sinSpinZ = Math.sin(spinAngleZ + tiltSideways);

    // theta goes around the tube, phi goes around the whole donut
    for (let theta = 0; theta < 6.28; theta += 0.07) {
        const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);

        for (let phi = 0; phi < 6.28; phi += 0.02) {
            const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

            const circleX = cosTheta + 2;
            const circleY = sinTheta;

            const x = circleX * (cosSpinZ * cosPhi + sinSpinX * sinSpinZ * sinPhi) - circleY * cosSpinX * sinSpinZ;
            const y = circleX * (sinSpinZ * cosPhi - sinSpinX * cosSpinZ * sinPhi) + circleY * cosSpinX * cosSpinZ;
            const z = 5 + cosSpinX * circleX * sinPhi + circleY * sinSpinX;
            const oneOverZ = 1 / z;

            const column = Math.floor(donutColumns / 2 + 22 * oneOverZ * x);
            const line = Math.floor(donutRows / 2 - 11 * oneOverZ * y);

            const light = cosPhi * cosTheta * sinSpinZ
                - cosSpinX * cosTheta * sinPhi
                - sinSpinX * sinTheta
                + cosSpinZ * (cosSpinX * sinTheta - cosTheta * sinSpinX * sinPhi);

            const index = column + line * donutColumns;
            const isOnScreen = line >= 0 && line < donutRows && column >= 0 && column < donutColumns;

            // only keep the point closest to the screen
            if (isOnScreen && oneOverZ > closestDepth[index]) {
                closestDepth[index] = oneOverZ;
                donutCharacters[index] = shadeCharacters[Math.max(0, Math.floor(light * 8))];
            }
        }
    }

    let frame = "";
    for (let line = 0; line < donutRows; line++) {
        frame += donutCharacters.slice(line * donutColumns, (line + 1) * donutColumns).join("") + "\n";
    }
    donutElement.textContent = frame;
}

/* draw the first frame, then keep spinning (and rest while the tab is hidden) */
drawDonut();
setInterval(function () {
    if (document.hidden) return;

    spinAngleX += 0.04;
    spinAngleZ += 0.02;

    // the tilt slides towards the mouse instead of jumping
    tiltSideways += (targetTiltSideways - tiltSideways) * tiltEase;
    tiltUpDown += (targetTiltUpDown - tiltUpDown) * tiltEase;
    drawDonut();
}, donutFrameTime);

/* the mouse position, from -0.5 to 0.5 over the window, tilts the donut */
window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;

    targetTiltSideways = (e.clientX / window.innerWidth - 0.5) * tiltStrength;
    targetTiltUpDown = (e.clientY / window.innerHeight - 0.5) * tiltStrength;
});
