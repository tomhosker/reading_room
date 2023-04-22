/*
This code defines a class which retrieves the data relating to a COUNTY from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const CountyPageMaker = require("../page_makers/county_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class CountyRetriever extends Retriever {
    getPageMakerClass() {
        return CountyPageMaker;
    }

    startHere() {
        this.fetchCounty();
    }

    fetchCounty() {
        const query =
            "SELECT County.*, Earl.short_title AS earl_short_title, " +
                "LordLieutenant.short_title AS lord_lieutenant_short_title, " +
                "Duchy.code AS duchy_code, Duchy.name AS duchy_name " +
            "FROM County " +
            "LEFT JOIN Person Earl ON Earl.code = County.earl " +
            "LEFT JOIN Person LordLieutenant ON LordLieutenant.code = " +
                "County.lord_lieutenant " +
            "LEFT JOIN Duchy ON Duchy.code = County.duchy " +
            "WHERE County.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.county = extract;
                that.fetchBaronies();
            } else that.res.send("No county with key: " + that.key);
        });
    }

    fetchBaronies() {
        const query =
            "SELECT Barony.*, Baron.short_title AS baron_short_title " +
            "FROM Barony " +
            "LEFT JOIN Person Baron ON Baron.code = Barony.baron " +
            "WHERE Barony.county = ? " +
            "ORDER BY Barony.seniority ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.baronies = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = CountyRetriever;
