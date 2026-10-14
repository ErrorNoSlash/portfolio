/*controles the possessed pictures (the portrait, the slashyos screenshot): every [data-symbols] picture is split into a grid
  of cells, moving the mouse (or a finger) over it wakes the cells under the pointer, they flicker through terminal symbols
  for a moment and then fade back into the picture*/
const symbolCharacters = "!@#$%&*+=?/\\<>{}[]~^:;|01ds";
// the cell size grows with the page on very wide screens (26 pixels at 100%)
const symbolCellSize = 26 * parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
const wakeReach = 2;
const neighbourWakeChance = 0.55;
const invertedCellChance = 0.3;
const flickerDelay = 70;
const cellAwakeTime = 650;

// one random character from the list
function randomSymbol() {
    return symbolCharacters[Math.floor(Math.random() * symbolCharacters.length)];
}

// one picture: its own grid, its own cells
function addSymbolEffect(picture) {
    const symbolGrid = picture.querySelector(".symbol-grid");
    let gridColumns = 0;
    let gridRows = 0;
    let cells = [];

    // one cell for every 26 x 26 pixels of the photo, rebuilt when the photo changes size
    function buildSymbolGrid() {
        const box = picture.getBoundingClientRect();
        gridColumns = Math.ceil(box.width / symbolCellSize);
        gridRows = Math.ceil(box.height / symbolCellSize);

        symbolGrid.style.gridTemplateColumns = `repeat(${gridColumns}, ${symbolCellSize}px)`;
        symbolGrid.style.gridAutoRows = `${symbolCellSize}px`;

        cells = [];
        const spans = [];
        for (let index = 0; index < gridColumns * gridRows; index++) {
            const span = document.createElement("span");
            spans.push(span);
            cells.push({ element: span, awakeUntil: 0, isAwake: false });
        }
        symbolGrid.replaceChildren(...spans);
    }

    // a cell keeps flickering until its time is up, then it falls asleep and fades out (the css does the fade)
    function flickerCell(cell) {
        if (performance.now() > cell.awakeUntil) {
            cell.isAwake = false;
            cell.element.classList.remove("is-on");
            return;
        }
        cell.element.textContent = randomSymbol();
        setTimeout(function () {
            flickerCell(cell);
        }, flickerDelay);
    }

    // wakes one cell: it shows symbols for a moment (some cells inverted)
    function wakeCell(column, row) {
        if (column < 0 || row < 0 || column >= gridColumns || row >= gridRows) return;

        const cell = cells[row * gridColumns + column];
        cell.awakeUntil = performance.now() + cellAwakeTime;
        if (cell.isAwake) return;

        cell.isAwake = true;
        cell.element.classList.add("is-on");
        cell.element.classList.toggle("is-inverted", Math.random() < invertedCellChance);
        flickerCell(cell);
    }

    /* the cell under the pointer always wakes, the ones around it only some of the time, so the trail looks ragged */
    picture.addEventListener("pointermove", function (e) {
        const box = picture.getBoundingClientRect();
        const column = Math.floor((e.clientX - box.left) / symbolCellSize);
        const row = Math.floor((e.clientY - box.top) / symbolCellSize);

        for (let y = -wakeReach; y <= wakeReach; y++) {
            for (let x = -wakeReach; x <= wakeReach; x++) {
                const isCenter = x === 0 && y === 0;
                const isClose = Math.abs(x) + Math.abs(y) <= wakeReach;
                if (isCenter || (isClose && Math.random() < neighbourWakeChance)) wakeCell(column + x, row + y);
            }
        }
    });

    new ResizeObserver(buildSymbolGrid).observe(picture);
}

/* reduced motion: the pictures stay pictures */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-symbols]").forEach(addSymbolEffect);
}
