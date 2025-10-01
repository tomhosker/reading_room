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

    makeHeadings() {
        const record0 = this.raw[0];
        let result = [];

        for (let property in record0) {
            if (record0.hasOwnProperty(property)) result.push(property);
        }

        return result;
    }

    makeRows() {
        let result = [];
        let row;

        for (let record of this.raw) {
            row = [];

            for (let property in record) {
                if (record.hasOwnProperty(property)) row.push(record[property]);
            }

            result.push(row);
        }

        return result;
    }

    fill() {
        this.raw = this.fetchRaw();

        if (!this.raw) return false;

        this.data = {
            title: this.getTitle(),
            headings: this.makeHeadings(),
            rows: this.makeRows()
        };

        this.retriever.close();

        return true;
    }
}

// Exports.
module.exports = {AsIsORM};