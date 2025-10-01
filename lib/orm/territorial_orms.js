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
const SELECT_KINGDOM_KV_PAIRS = "SELECT * FROM KingdomKVPair;";
const SELECT_MANORS = "SELECT * FROM Manor WHERE barony = ?;";
const SELECT_BARONIES = "SELECT * FROM Barony WHERE county = ?;";
const SELECT_COUNTIES = "SELECT * FROM County WHERE duchy = ?;";
const SELECT_DUCHIES = "SELECT * FROM Duchy;";

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

    fetchPerson(personKey) {
        let orm;
        let result = null;

        if (personKey) {
            orm = new PersonORM(personKey);
            result = orm.getData();
        }

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

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.barony = this.fetchBarony();
            this.data.master = this.fetchPerson(this.data.master);
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class BaronyORM extends ManorORM {
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

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.county = this.fetchCounty();
            this.data.baron = this.fetchPerson(this.data.baron);
            this.data.knightLieutenant = this.fetchPerson(this.data.knightLieutenant);
            this.data.manors = this.fetch(SELECT_MANORS, [this.key]);
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class CountyORM extends ManorORM {
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

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.duchy = this.fetchDuchy();
            this.data.earl = this.fetchPerson(this.data.earl);
            this.data.lordLieutenant = this.fetchPerson(this.data.lordLieutenant);
            this.data.baronies = this.fetch(SELECT_BARONIES, [this.key]);
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class DuchyORM extends ManorORM {
    fetchCore() {
        let result = this.fetch(SELECT_DUCHY, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.duke = this.fetchPerson(this.data.duke);
            this.data.lordWarden = this.fetchPerson(this.data.lordWarden);
            this.data.counties = this.fetch(SELECT_COUNTIES, [this.key]);
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

class KingdomORM extends ManorORM {
    fetchCore() {
        const raw = this.fetch(SELECT_KINGDOM_KV_PAIRS, []);
        const result = {};

        for (let pair of raw) {
            result[pair.key] = pair.val;
        }

        return result;
    }

    fetchRegent() {
        let result = null;

        if ("regent" in this.data) {
            result = this.fetchPerson(this.data.regent);
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (this.complex) {
            this.data.regent = this.fetchRegent();
            this.data.duchies = this.fetch(SELECT_DUCHIES, []);
            this.data.title = "Overview of the Kingdom";
        }

        this.retriever.close();

        return true;
    }
}

// Exports.
module.exports = {ManorORM, BaronyORM, CountyORM, DuchyORM, KingdomORM};