/*controles the typing and deleting terminal text in the browser tab*/
const tabCommands = ["hallo, wereld", "ls ./projecten", "cat over.txt", "sudo zeg hallo", "ping dias"];
const tabPrompt = "~$ ";
const tabCursor = "\u2588";

const typingDelay = 110;
const deletingDelay = 55;
const blinkDelay = 500;
const blinksAfterTyping = 4;
const blinksAfterDeleting = 2;

let commandIndex = 0;
let typedLength = 0;
let isDeleting = false;
let blinksLeft = 0;
let isCursorVisible = true;

function showTabTitle() {
    const typedText = tabCommands[commandIndex].slice(0, typedLength);
    document.title = tabPrompt + typedText + (isCursorVisible ? tabCursor : "");
}

function tick() {
    const command = tabCommands[commandIndex];
    let delay = blinkDelay;

    if (blinksLeft > 0) {
        blinksLeft--;
        isCursorVisible = !isCursorVisible;
    } else {
        isCursorVisible = true;

        if (!isDeleting && typedLength < command.length) {
            typedLength++;
            delay = typingDelay;
        } else if (!isDeleting) {
            isDeleting = true;
            blinksLeft = blinksAfterTyping;
        } else if (typedLength > 0) {
            typedLength--;
            delay = deletingDelay;
        } else {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % tabCommands.length;
            blinksLeft = blinksAfterDeleting;
        }
    }

    showTabTitle();
    setTimeout(tick, delay);
}

/* start typing in the tab title */
tick();
