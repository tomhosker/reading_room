/*
This code defines a class which delivers a DEPARTMENT page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class DepartmentPageMaker extends PageMaker {
    getTitle() {
        return this.data.department.name;
    }

    getView() {
        return "department";
    }

    makePageProperties() {
        this.pageProperties.key = this.data.department.code;

        if (this.data.department.proViceChancellorCode) {
            this.pageProperties.proViceChancellorLink =
                makeLink(
                    "/people/",
                    this.data.department.proViceChancellorCode,
                    this.data.department.proViceChancellorShortTitle
                );
        } else this.pageProperties.proViceChancellorLink = constants.REX;

        if (this.data.department.facultyCode) {
            this.pageProperties.facultyLink =
                makeLink(
                    "/academy/faculties/",
                    this.data.department.facultyCode,
                    this.data.department.facultyName
                );
        } else this.pageProperties.facultyLink = null;

        this.pageProperties.arms = this.data.department.arms;
        this.pageProperties.description = this.data.department.description;

        this.wrapUp();
    }
}

// Exports.
module.exports = DepartmentPageMaker;
