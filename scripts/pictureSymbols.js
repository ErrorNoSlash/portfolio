/*controls the possessed pictures (the portrait, the slashyos screenshot): moving the mouse (or a finger) over a [data-symbols] picture wakes the cells
  under the pointer, they flicker through terminal symbols for a moment and then fade back into the picture.
  everything is drawn on one canvas over the photo, and only while a cell is awake, so it costs almost nothing
  (the old version faded hundreds of separate boxes, which lagged on windows)*/
const symbolCharacters = "!@#$%&*+=?/\\<>{}[]~^:;|01ds";
// the cell size grows with the page on very wide screens (26 pixels at 100%)
const symbolCellSize = 26 * parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
const wakeReach = 2;
const neighbourWakeChance = 0.55;
const invertedCellChance = 0.3;
const flickerDelay = 70;
const cellAwakeTime = 650;
const cellFadeTime = 450;

// one picture: its own canvas, its own cells
function addSymbolEffect(picture) {
    const canvas = picture.querySelector(".symbol-grid");
    const context = canvas.getContext("2d");
    let gridColumns = 0;
    let gridRows = 0;
    let cells = [];
    let awakeCells = new Set();
    let drawFrame = null;
    // every symbol drawn once, plain and inverted, so a frame only copies little squares (much faster than drawing text)
    const symbolSheet = document.createElement("canvas");
    const sheetContext = symbolSheet.getContext("2d");
    let sheetCellSize = 0;

    // one cell for every 26 x 26 pixels of the photo, rebuilt when the photo changes size
    function buildSymbolGrid() {
        const box = picture.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        gridColumns = Math.ceil(box.width / symbolCellSize);
        gridRows = Math.ceil(box.height / symbolCellSize);

        canvas.width = Math.round(box.width * ratio);
        canvas.height = Math.round(box.height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        cells = [];
        for (let index = 0; index < gridColumns * gridRows; index++) {
            cells.push({ column: index % gridColumns, row: Math.floor(index / gridColumns), awakeUntil: 0, nextFlicker: 0, symbol: 0, isInverted: false });
        }
        awakeCells = new Set();
    }

    // draws the sheet of symbols in the page colors and font (again every time the effect starts: the theme can change)
    function drawSymbolSheet() {
        const style = getComputedStyle(canvas);
        const background = style.getPropertyValue("--background").trim() || "#000";
        const foreground = style.getPropertyValue("--foreground").trim() || "#fff";
        const ratio = window.devicePixelRatio || 1;

        sheetCellSize = Math.ceil(symbolCellSize * ratio);
        symbolSheet.width = sheetCellSize * symbolCharacters.length;
        symbolSheet.height = sheetCellSize * 2;
        sheetContext.font = `${style.fontWeight} ${parseFloat(style.fontSize) * ratio}px ${style.fontFamily}`;
        sheetContext.textAlign = "center";
        sheetContext.textBaseline = "middle";

        // row 0: dark on light, row 1: inverted
        [[background, foreground], [foreground, background]].forEach(function ([fill, ink], row) {
            sheetContext.fillStyle = fill;
            sheetContext.fillRect(0, row * sheetCellSize, symbolSheet.width, sheetCellSize);
            sheetContext.fillStyle = ink;
            [...symbolCharacters].forEach(function (character, index) {
                sheetContext.fillText(character, (index + 0.5) * sheetCellSize, (row + 0.5) * sheetCellSize);
            });
        });
    }

    // one frame: every awake cell flickers, a cell that fell asleep fades out, then it is forgotten
    function drawCells(now) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        awakeCells.forEach(function (cell) {
            const fade = now <= cell.awakeUntil ? 1 : 1 - (now - cell.awakeUntil) / cellFadeTime;
            if (fade <= 0) {
                awakeCells.delete(cell);
                return;
            }

            if (now <= cell.awakeUntil && now >= cell.nextFlicker) {
                cell.symbol = Math.floor(Math.random() * symbolCharacters.length);
                cell.nextFlicker = now + flickerDelay;
            }

            context.globalAlpha = fade;
            context.drawImage(symbolSheet,
                cell.symbol * sheetCellSize, cell.isInverted ? sheetCellSize : 0, sheetCellSize, sheetCellSize,
                cell.column * symbolCellSize, cell.row * symbolCellSize, symbolCellSize, symbolCellSize);
        });
        context.globalAlpha = 1;

        drawFrame = awakeCells.size > 0 ? requestAnimationFrame(drawCells) : null;
    }

    // wakes one cell: it shows symbols for a moment (some cells inverted)
    function wakeCell(column, row) {
        if (column < 0 || row < 0 || column >= gridColumns || row >= gridRows) return;

        const cell = cells[row * gridColumns + column];
        const now = performance.now();
        if (now > cell.awakeUntil) cell.isInverted = Math.random() < invertedCellChance;
        cell.awakeUntil = now + cellAwakeTime;
        awakeCells.add(cell);
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

        if (drawFrame === null && awakeCells.size > 0) {
            drawSymbolSheet();
            drawFrame = requestAnimationFrame(drawCells);
        }
    }, { passive: true });

    new ResizeObserver(buildSymbolGrid).observe(picture);
}

/* every picture marked with data-symbols gets the effect */
document.querySelectorAll("[data-symbols]").forEach(addSymbolEffect);
