/*
An object-relational model for a chivalric order.
*/

// Local imports.
const ORM = require("./orm.js");
const {getSimplexPerson} = require("./person_orm.js");

// Queries.
const SELECT_CHIVALRIC = "SELECT * FROM Chivalric WHERE code = ?;";
const SELECT_ACCOLADE = "SELECT * FROM Accolade WHERE code = ?;";
const SELECT_ACCOLADES =
    "SELECT * "+
    "FROM Accolade "+
    "WHERE chivalric = ? "+
    "ORDER BY tier DESC, precedence ASC;";
const SELECT_ACCOLADE_HOLDERS =
    "SELECT Holds.* "+
    "FROM Holds "+
    "JOIN Person ON Person.code = Holds.person "+
    "WHERE Holds.accolade = ? "+
    "ORDER BY Person.rank_tier DESC, Person.posthumous_tier DESC;";

/****************
 ** MAIN CLASS **
 ***************/

class ChivalricORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_CHIVALRIC, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchAccolades() {
        const rawKeys = this.fetch(SELECT_ACCOLADES, [this.key]);
        const keys = [];
        const result = [];

        for (let row of rawKeys) {
            keys.push(row.code);
        }

        for (let key of keys) {
            result.push(getAccolade(key));
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            if (this.data.master) {
                this.data.master = getSimplexPerson(this.data.master);
            }

            this.data.accolades = this.fetchAccolades();
            this.data.title = this.data.name;
        }

        this.retriever.close();

        return true;
    }
}

/**********************************
 ** HELPER CLASSES AND FUNCTIONS **
 *********************************/

class AccoladeORM extends ORM {
    fetchCore() {
        const result = this.fetch(SELECT_ACCOLADE, [this.key])[0];

        return result;
    }

    fetchHolders() {
        const rawKeys = this.fetch(SELECT_ACCOLADE_HOLDERS, [this.key]);
        const keys = [];
        const result = [];

        if (rawKeys.length === 0) return null;

        for (let row of rawKeys) {
            keys.push(row.person);
        }

        for (let key of keys) {
            result.push(getSimplexPerson(key))
        }

        return result;
    }

    fill() {
        this.data = this.fetchCore();
        this.data.holders = this.fetchHolders();
    }
}

function getAccolade(key) {
    const orm = new AccoladeORM(key);
    const result = orm.getData();

    return result;
}

// Exports.
module.exports = ChivalricORM;