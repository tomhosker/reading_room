/*
This code defines a class which delivers a CHIVALRIC ORDER page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { copyPropertiesOfLeftToRight, makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class ChivalricPageMaker extends PageMaker {
    getTitle() {
        return this.data.chivalric.name;
    }

    getView() {
        return "chivalric";
    }

    makeAccolades() {
        let result = [];
        let accoladeDict = {};
        let accoladeWithHolders;

        for (let record of this.data.accolades) {
            accoladeDict[record.code] =
                new AccoladeWithHolders(record.code, record.name);
        }

        for (let record of this.data.holders) {
            accoladeWithHolders = accoladeDict[record.accolade];
            accoladeWithHolders.processRecord(record);
        }

        // Preserve ordering by tier and precedence.
        for (let record of this.data.accolades) {
            result.push(accoladeDict[record.code]);
        }

        return result;
    }

    makePageProperties() {
        copyPropertiesOfLeftToRight(this.data.chivalric, this.pageProperties);

        if (this.data.chivalric.master) {
            this.pageProperties.masterLink =
                makeLink(
                    "/people/",
                    this.data.chivalric.master,
                    this.data.chivalric.masterShortTitle
                );
        } else this.pageProperties.masterLink = null;

        this.pageProperties.arms = this.data.chivalric.arms;
        this.pageProperties.accolades = this.makeAccolades();

        this.wrapUp();
    }
}

/**********************************
 ** HELPER CLASSES AND FUNCTIONS **
 *********************************/

class AccoladeWithHolders {
    constructor(code, name) {
        this.code = code;
        this.name = name;
        this.holders = [];
    }

    processRecord(record) {
        const holder =
            makeLink("/people/", record.person, record.personShortTitle);

        this.holders.push(holder);
    }
}

// Exports.
module.exports = ChivalricPageMaker;
