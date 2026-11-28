/*controls my local time in the status window on the contact screen: the time in belgium, so you know if I am awake.
  the dot on the day bar under it shows the same time*/
const localTimeField = document.querySelector("#local-time");
const dayNow = document.querySelector("#day-now");
const dayParts = [...document.querySelectorAll(".day-parts span")];
const localTimeZone = "Europe/Brussels";

// one clock for belgium, made once (making it is the slow part): it gives the hour and the minute
const belgianClock = new Intl.DateTimeFormat("nl-BE", { timeZone: localTimeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

// writes the time in belgium, with the part of the day after it
function showLocalTime() {
    const parts = belgianClock.formatToParts(new Date());
    const hour = Number(parts.find(function (part) { return part.type === "hour"; }).value);
    const minute = Number(parts.find(function (part) { return part.type === "minute"; }).value);
    const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    let partOfDay = "nacht";
    if (hour >= 6) partOfDay = "ochtend";
    if (hour >= 12) partOfDay = "middag";
    if (hour >= 18) partOfDay = "avond";

    localTimeField.textContent = `${time} (${partOfDay})`;

    // the dot slides along the day, and the part of the day it is in is marked
    dayNow.style.left = `${((hour * 60 + minute) / 1440) * 100}%`;
    dayParts.forEach(function (part) {
        part.classList.toggle("is-now", part.textContent === partOfDay);
    });
}

// the time only changes once a minute, so it waits until the next minute starts instead of checking every second
function tickLocalTime() {
    showLocalTime();
    setTimeout(tickLocalTime, 60000 - (Date.now() % 60000) + 50);
}

/* show it now, then keep the clock running */
tickLocalTime();
