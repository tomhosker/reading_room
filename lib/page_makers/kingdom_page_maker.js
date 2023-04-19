/*
This code defines a class which delivers the KINGDOM page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { appendKVPairsToObject, makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class KingdomPageMaker extends PageMaker {
    getTitle() {
        return "Introduction to the Kingdom";
    }

    getView() {
        return "kingdom";
    }

    makePageProperties() {
        this.pageProperties.duchies = makeDuchies(this.data.duchies);
        appendKVPairsToObject(this.data.kingdomKVPairs, this.pageProperties);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeDuchies(duchyData) {
    let result = [];
    let duchyLink, dukeLink;

    for (let record of duchyData) {
        duchyLink = makeLink("/territories/duchies/", record.code, record.name);
        dukeLink = constants.REX;

        if (record.duke) {
            dukeLink = makeLink("/people/", record.duke, record.dukeShortTitle);
        }

        result.push({ duchyLink: duchyLink, dukeLink: dukeLink });
    }

    return result;
}

// Exports.
module.exports = KingdomPageMaker;
