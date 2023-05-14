/*
This code defines an abstract parent class which delivers the page for a given
CANON from the media database, and also its various implementations.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

// Local constants.
const KEY_TO_TITLE = {
    almanack: "Hosker's Almanack",
    catalogue: "Hosker's Catalogue",
    anthems: "Hosker's Anthems",
    albums: "Hosker's Albums",
    cinema: "Hosker's Cinema",
    television: "Hosker's Television"
};
const TICK_HTML = '<span class="green">&#10004;</span>';
const CROSS_HTML = '<span class="red">&#10006;</span>';

/******************
 ** PARENT CLASS **
 *****************/

// The class in question.
class CanonPageMaker extends PageMaker {
    getTitle() {
        return null;
    }

    getView() {
        return "canon";
    }

    processHeading(heading) {
        if (heading === "id") return "&numero;";

        return camelCaseToHeading(heading);
    }

    processItem(item, key) {
        let result;

        if (item === null) return constants.NULL_MARKER;

        if (key === "title") {
            result = "<i>" + item + "</i>";

            return result;
        }

        return item;
    }

    makeCanonData(raw) {
        let result = { headings: [], rows: [] };
        let rawHeadings = [];
        let heading, row, item;

        if (!raw) return null;

        for (let property in raw[0]) {
            if (raw[0].hasOwnProperty(property)) {
                rawHeadings.push(property);
                heading = this.processHeading(property);
                result.headings.push(heading);
            }
        }

        for (let record of raw) {
            row = [];

            for (let key of rawHeadings) {
                item = record[key];
                item = this.processItem(item, key);
                row.push(item);
            }

            result.rows.push(row);
        }

        return result;
    }

    makePageProperties() {
        this.pageProperties.key = this.req.params.id;
        this.pageProperties.data = this.makeCanonData(this.data.canon);

        this.wrapUp();
    }
}

/*******************
 ** CHILD CLASSES **
 ******************/

class HoskersAlmanackPageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Almanack";
    }
}

class HoskersCataloguePageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Catalogue";
    }

    processHeading(heading) {
        if (heading === "id") return "&numero;";
        if (heading === "fullTitle") return "Author";

        return camelCaseToHeading(heading);
    }

    processItem(item, key) {
        let result;

        if (item === null) return constants.NULL_MARKER;

        if (key === "title") {
            result = "<i>" + item + "</i>";

            return result;
        }

        if (key === "inLibrary") {
            if (item) return TICK_HTML;

            return CROSS_HTML;
        }

        return item;
    }
}

class HoskersAnthemsPageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Anthems";
    }

    processItem(item, key) {
        let result;

        if (item === null) return constants.NULL_MARKER;

        if (key === "title") {
            result = "&ldquo;" + item + "&rdquo;";

            return result;
        }

        return item;
    }
}

class HoskersAlbumsPageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Albums";
    }
}

class HoskersCinemaPageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Cinema";
    }
}

class HoskersTelevisionPageMaker extends CanonPageMaker {
    getTitle() {
        return "Hosker's Television";
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function camelCaseToHeading(heading) {
    const words = heading.match(/[A-Za-z][a-z]*/g) || [];
    const result = words.map(capitalise).join(" ");

    return result;
}

function capitalise(word) {
    const result = word.charAt(0).toUpperCase() + word.substring(1);

    return result;
}

// Exports.
module.exports = {
    HoskersAlmanackPageMaker,
    HoskersCataloguePageMaker,
    HoskersAnthemsPageMaker,
    HoskersAlbumsPageMaker,
    HoskersCinemaPageMaker,
    HoskersTelevisionPageMaker
};
