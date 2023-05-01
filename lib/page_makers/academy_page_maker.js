/*
This code defines a class which delivers the ACADEMY page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class AcademyPageMaker extends PageMaker {
    getTitle() {
        return "Royal Cyprian Academy";
    }

    getView() {
        return "academy";
    }

    makePageProperties() {
        if (this.data.chancellor) {
            this.pageProperties.chancellorLink =
                makeLink(
                    "/people/",
                    this.data.chancellor.code,
                    this.data.chancellor.shortTitle
                );
        } else this.pageProperties.chancellorLink = constants.REX;

        if (this.data.viceChancellor) {
            this.pageProperties.viceChancellorLink =
                makeLink(
                    "/people/",
                    this.data.viceChancellor.code,
                    this.data.viceChancellor.shortTitle
                );
        } else this.pageProperties.viceChancellorLink = constants.REX;

        this.pageProperties.faculties = makeFaculties(this.data.faculties);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeFaculties(facultyData) {
    let result = [];
    let link;

    if (facultyData.length === 0) return null;

    for (let record of facultyData) {
        link = makeLink("/academy/faculties/", record.code, record.name);
        result.push(link);
    }

    return result;
}

// Exports.
module.exports = AcademyPageMaker;
