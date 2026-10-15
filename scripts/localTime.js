/*controles my local time in the status window on the contact screen: the time in belgium, so you know if I am awake*/
const localTimeField = document.querySelector("#local-time");
const localTimeZone = "Europe/Brussels";
const localTickTime = 1000;

// writes the time in belgium, with the part of the day after it
function showLocalTime() {
    const now = new Date();
    const time = now.toLocaleTimeString("nl-BE", { timeZone: localTimeZone, hour: "2-digit", minute: "2-digit" });
    const hour = Number(now.toLocaleString("en-GB", { timeZone: localTimeZone, hour: "2-digit", hour12: false }));

    let partOfDay = "nacht";
    if (hour >= 6) partOfDay = "ochtend";
    if (hour >= 12) partOfDay = "middag";
    if (hour >= 18) partOfDay = "avond";

    localTimeField.textContent = `${time} (${partOfDay})`;
}

/* show it once, then keep the clock running */
showLocalTime();
setInterval(showLocalTime, localTickTime);
