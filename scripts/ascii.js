// controles the animated ASCII donut in the hero
document.addEventListener("DOMContentLoaded", () => {
    const artElement = document.getElementById("ascii-art");
    if (!artElement) return;

    const width = 60;
    const height = 30;
    const chars = ".,-~:;=!*#$@";

    let A = 0;
    let B = 0;

    function renderFrame() {
        const output = new Array(width * height).fill(" ");
        const zBuffer = new Array(width * height).fill(0);

        const cosA = Math.cos(A), sinA = Math.sin(A);
        const cosB = Math.cos(B), sinB = Math.sin(B);

        for (let theta = 0; theta < 6.28; theta += 0.07) {
            const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);

            for (let phi = 0; phi < 6.28; phi += 0.02) {
                const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

                const circleX = cosTheta + 2;
                const circleY = sinTheta;

                const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
                const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
                const z = 5 + cosA * circleX * sinPhi + circleY * sinA;
                const ooz = 1 / z;

                const xp = Math.floor(width / 2 + 22 * ooz * x);
                const yp = Math.floor(height / 2 - 11 * ooz * y);

                const luminance =
                    cosPhi * cosTheta * sinB -
                    cosA * cosTheta * sinPhi -
                    sinA * sinTheta +
                    cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

                const idx = xp + yp * width;
                if (yp >= 0 && yp < height && xp >= 0 && xp < width && ooz > zBuffer[idx]) {
                    zBuffer[idx] = ooz;
                    const charIdx = Math.max(0, Math.floor(luminance * 8));
                    output[idx] = chars[charIdx];
                }
            }
        }

        let frame = "";
        for (let row = 0; row < height; row++) {
            frame += output.slice(row * width, (row + 1) * width).join("") + "\n";
        }
        artElement.textContent = frame;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
        // one static frame instead of animation
        A = 1;
        B = 0.5;
        renderFrame();
        return;
    }

    setInterval(() => {
        // don't waste cycles when tab is hidden
        if (document.hidden) return;

        A += 0.04;
        B += 0.02;
        renderFrame();
    }, 50);
});
