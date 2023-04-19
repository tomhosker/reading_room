/*
This code defines a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Local imports.
const Timings = require("./timings.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Finaliser {
    constructor() {
        this.timings = new Timings();
    }

    // Ronseal.
    static fixApostrophes(input) {
        while (input.indexOf("``") >= 0) {
            input = input.replace("``", "&ldquo;");
        }
        while (input.indexOf("''") >= 0) {
            input = input.replace("''", "&rdquo;");
        }
        while (input.indexOf("`") >= 0) {
            input = input.replace("`", "&lsquo;");
        }
        while (input.indexOf("'") >= 0) {
            input = input.replace("'", "&rsquo;");
        }
        return input;
    }

    // Render, and deliver the page to the browser.
    protoRender(req, res, view, properties) {
        properties.footstamp = 
            this.timings.getCyprianDateString() +
            " = " +
            this.timings.getMyGreg();

        res.render(view, properties, function (err, html) {
            if (html) {
                html = Finaliser.fixApostrophes(html);
                res.send(html);
            } else {
                res.render(view, properties);
            }
        });
    }
}

// Exports.
module.exports = Finaliser;
