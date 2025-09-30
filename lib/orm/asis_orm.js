/*
An object-relational model for an table from the database "as is".
*/

// Local imports.
const ORM = require("./orm.js");

// Queries.
const SELECT_TABLE_NAMES =
    "SELECT name FROM sqlite_master WHERE type = 'table';"

/****************
 ** MAIN CLASS **
 ***************/

class AsIsORM extends ORM {
    fetchRaw() {
        const query = `SELECT * FROM ${this.key};`;
        let result;

        if (!this.checkTableName()) return false;

        result = this.fetch(query, []);

        return result;
    }

    checkTableName() {
        const validTableNames = this.getValidTableNames();

        if (validTableNames.includes(this.key)) return true;

        return false;
    }

    getValidTableNames() {
        const raw = this.fetch(SELECT_TABLE_NAMES, []);
        const result = [];

        for (let row of raw) {
            result.push(row.name);
        }

        return result;
    }

    getTitle() {
        const result = `table:${this.key}`;

        return result;
    }

    fill() {
        this.raw = this.fetchRaw();

        if (!this.raw) return false;

        this.data.title = this.getTitle();

        this.retriever.close();

        return true;
    }
}

// Exports.
module.exports = {AsIsORM};