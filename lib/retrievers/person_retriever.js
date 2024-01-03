/*
This code defines a class which retrieves the data relating to a PERSON from the
database.
*/

// Local imports.
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const PersonPageMaker = require("../page_makers/person_page_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class PersonRetriever extends Retriever {
    getPageMakerClass() {
        return PersonPageMaker;
    }

    startHere() {
        this.fetchPerson();
    }

    fetchPerson() {
        const query =
            "SELECT Person.*, RankTier.name AS rank_name, " +
                "RankTier.name_female AS rank_name_female " +
            "FROM Person " +
            "JOIN RankTier ON RankTier.tier = Person.rank_tier " +
            "WHERE Person.code = ?;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            if (extract.length > 0) {
                extract = extract[0];
                camelify(extract);
                that.data.person = extract;
                that.fetchBloodlinks();
            } else that.res.send("No person with key: " + that.key);
        });
    }

    fetchBloodlinks() {
        const query =
            "SELECT " +
                "Bloodlink.senior AS senior, " +
                "Senior.short_title AS senior_short_title, " +
                "Bloodlink.junior AS junior, " +
                "Junior.short_title AS junior_short_title, " +
                "BloodlinkType.in_english AS link_in_english " +
            "FROM Bloodlink " +
            "JOIN Person Senior ON Senior.code = Bloodlink.senior " +
            "JOIN Person Junior ON Junior.code = Bloodlink.junior " +
            "JOIN BloodlinkType ON BloodlinkType.code = Bloodlink.type " +
            "WHERE Bloodlink.senior = ? OR Bloodlink.junior = ? " +
            "ORDER BY " +
                "BloodlinkType.seniority ASC, " +
                "Senior.rank_tier DESC, " +
                "Junior.rank_tier DESC, " +
                "Senior.code, " +
                "Junior.code;";
        let that = this;

        this.db.all(query, [this.key, this.key], function (err, extract) {
            if (err) throw err;
            camelifyList(extract);
            that.data.bloodlinks = extract;
            that.fetchAccolades();
        });
    }

    fetchAccolades() {
        const query =
            "SELECT Accolade.name AS name, Accolade.chivalric AS chivalric " +
            "FROM Holds " +
            "JOIN Accolade ON Accolade.code = Holds.accolade " +
            "JOIN Chivalric ON Chivalric.code = Accolade.chivalric " +
            "WHERE Holds.person = ? " +
            "ORDER BY " +
                "Accolade.tier DESC, " +
                "Accolade.precedence ASC, " +
                "Chivalric.seniority ASC;";
        let that = this;

        this.db.all(query, [this.key], function (err, extract) {
            if (err) throw err;

            camelifyList(extract);
            that.data.accolades = extract;
            that.wrapUp();
        });
    }
}

// Exports.
module.exports = PersonRetriever;
