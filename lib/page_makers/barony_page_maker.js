/*
This code defines a class which delivers a BARONY page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class BaronyPageMaker extends PageMaker {
    getTitle() {
        return this.data.barony.name;
    }

    getView() {
        return "barony";
    }

    makePageProperties() {
        if (this.data.barony.baron) {
            this.pageProperties.baronLink =
                makeLink(
                    "/people/",
                    this.data.barony.baron,
                    this.data.barony.baronShortTitle
                );
        } else this.pageProperties.baronLink = constants.REX;

        if (this.data.barony.knightLieutenant) {
            this.pageProperties.knightLieutenantLink =
                makeLink(
                    "/people/",
                    this.data.barony.knightLieutenant,
                    this.data.barony.knightLieutenantShortTitle
                );
        } else this.pageProperties.knightLieutenantLink = constants.REX;

        if (this.data.barony.county) {
            this.pageProperties.countyLink =
                makeLink(
                    "/territories/counties/",
                    this.data.barony.county,
                    this.data.barony.countyName
                );
        } else this.pageProperties.countyLink = null;

        this.pageProperties.arms = this.data.barony.arms;
        this.pageProperties.manors = makeManors(this.data.manors);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeManors(manorData) {
    let result = [];
    let manorLink, masterLink;

    for (let record of manorData) {
        manorLink = makeLink("/territories/manors/", record.code, record.name);
        masterLink = constants.REX;

        if (record.master) {
            masterLink =
                makeLink("/people/", record.master, record.masterShortTitle);
        }

        result.push({ manorLink: manorLink, masterLink: masterLink });
    }

    return result;
}

// Exports.
module.exports = BaronyPageMaker;
