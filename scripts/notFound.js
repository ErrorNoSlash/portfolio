/*404: shows the path the visitor actually tried, for a bit of terminal flavour*/
let missingPath = location.pathname;

// turn %20 and friends back into normal characters, a broken one is shown as it is
try {
    missingPath = decodeURIComponent(missingPath);
} catch (error) { }

/* put the path in the prompt and the log (textContent, so whatever was typed is never read as HTML) */
if (missingPath && missingPath !== "/") {
    document.querySelectorAll("#missing-path, #missing-path-log").forEach(function (element) {
        element.textContent = `.${missingPath}`;
    });
}
