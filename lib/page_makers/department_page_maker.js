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

        if (this.data.department.professorCode) {
            this.pageProperties.professorLink =
                makeLink(
                    "/people/",
                    this.data.department.professorCode,
                    this.data.department.professorShortTitle
                );
        } else this.pageProperties.professorLink = constants.REX;

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
        this.pageProperties.library = this.data.library;

        this.wrapUp();
    }
}

// Exports.
module.exports = DepartmentPageMaker;
