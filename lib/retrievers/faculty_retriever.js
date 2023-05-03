/*
This code defines a class which retrieves the data relating to a given FACULTY
from the database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const FacultyPageMaker = require("../page_makers/faculty_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class FacultyRetriever extends Retriever {
    getPageMakerClass() {
        return FacultyPageMaker;
    }

    startHere() {
        this.fetchFaculty();
    }

    fetchFaculty() {
        const query =
            "SELECT Faculty.*, Person.code AS pro_vice_chancellor_code, " +
                "Person.short_title AS pro_vice_chancellor_short_title " +
            "FROM Faculty " +
            "LEFT JOIN Person ON Person.code = Faculty.pro_vice_chancellor " +
            "WHERE Faculty.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length === 0) {
                res.send("No faculty with key: " + this.key);
            }

            extract = extract[0];

            camelify(extract);
            that.data.faculty = extract;

            that.fetchDepartments();
        });
    }

    fetchDepartments() {
        const query =
            "SELECT * " +
            "FROM Department " +
            "WHERE faculty = ? " +
            "ORDER BY seniority ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.departments = extract;

console.log(that.data);

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = FacultyRetriever;
