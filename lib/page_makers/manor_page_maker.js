/*
This code defines a class which delivers a MANOR page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class ManorPageMaker extends PageMaker {
    getTitle() {
        return this.data.manor.name;
    }

    getView() {
        return "manor";
    }

    makePageProperties() {
        if (this.data.manor.master) {
            this.pageProperties.masterLink =
                makeLink(
                    "/people/",
                    this.data.manor.master,
                    this.data.manor.masterShortTitle
                );
        } else this.pageProperties.masterLink = constants.REX;

        if (this.data.manor.barony) {
            this.pageProperties.baronyLink =
                makeLink(
                    "/territories/baronies/",
                    this.data.manor.barony,
                    this.data.manor.baronyName
                );
        } else this.pageProperties.baronyLink = null;

        this.pageProperties.arms = this.data.manor.arms;

        this.wrapUp();
    }
}

// Exports.
module.exports = ManorPageMaker;
