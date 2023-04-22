/*
This code defines a class which retrieves a given table "AS IS" from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const AsIsPageMaker = require("../page_makers/asis_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class AsIsRetriever extends Retriever {
    getPageMakerClass() {
        return AsIsPageMaker;
    }

    startHere() {
        this.checkTableName();
    }

    checkTableName() {
        const query =
            "SELECT name " +
            "FROM sqlite_schema " +
            "WHERE type = 'table' AND name NOT LIKE 'sqlite_%';";
        let that = this;
        let tableNames = [];

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            for (let record of extract) {
                tableNames.push(record.name);
            }

            if (tableNames.includes(that.key)) that.fetchTable();
            else that.res.send("No table with name: " + that.key);
        });
    }

    fetchTable() {
        const query = "SELECT * FROM " + this.key + ";";
        let that = this;

        this.data.tableName = this.key;

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            that.data.table = extract;
            that.wrapUp();
        });
    }
}

// Exports.
module.exports = AsIsRetriever;
