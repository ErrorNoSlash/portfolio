/*controles the nav while scrolling: the prompt types the command of the screen you are on,
  its pill lights up and a line under the nav fills with how far you scrolled*/
const navBar = document.querySelector(".nav");
const navCommand = document.querySelector("#nav-command");
const screens = [...document.querySelectorAll(".screen")];
const screenPills = [...document.querySelectorAll(".nav-tabs a[href^='#']:not(.nav-menu)")];
const commandTypeDelay = 35;

let currentScreen = null;
let commandTimer = null;
let isNavTicking = false;

// types the command letter by letter, like someone typing it in the shell
function typeCommand(command) {
    let length = 0;
    clearTimeout(commandTimer);

    // one more letter of the command
    function typeNext() {
        navCommand.textContent = command.slice(0, length);
        if (length < command.length) {
            length++;
            commandTimer = setTimeout(typeNext, commandTypeDelay);
        }
    }

    typeNext();
}

// fills the progress line and, on a new screen, types its command and lights its pill
function updateNav() {
    isNavTicking = false;

    // how far down the page you are, 0 to 1 (the last two pixels count as the end, browsers round)
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = scrollable - window.scrollY <= 2 ? scrollable : window.scrollY;
    navBar.style.setProperty("--progress", scrollable > 0 ? Math.min(scrolled / scrollable, 1) : 0);

    // the screen you are on is the last one whose top passed the middle of the window
    let activeScreen = screens[0];
    screens.forEach(function (screen) {
        if (screen.getBoundingClientRect().top < window.innerHeight / 2) activeScreen = screen;
    });

    if (activeScreen === currentScreen) return;
    currentScreen = activeScreen;

    typeCommand(activeScreen.dataset.command);
    screenPills.forEach(function (pill) {
        pill.classList.toggle("is-active", pill.hash === `#${activeScreen.id}`);
    });
}

/* scroll and resize only update once per frame */
function requestNavUpdate() {
    if (isNavTicking) return;
    isNavTicking = true;
    requestAnimationFrame(updateNav);
}

/* update while scrolling and when the window changes size */
window.addEventListener("scroll", requestNavUpdate, { passive: true });
window.addEventListener("resize", requestNavUpdate);
updateNav();
