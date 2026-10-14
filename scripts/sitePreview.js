/*controles the live preview on the personal-website page: the real home page in a small window, drawn at desktop size
  and scaled down to fit. The pills jump it to a screen, and on its own it goes through the screens one by one*/
const previewWindow = document.querySelector(".site-preview-window");
const previewFrame = previewWindow.querySelector("iframe");
const previewTabs = [...document.querySelectorAll(".site-preview-tabs [data-screen]")];
const previewPageWidth = 1440;
const previewStepTime = 4500;
const previewFadeTime = 300;

let previewScreenIndex = 0;
let previewTimer = null;
let previewFadeTimer = null;
let isPreviewLoaded = false;

// the page is drawn 1440 pixels wide and scaled down, so it looks like it does on a laptop
function scalePreview() {
    const scale = previewWindow.clientWidth / previewPageWidth;
    previewFrame.style.width = `${previewPageWidth}px`;
    previewFrame.style.height = `${previewWindow.clientHeight / scale}px`;
    previewFrame.style.transform = `scale(${scale})`;
}

// lights the pill of one screen
function markPreviewTab(index) {
    previewScreenIndex = index;
    previewTabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle("is-active", tabIndex === index);
    });
}

// jumps the page inside straight to a screen, without its smooth scroll sliding two screens over each other
function jumpPreviewTo(screenId) {
    try {
        const screen = previewFrame.contentDocument.getElementById(screenId);
        previewFrame.contentWindow.scrollTo({ top: screen.offsetTop, behavior: "instant" });
    } catch (error) {
        // the browser does not let us in (opened as a file): load the page again at that screen
        previewFrame.src = `../../index.html?via=curtain#${screenId}`;
    }
}

// shows one screen in the preview and lights its pill (only once the page inside has loaded):
// the window fades out, jumps while it is dark and fades back in
function showPreviewScreen(index) {
    markPreviewTab(index);
    if (!isPreviewLoaded) return;
    const screenId = previewTabs[index].dataset.screen;

    clearTimeout(previewFadeTimer);
    previewWindow.classList.add("is-switching");
    previewFadeTimer = setTimeout(function () {
        jumpPreviewTo(screenId);
        previewWindow.classList.remove("is-switching");
    }, previewFadeTime);
}

// on its own the preview goes on to the next screen every few seconds
function startPreviewTour() {
    clearInterval(previewTimer);
    previewTimer = setInterval(function () {
        showPreviewScreen((previewScreenIndex + 1) % previewTabs.length);
    }, previewStepTime);
}

/* a pill jumps to its screen, and the tour starts counting again from there */
previewTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
        showPreviewScreen(index);
        startPreviewTour();
    });
});

/* scale again when the window changes size */
new ResizeObserver(scalePreview).observe(previewWindow);

/* start at the landing, the tour waits until the page inside has loaded */
markPreviewTab(0);
previewFrame.addEventListener("load", function () {
    if (isPreviewLoaded) return;
    isPreviewLoaded = true;
    startPreviewTour();
});
