/*
Several object-relational models, for Academy-related stuff.
*/

// Local imports.
const ORM = require("./orm.js");
const PersonORM = require("./person_orm.js");
const {LIBRARY_QUERIES, getLibrary} = require("./media_orms.js");

// Queries.
const SELECT_DEPARTMENT = "SELECT * FROM Department WHERE code = ?;";
const SELECT_FACULTY = "SELECT * FROM Faculty WHERE code = ?;";
const SELECT_ACADEMY_KV_PAIRS = "SELECT * FROM AcademyKVPair;";
const SELECT_DEPARTMENTS = "SELECT * FROM Department WHERE Faculty = ?;";
const SELECT_FACULTIES = "SELECT * FROM Faculty;";

/*************
 ** CLASSES **
 ************/

class DepartmentORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_DEPARTMENT, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchPerson(personKey) {
        let orm;
        let result = null;

        if (personKey) {
            orm = new PersonORM(personKey);
            result = orm.getData();
        }

        return result;
    }

    fetchFaculty() {
        let orm;
        let result = null;

        if (this.data.faculty) {
            orm = new FacultyORM(this.data.faculty);
            result = orm.getData();
        }

        return result;
    }

    fetchLibrary() {
        let result = null;

        if (this.key === "theology") {
            result = {
                theology: getLibrary(LIBRARY_QUERIES.theologyTheology),
                hebrew: getLibrary(LIBRARY_QUERIES.theologyHebrew),
                greek: getLibrary(LIBRARY_QUERIES.theologyGreek),
                latin: getLibrary(LIBRARY_QUERIES.theologyLatin),
            };
        } else if (this.key === "philosophy") {
            result = getLibrary(LIBRARY_QUERIES.philosophy);
        } else if (this.key === "mathematics") {
            result = getLibrary(LIBRARY_QUERIES.mathematics);
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.faculty = this.fetchFaculty();
            this.data.professor = this.fetchPerson(this.data.professor);
            this.data.library = this.fetchLibrary();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class FacultyORM extends DepartmentORM {
    fetchCore() {
        let result = this.fetch(SELECT_FACULTY, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.proViceChancellor = this.fetchPerson(this.data.proViceChancellor);
            this.data.departments = this.fetch(SELECT_DEPARTMENTS, [this.key]);
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class AcademyORM extends DepartmentORM {
    fetchCore() {
        const raw = this.fetch(SELECT_ACADEMY_KV_PAIRS, []);
        const result = {};

        for (let pair of raw) {
            result[pair.key] = pair.val;
        }

        return result;
    }

    fetchChancellor() {
        let result = null;

        if ("chancellor" in this.data) {
            result = this.fetchPerson(this.data.chancellor);
        }

        return result;
    }

    fetchViceChancellor() {
        let result = null;

        if ("viceChancellor" in this.data) {
            result = this.fetchPerson(this.data.viceChancellor);
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (this.complex) {
            this.data.chancellor = this.fetchChancellor();
            this.data.viceChancellor = this.fetchViceChancellor();
            this.data.faculties = this.fetch(SELECT_FACULTIES, []);
            this.data.title = "Royal Cyprian Academy";
        }

        this.retriever.close();

        return true;
    }
}

// Exports.
module.exports = {DepartmentORM, FacultyORM, AcademyORM};