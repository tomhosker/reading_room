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

        this.pageProperties.accolades = this.makeAccolades();

        this.wrapUp();
    }
}

// Exports.
module.exports = PersonPageMaker;
