/*
This code defines a class which delivers a DUCHY page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class DuchyPageMaker extends PageMaker {
    getTitle() {
        return this.data.duchy.name;
    }

    getView() {
        return "duchy";
    }

    makePageProperties() {
        if (this.data.duchy.duke) {
            this.pageProperties.dukeLink =
                makeLink(
                    "/people/",
                    this.data.duchy.duke,
                    this.data.duchy.dukeShortTitle
                );
        } else this.pageProperties.dukeLink = constants.REX;

        if (this.data.duchy.lordWarden) {
            this.pageProperties.lordWardenLink =
                makeLink(
                    "/people/",
                    this.data.duchy.lordWarden,
                    this.data.duchy.lordWardenShortTitle
                );
        } else this.pageProperties.lordWardenLink = constants.REX;

        this.pageProperties.arms = this.data.duchy.arms;
        this.pageProperties.counties = makeCounties(this.data.counties);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeCounties(countyData) {
    let result = [];
    let countyLink, earlLink;

    for (let record of countyData) {
        countyLink =
            makeLink("/territories/counties/", record.code, record.name);
        earlLink = constants.REX;

        if (record.earl) {
            earlLink = makeLink("/people/", record.earl, record.earlShortTitle);
        }

        result.push({ countyLink: countyLink, earlLink: earlLink });
    }

    return result;
}

// Exports.
module.exports = DuchyPageMaker;
