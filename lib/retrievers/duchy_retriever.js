/*
This code defines a class which retrieves the data relating to a DUCHY from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const DuchyPageMaker = require("../page_makers/duchy_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class DuchyRetriever extends Retriever {
    getPageMakerClass() {
        return DuchyPageMaker;
    }

    startHere() {
        this.fetchDuchy();
    }

    fetchDuchy() {
        const query =
            "SELECT Duchy.*, Duke.short_title AS duke_short_title, " +
                "LordWarden.short_title AS lord_warden_short_title "+
            "FROM Duchy " +
            "LEFT JOIN Person Duke ON Duke.code = Duchy.duke " +
            "LEFT JOIN Person LordWarden ON LordWarden.code = " +
                "Duchy.lord_warden " +
            "WHERE Duchy.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.duchy = extract;
                that.fetchCounties();
            } else that.res.send("No duchy with key: " + this.key);
        });
    }

    fetchCounties() {
        const query =
            "SELECT County.*, Earl.short_title AS earl_short_title " +
            "FROM County " +
            "LEFT JOIN Person Earl ON Earl.code = County.earl " +
            "WHERE County.duchy = ? " +
            "ORDER BY County.seniority ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.counties = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = DuchyRetriever;
