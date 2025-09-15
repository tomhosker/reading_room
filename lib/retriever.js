/*
This code defines a class which retrieves data from the database.
*/

// Imports.
const Database = require("better-sqlite3");

// Local imports.
const constants = require("./constants.js");

/****************
 ** MAIN CLASS **
 ***************/

// A non-abstract class, for the main database.
class Retriever {
    constructor() {
        this.db = new Database(constants.PATH_TO_DB_CYPRUS);

        this.postInit();
    }

    postInit() {
        this.db.pragma("journal_mode = WAL");
    }

    // Run a db.all() call asynchronously.
    fetchAll(query, params) {
        const statement = this.db.prepare(query);
        let result;

        try {
            result = statement.all(...params);
        } catch (error) {
            console.log(error);

            return false;
        }

        return result;
    }

    // Shut down the connection.
    close() {
        this.db.close();
    }
}

// A non-abstract class, for the media database.
class RetrieverMedia extends Retriever {
    constructor() {
        this.db = new Database(constants.PATH_TO_DB_MEDIA);

        this.postInit();
    }
}

// Exports.
module.exports = {Retriever, RetrieverMedia};