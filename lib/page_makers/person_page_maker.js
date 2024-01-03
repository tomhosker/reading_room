/*
This code defines a class which delivers a PERSON page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { copyPropertiesOfLeftToRight, makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class PersonPageMaker extends PageMaker {
    getTitle() {
        const shortishTitle = this.data.person.shortishTitle;

        if (shortishTitle) return shortishTitle;

        return this.data.person.shortTitle;
    }

    getView() {
        return "person";
    }

    makeBloodlinks() {
        let links = [];
        let result, nominative, possessive;

        if (this.data.person.isMale) {
            nominative = "He";
            possessive = "his";
        } else {
            nominative = "She";
            possessive = "her";
        }

        for (let record of this.data.bloodlinks) {
            links.push(
                makeBloodlink(
                    record,
                    this.data.person.code,
                    nominative,
                    possessive
                )
            );
        }

        result = links.join(" ");

        return result;
    }

    makeAccolades() {
        let result = [];
        let accoladeLink;

        if (this.data.accolades.length === 0) return null;

        for (let accolade of this.data.accolades) {
            accoladeLink =
                makeLink("/chivalric/", accolade.chivalric, accolade.name);
            result.push(accoladeLink);
        }

        return result;
    }

    makePageProperties() {
        copyPropertiesOfLeftToRight(this.data.person, this.pageProperties);

        if (this.data.person.isMale) {
            this.pageProperties.rankNameGendered = this.data.person.rankName;
        } else {
            this.pageProperties.rankNameGendered =
                this.data.person.rankNameFemale;
        }

        this.pageProperties.bloodlinks = this.makeBloodlinks();
        this.pageProperties.accolades = this.makeAccolades();

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeBloodlink(record, pageKey, nominative, possessive) {
console.log(record);
console.log(pageKey);
console.log(nominative);
console.log(possessive);
    let result, relation;

    if (record.senior === pageKey) {
        relation =
            makeLink("/people/", record.junior, record.juniorShortTitle);
        result =
            nominative +
            " is the " +
            record.linkInEnglish +
            " of " +
            relation +
            ".";
    } else {
        relation =
            makeLink("/people/", record.senior, record.seniorShortTitle);
        result =
            relation +
            " is " +
            possessive +
            " " +
            record.linkInEnglish +
            ".";
    }

    return result;
}

// Exports.
module.exports = PersonPageMaker;
