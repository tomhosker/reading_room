/*
An object-relational model for a person.
*/

// Local imports.
const ORM = require("./orm.js");

// Queries.
const SELECT_CORE = "SELECT * FROM Person WHERE code = ?;";
const SELECT_RANK_TIER = "SELECT * FROM RankTier WHERE tier = ?;";
const SELECT_BLOODLINKS =
    "SELECT BloodLink.* "+
    "FROM BloodLink "+
    "JOIN BloodLinkType ON BloodLinkType.code = BloodLink.type "+
    "WHERE BloodLink.senior = ? OR BloodLink.junior = ? "+
    "ORDER BY BloodLinkType.seniority ASC;";
const SELECT_ACCOLADES =
    "SELECT Holds.* "+
    "FROM Holds "+
    "JOIN Accolade ON Accolade.code = Holds.accolade "+
    "JOIN Chivalric ON Chivalric.code = Accolade.chivalric "+
    "WHERE Holds.person = ? "+
    "ORDER BY Accolade.tier ASC, Chivalric.seniority ASC, Chivalric.name;";
const SELECT_ACCOLADE = "SELECT * FROM Accolade WHERE code = ?;";
const SELECT_CHIVALRIC = "SELECT * FROM Chivalric WHERE code = ?;";

/****************
 ** MAIN CLASS **
 ***************/

class PersonORM extends ORM {
    fetchCore() {
        let result = this.fetch(SELECT_CORE, [this.key]);

        if (result.length !== 1) return false;

        result = result[0];

        return result;
    }

    fetchRankTier() {
        const raw = this.fetch(SELECT_RANK_TIER, [this.data.rankTier]);
        const result = raw[0];

        return result;
    }

    fetchBloodLinks() {
        const raw = this.fetch(SELECT_BLOODLINKS, [this.key, this.key]);
        const result = [];
        let elaboratedRow;

        for (let row of raw) {
            elaboratedRow = row;

            if (row.senior === this.key) {
                elaboratedRow.junior = getSimplexPerson(row.junior);
            } else if (row.junior === this.key) {
                elaboratedRow.senior = getSimplexPerson(row.senior);
            }

            result.push(elaboratedRow);
        }

        return result;
    }

    fetchAccolades() {
        const raw = this.fetch(SELECT_ACCOLADES, [this.key]);
        const result = [];

        for (let row of raw) {
            result.push(getAccolade(row.accolade));
        }

        return result;
    }

    getTitle() {
        if (this.data.shortishTitle) return this.data.shortishTitle;

        return this.data.shortTitle;
    }

    fill() {
        this.data = this.fetchCore();

        if (!this.data) return false;

        if (this.complex) {
            this.data.rankTier = this.fetchRankTier();
            this.data.bloodLinks = this.fetchBloodLinks();
            this.data.accolades = this.fetchAccolades();
            this.data.title = this.getTitle();
        }

        this.retriever.close();

        return true;
    }
}

/**********************************
 ** HELPER CLASSES AND FUNCTIONS **
 *********************************/

class AccoldadeORM extends ORM {
    fetchCore() {
        const raw = this.fetch(SELECT_ACCOLADE, [this.key]);
        const result = raw[0];

        return result;
    }

    fill() {
        this.data = this.fetchCore();
        this.data.chivalric = this.fetch(SELECT_CHIVALRIC, [this.data.chivalric])[0];
    }
}

function getSimplexPerson(key) {
    const orm = new PersonORM(key);
    const result = orm.getData();

    return result;
}

function getAccolade(key) {
    const orm = new AccoldadeORM(key);
    const result = orm.getData();

    return result;
}

// Exports.
module.exports = PersonORM;