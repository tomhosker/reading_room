/*
This code defines a class which retrieves the data relating to a given
DEPARTMENT from the database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const DepartmentPageMaker = require("../page_makers/department_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class DepartmentRetriever extends Retriever {
    getPageMakerClass() {
        return DepartmentPageMaker;
    }

    startHere() {
        this.fetchDepartment();
    }

    fetchDepartment() {
        const query =
            "SELECT Department.*, Person.code AS professor_code, " +
                "Person.short_title AS professor_short_title, " +
                "Faculty.code AS faculty_code, Faculty.name AS faculty_name " +
            "FROM Department " +
            "LEFT JOIN Person ON Person.code = Department.professor " +
            "LEFT JOIN Faculty ON Faculty.code = Department.faculty " +
            "WHERE Department.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length === 0) {
                this.res.send("No department with key: " + this.key);
            }

            extract = extract[0];

            camelify(extract);
            that.data.department = extract;

            that.fetchLibrary();
        });
    }

    fetchLibrary() {
        const query =
            "SELECT Book.*, Author.surname, Author.short_title " +
            "FROM Book " +
            "LEFT JOIN Author ON Author.code = Book.author " +
            "WHERE Book.genre = ? " +
            "ORDER BY Author.surname, Author.short_title, " +
                "Book.year_published, Book.title;";
        let that = this;

        this.media.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);

            if (extract.length === 0) extract = null;

            that.data.library = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = DepartmentRetriever;
