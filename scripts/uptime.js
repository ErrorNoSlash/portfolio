/*controles the uptime in the status bar: how long this visit has lasted, like the uptime of a terminal*/
const uptimeValue = document.querySelector("#uptime");
const uptimeStart = performance.now();

// 7 becomes 07
function twoDigits(number) {
    return String(number).padStart(2, "0");
}

// writes the time since the page opened as hh:mm:ss
function showUptime() {
    const seconds = Math.floor((performance.now() - uptimeStart) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    uptimeValue.textContent = `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds % 60)}`;
}

/* count every second */
showUptime();
setInterval(showUptime, 1000);
