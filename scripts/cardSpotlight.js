/*controles the spotlight on the profile card: follows the mouse, or the finger on a phone*/
const touchHoldTime = 700;

function moveSpotlight(card, e) {
    const cardBox = card.getBoundingClientRect();
    const x = (e.clientX - cardBox.left) / cardBox.width;
    const y = (e.clientY - cardBox.top) / cardBox.height;

    card.style.setProperty("--x", `${x * 100}%`);
    card.style.setProperty("--y", `${y * 100}%`);
}

// keep the effect a moment after the finger lifts, so a quick tap is still visible
function releaseCards() {
    document.querySelectorAll(".profile-card.is-touched").forEach(function (card) {
        clearTimeout(card.releaseTimer);
        card.releaseTimer = setTimeout(function () {
            card.classList.remove("is-touched");
        }, touchHoldTime);
    });
}

/* the spotlight follows the mouse, or a finger that is holding the card */
document.addEventListener("pointermove", function (e) {
    const card = e.target.closest(".profile-card");
    if (!card) return;

    const isTouching = card.classList.contains("is-touched");
    if (e.pointerType === "mouse" || isTouching) moveSpotlight(card, e);
})

/* a touch starts the hold effect */
document.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") return;

    const card = e.target.closest(".profile-card");
    if (!card) return;

    clearTimeout(card.releaseTimer);
    moveSpotlight(card, e);
    card.classList.add("is-touched");
})

/* letting go ends the hold effect */
document.addEventListener("pointerup", releaseCards);
document.addEventListener("pointercancel", releaseCards);
