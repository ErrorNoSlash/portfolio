/*controles the possessed pictures (the portrait, the slashyos screenshot): every [data-symbols] picture is split into a grid
  of cells, moving the mouse (or a finger) over it wakes the cells under the pointer, they flicker through terminal symbols
  for a moment and then fade back into the picture*/
const pfpSymbolSet = "!@#$%&*+=?/\\<>{}[]~^:;|01ds";
const pfpCellSize = 26;
const pfpReach = 2;
const pfpChance = 0.55;
const pfpInvertChance = 0.3;
const pfpFlickerTime = 70;
const pfpAwakeTime = 650;

function randomPfpSymbol() {
    return pfpSymbolSet[Math.floor(Math.random() * pfpSymbolSet.length)];
}

// one picture: its own grid, its own cells
function possessPicture(pfpPhoto) {
    const pfpGrid = pfpPhoto.querySelector(".pfp-symbols");
    let pfpColumns = 0;
    let pfpRows = 0;
    let pfpCells = [];

    // one cell for every 26 x 26 pixels of the photo, rebuilt when the photo changes size
    function buildPfpGrid() {
        const box = pfpPhoto.getBoundingClientRect();
        pfpColumns = Math.ceil(box.width / pfpCellSize);
        pfpRows = Math.ceil(box.height / pfpCellSize);

        pfpGrid.style.gridTemplateColumns = `repeat(${pfpColumns}, ${pfpCellSize}px)`;
        pfpGrid.style.gridAutoRows = `${pfpCellSize}px`;

        pfpCells = [];
        const spans = [];
        for (let index = 0; index < pfpColumns * pfpRows; index++) {
            const span = document.createElement("span");
            spans.push(span);
            pfpCells.push({ element: span, awakeUntil: 0, isAwake: false });
        }
        pfpGrid.replaceChildren(...spans);
    }

    // a cell keeps flickering until its time is up, then it falls asleep and fades out (the css does the fade)
    function flickerPfpCell(cell) {
        if (performance.now() > cell.awakeUntil) {
            cell.isAwake = false;
            cell.element.classList.remove("is-on");
            return;
        }
        cell.element.textContent = randomPfpSymbol();
        setTimeout(function () {
            flickerPfpCell(cell);
        }, pfpFlickerTime);
    }

    function wakePfpCell(column, row) {
        if (column < 0 || row < 0 || column >= pfpColumns || row >= pfpRows) return;

        const cell = pfpCells[row * pfpColumns + column];
        cell.awakeUntil = performance.now() + pfpAwakeTime;
        if (cell.isAwake) return;

        cell.isAwake = true;
        cell.element.classList.add("is-on");
        cell.element.classList.toggle("is-inverted", Math.random() < pfpInvertChance);
        flickerPfpCell(cell);
    }

    /* the cell under the pointer always wakes, the ones around it only some of the time, so the trail looks ragged */
    pfpPhoto.addEventListener("pointermove", function (e) {
        const box = pfpPhoto.getBoundingClientRect();
        const column = Math.floor((e.clientX - box.left) / pfpCellSize);
        const row = Math.floor((e.clientY - box.top) / pfpCellSize);

        for (let y = -pfpReach; y <= pfpReach; y++) {
            for (let x = -pfpReach; x <= pfpReach; x++) {
                const isCenter = x === 0 && y === 0;
                const isClose = Math.abs(x) + Math.abs(y) <= pfpReach;
                if (isCenter || (isClose && Math.random() < pfpChance)) wakePfpCell(column + x, row + y);
            }
        }
    });

    new ResizeObserver(buildPfpGrid).observe(pfpPhoto);
}

/* reduced motion: the pictures stay pictures */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-symbols]").forEach(possessPicture);
}
