/*
This code defines a class which delivers a FACULTY page.
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");
const { makeLink } = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class FacultyPageMaker extends PageMaker {
    getTitle() {
        return this.data.faculty.name;
    }

    getView() {
        return "faculty";
    }

    makePageProperties() {
        this.pageProperties.key = this.data.faculty.code;

        if (this.data.faculty.proViceChancellorCode) {
            this.pageProperties.proViceChancellorLink =
                makeLink(
                    "/people/",
                    this.data.faculty.proViceChancellorCode,
                    this.data.faculty.proViceChancellorShortTitle
                );
        } else this.pageProperties.proViceChancellorLink = constants.REX;

        this.pageProperties.arms = this.data.faculty.arms;
        this.pageProperties.description = this.data.faculty.description;
        this.pageProperties.departments =
            makeDepartments(this.data.departments);

        this.wrapUp();
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

function makeDepartments(departmentData) {
    let result = [];
    let link;

    if (departmentData.length === 0) return null;

    for (let record of departmentData) {
        link = makeLink("/academy/departments/", record.code, record.name);
        result.push(link);
    }

console.log(result);

    return result;
}

// Exports.
module.exports = FacultyPageMaker;
