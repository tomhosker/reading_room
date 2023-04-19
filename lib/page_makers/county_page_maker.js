/*
This code defines a class which delivers a COUNTY page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class CountyPageMaker extends PageMaker {
    getTitle() {
        return this.data.county.name;
    }

    getView() {
        return "county";
    }

    makePageProperties() {
        if (this.data.county.earl) {
            this.pageProperties.earlLink =
                makeLink(
                    "/people/",
                    this.data.county.earl,
                    this.data.county.earlShortTitle
                );
        } else this.pageProperties.earlLink = constants.REX;

        if (this.data.county.lordLieutenant) {
            this.pageProperties.lordLieutenantLink =
                makeLink(
                    "/people/",
                    this.data.county.lordLieutenant,
                    this.data.county.lordLieutenantShortTitle
                );
        } else this.pageProperties.lordLieutenantLink = constants.REX;

        if (this.data.county.duchy) {
            this.pageProperties.duchyLink =
                makeLink(
                    "/territories/duchies/",
                    this.data.county.duchy,
                    this.data.county.duchyName
                );
        } else this.pageProperties.duchyLink = null;

        this.pageProperties.arms = this.data.county.arms;
        this.pageProperties.baronies = makeBaronies(this.data.baronies);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeBaronies(baronyData) {
    let result = [];
    let baronyLink, baronLink;

    for (let record of baronyData) {
        baronyLink =
            makeLink("/territories/baronies/", record.code, record.name);
        baronLink = constants.REX;

        if (record.baron) {
            baronLink =
                makeLink("/people/", record.baron, record.baronShortTitle);
        }

        result.push({ baronyLink: baronyLink, baronLink: baronLink });
    }

    return result;
}

// Exports.
module.exports = CountyPageMaker;
