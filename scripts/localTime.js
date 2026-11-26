/*controls my local time in the status window on the contact screen: the time in belgium, so you know if I am awake.
  the dot on the day bar under it shows the same time*/
const localTimeField = document.querySelector("#local-time");
const dayNow = document.querySelector("#day-now");
const dayParts = [...document.querySelectorAll(".day-parts span")];
const localTimeZone = "Europe/Brussels";
const localTickTime = 1000;

// writes the time in belgium, with the part of the day after it
function showLocalTime() {
    const now = new Date();
    const time = now.toLocaleTimeString("nl-BE", { timeZone: localTimeZone, hour: "2-digit", minute: "2-digit" });
    const hour = Number(now.toLocaleString("en-GB", { timeZone: localTimeZone, hour: "2-digit", hour12: false }));
    const minute = Number(now.toLocaleString("en-GB", { timeZone: localTimeZone, minute: "2-digit" }));

    let partOfDay = "nacht";
    if (hour >= 6) partOfDay = "ochtend";
    if (hour >= 12) partOfDay = "middag";
    if (hour >= 18) partOfDay = "avond";

    // only touch the page when the minute changed, not every second
    const text = `${time} (${partOfDay})`;
    if (localTimeField.textContent === text) return;
    localTimeField.textContent = text;

    // the dot slides along the day, and the part of the day it is in is marked
    dayNow.style.left = `${((hour * 60 + minute) / 1440) * 100}%`;
    dayParts.forEach(function (part) {
        part.classList.toggle("is-now", part.textContent === partOfDay);
    });
}

/* show it once, then keep the clock running */
showLocalTime();
setInterval(showLocalTime, localTickTime);
