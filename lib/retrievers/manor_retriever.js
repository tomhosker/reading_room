/*
This code defines a class which retrieves the data relating to a MANOR from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const ManorPageMaker = require("../page_makers/manor_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class ManorRetriever extends Retriever {
    getPageMakerClass() {
        return ManorPageMaker;
    }

    startHere() {
        this.fetchManor();
    }

    fetchManor() {
        const query =
            "SELECT Manor.*, Master.short_title AS master_short_title, " +
                "Barony.code AS barony_code, Barony.name AS barony_name " +
            "FROM Manor " +
            "LEFT JOIN Person Master ON Master.code = Manor.master " +
            "LEFT JOIN Barony ON Barony.code = Manor.barony " +
            "WHERE Manor.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.manor = extract;
                that.wrapUp();
            } else that.res.send("No manor with key: " + this.key);
        });
    }
}

// Exports.
module.exports = ManorRetriever;
