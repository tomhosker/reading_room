/*
This code defines a class which delivers a table "AS IS".
*/

// Local imports.
const constants = require("../constants.js");
const PageMaker = require("./page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class AsIsPageMaker extends PageMaker {
    getTitle() {
        const result = "table:" + this.data.tableName;

        return result;
    }

    getView() {
        return "asis";
    }

    makeHeadings() {
        const record0 = this.data.table[0];
        let result = [];

        for (let property in record0) {
            if (record0.hasOwnProperty(property)) result.push(property);
        }

        return result;
    }

    makeRows() {
        let result = [];
        let row;

        for (let record of this.data.table) {
            row = [];

            for (let property in record) {
                if (record.hasOwnProperty(property)) row.push(record[property]);
            }

            result.push(row);
        }

        return result;
    }

    makePageProperties() {
        this.pageProperties.headings = this.makeHeadings();
        this.pageProperties.rows = this.makeRows();

        this.wrapUp();
    }
}

// Exports.
module.exports = AsIsPageMaker;
