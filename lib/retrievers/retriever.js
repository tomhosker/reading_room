/*
This code defines the PARENT class for RETRIEVER child classes.
*/

// Imports.
const sqlite3 = require("sqlite3");

// Local imports.
const constants = require("../constants.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Retriever {
    constructor(req, res, key) {
        this.req = req;
        this.res = res;
        this.key = getKeyFromPotential(key);
        this.db = new sqlite3.Database(constants.PATH_TO_DB_CYPRUS);
        this.canons = new sqlite3.Database(constants.PATH_TO_DB_CANONS);
        this.data = { key: this.key };
    }

    getPageMakerClass() {
        return null;
    }

    startHere() {
        this.wrapUp();
    }

    wrapUp() {
        const PageMakerClass = this.getPageMakerClass();
        const pageMaker = new PageMakerClass(this.req, this.res, this.data);

        this.db.close();
        this.canons.close();

        pageMaker.deliver();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function getKeyFromPotential(potentialKey) {
    if (potentialKey) return potentialKey;

    return null;
}

// Exports.
module.exports = Retriever;
