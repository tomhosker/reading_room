/*
This code defines a class which retrieves the data relating to the Cyprian Royal
ACADEMY as a whole from the database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const AcademyPageMaker = require("../page_makers/academy_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class AcademyRetriever extends Retriever {
    getPageMakerClass() {
        return AcademyPageMaker;
    }

    startHere() {
        this.fetchAcademyKVPairs();
    }

    fetchAcademyKVPairs() {
        const query = "SELECT * FROM AcademyKVPair;";
        let that = this;

        this.data.kvPairs = {};

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            camelifyList(extract);

            for (let record of extract) {
                that.data.kvPairs[record.key] = record.val;
            }

            that.fetchChancellor();
        });
    }

    fetchChancellor() {
        const query = "SELECT * FROM Person WHERE code = ?;";
        const chancellorCode = this.data.kvPairs.chancellor;
        let that = this;

        if (chancellorCode) {
            this.db.all(query, [chancellorCode], function (err, extract) {
                if (err) throw err;

                if (extract.length === 0) {
                    throw Error(
                        "No person with code supplied for chancellor: " +
                        chancellorCode
                    );
                }

                extract = extract[0];
                camelify(extract);
                that.data.chancellor = extract;
                that.fetchViceChancellor();
            });
        } else this.fetchViceChancellor();
    }

    fetchViceChancellor() {
        const query = "SELECT * FROM Person WHERE code = ?;";
        const viceChancellorCode = this.data.kvPairs.viceChancellor;
        let that = this;

        if (viceChancellorCode) {
            this.db.all(query, [viceChancellorCode], function (err, extract) {
                if (err) throw err;

                if (extract.length === 0) {
                    throw Error(
                        "No person with code supplied for vice-chancellor: " +
                        chancellorCode
                    );
                }

                extract = extract[0];
                camelify(extract);
                that.data.viceChancellor = extract;
                that.fetchFaculties();
            });
        } else this.fetchFaculties();
    }

    fetchFaculties() {
        const query = "SELECT * FROM Faculty ORDER BY seniority ASC;";
        let that = this;

        this.db.all(query, function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.faculties = extract;

            that.wrapUp();
        });
    }
}

// Exports.
module.exports = AcademyRetriever;
