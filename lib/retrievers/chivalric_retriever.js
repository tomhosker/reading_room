/*
This code defines a class which retrieves the data relating to a CHIVALRIC ORDER
from the database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const ChivalricPageMaker = require("../page_makers/chivalric_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class ChivalricRetriever extends Retriever {
    getPageMakerClass() {
        return ChivalricPageMaker;
    }

    startHere() {
        this.fetchChivalric();
    }

    fetchChivalric() {
        const query =
            "SELECT Chivalric.*, Master.short_title AS master_short_title " +
            "FROM Chivalric " +
            "LEFT JOIN Person Master ON Master.code = Chivalric.master " +
            "WHERE Chivalric.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.chivalric = extract;
                that.fetchAccolades();
            } else that.res.send("No chivalric order with key: " + that.key);
        });
    }

    fetchAccolades() {
        const query =
            "SELECT * " +
            "FROM Accolade " +
            "WHERE chivalric = ? " +
            "ORDER BY tier DESC, precedence ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.accolades = extract;

            that.fetchHolders();
        });
    }

    fetchHolders() {
        const query =
            "SELECT Holds.*, Person.short_title AS person_short_title " +
            "FROM Holds " +
            "JOIN Person ON Person.code = Holds.person " +
            "JOIN Accolade ON Accolade.code = Holds.accolade " +
            "WHERE Accolade.chivalric = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.holders = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = ChivalricRetriever;
