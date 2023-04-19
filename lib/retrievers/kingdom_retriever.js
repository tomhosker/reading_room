/*
This code defines a class which retrieves the data relating to the KINGDOM as a
whole from the database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelifyList } = require("../utils.js");
const KingdomPageMaker = require("../page_makers/kingdom_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class KingdomRetriever extends Retriever {
    getPageMakerClass() {
        return KingdomPageMaker;
    }

    startHere() {
        this.fetchKingdomKVPairs();
    }

    fetchKingdomKVPairs() {
        const query = "SELECT * FROM KingdomKVPair;";
        let that = this;

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.kingdomKVPairs = extract;

            that.fetchDuchies();
        });
    }

    fetchDuchies() {
        const query =
            "SELECT Duchy.*, Duke.short_title AS duke_short_title " +
            "FROM Duchy " +
            "LEFT JOIN Person Duke ON Duke.code = Duchy.duke " +
            "ORDER BY seniority ASC;";
        let that = this;

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.duchies = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = KingdomRetriever;
