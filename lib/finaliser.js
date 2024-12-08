/*
This code defines a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Local imports.
const { Timings } = require("./timings.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Finaliser {
    constructor() {
        this.timings = new Timings();
    }

    // Render, and deliver the page to the browser.
    protoRender(req, res, view, properties) {
        properties.footstamp = 
            this.timings.getCyprianString() +
            " = " +
            this.timings.getMyGreg();

        res.render(view, properties, function (err, html) {
            if (html) {
                html = fixApostrophes(html);
                res.send(html);
            } else {
                res.render(view, properties);
            }
        });
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Replace all instances of a sub-string.
function thoroughReplace(mainString, subString, replacement) {
    while (mainString.includes(subString)) {
        mainString = mainString.replace(subString, replacement);
    }

    return mainString;
}

// Fix the appearance apostrophes in a given chunk of HTML.
function fixApostrophes(html) {
    html = thoroughReplace(html, "``", "&ldquo;");
    html = thoroughReplace(html, "''", "&rdquo;");
    html = thoroughReplace(html, "`", "&lsquo;");
    html = thoroughReplace(html, "'", "&rsquo;");

    return html;
}

// Exports.
module.exports = Finaliser;
