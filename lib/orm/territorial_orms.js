/*
Several object-relational models, for territorial stuff.
*/

// Local imports.
const ORM = require("./orm.js");
const PersonORM = require("./person_orm.js");

// Queries.
const SELECT_MANOR = "SELECT * FROM Manor WHERE code = ?;";
const SELECT_BARONY = "SELECT * FROM Barony WHERE code = ?;";
const SELECT_COUNTY = "SELECT * FROM County WHERE code = ?;";
const SELECT_DUCHY = "SELECT * FROM Duchy WHERE code = ?;";
const SELECT_MANORS = "SELECT * FROM Manor WHERE barony = ?;";
const SELECT_BARONIES = "SELECT * FROM Barony WHERE county = ?;";
const SELECT_COUNTIES = "SELECT * FROM County WHERE duchy = ?;";

/*************
 ** CLASSES **
 ************/

class ManorORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_MANOR, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchBarony() {
        let orm;
        let result = null;

        if (this.data.barony) {
            orm = new BaronyORM(this.data.barony);
            result = orm.getData();
        }

        return result;
    }

    fetchMaster() {
        let orm;
        let result = null;

        if (this.data.master) {
            orm = new PersonORM(this.data.master);
            result = orm.getData();
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.barony = this.fetchBarony();
            this.data.master = this.fetchMaster();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class BaronyORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_BARONY, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchCounty() {
        let orm;
        let result = null;

        if (this.data.county) {
            orm = new CountyORM(this.data.county);
            result = orm.getData();
        }

        return result;
    }

    fetchBaron() {
        let orm;
        let result = null;

        if (this.data.baron) {
            orm = new PersonORM(this.data.baron);
            result = orm.getData();
        }

        return result;
    }

    fetchManors() {
        const result = this.fetch(SELECT_MANORS, [this.key]);

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.county = this.fetchCounty();
            this.data.baron = this.fetchBaron();
            this.data.manors = this.fetchManors();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class CountyORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_COUNTY, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchDuchy() {
        let orm;
        let result = null;

        if (this.data.duchy) {
            orm = new DuchyORM(this.data.duchy);
            result = orm.getData();
        }

        return result;
    }

    fetchEarl() {
        let orm;
        let result = null;

        if (this.data.earl) {
            orm = new PersonORM(this.data.earl);
            result = orm.getData();
        }

        return result;
    }

    fetchBaronies() {
        const result = this.fetch(SELECT_BARONIES, [this.key]);

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.duchy = this.fetchDuchy();
            this.data.earl = this.fetchEarl();
            this.data.baronies = this.fetchBaronies();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class DuchyORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_DUCHY, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchDuke() {
        let orm;
        let result = null;

        if (this.data.duke) {
            orm = new PersonORM(this.data.duke);
            result = orm.getData();
        }

        return result;
    }

    fetchCounties() {
        const result = this.fetch(SELECT_COUNTIES, [this.key]);

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.duke = this.fetchDuke();
            this.data.counties = this.fetchCounties();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

// Exports.
module.exports = {ManorORM, BaronyORM, CountyORM, DuchyORM};