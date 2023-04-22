/*
This code defines a class which retrieves the data relating to a BARONY from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const BaronyPageMaker = require("../page_makers/barony_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class BaronyRetriever extends Retriever {
    getPageMakerClass() {
        return BaronyPageMaker;
    }

    startHere() {
        this.fetchBarony();
    }

    fetchBarony() {
        const query =
            "SELECT Barony.*, Baron.short_title AS baron_short_title, " +
                "KnightLieutenant.short_title AS " +
                "knight_lieutenant_short_title, " +
                "County.code AS county_code, County.name AS county_name " +
            "FROM Barony " +
            "LEFT JOIN Person Baron ON Baron.code = Barony.baron " +
            "LEFT JOIN Person KnightLieutenant ON KnightLieutenant.code = " +
                "Barony.knight_lieutenant " +
            "LEFT JOIN County ON County.code = Barony.county " +
            "WHERE Barony.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.barony = extract;
                that.fetchManors();
            } else that.res.send("No barony with key: " + that.key);
        });
    }

    fetchManors() {
        const query =
            "SELECT Manor.*, Master.short_title AS master_short_title " +
            "FROM Manor " +
            "LEFT JOIN Person Master ON Master.code = Manor.master " +
            "WHERE Manor.barony = ? " +
            "ORDER BY Manor.seniority ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.manors = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = BaronyRetriever;
