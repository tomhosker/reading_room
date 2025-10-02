/*
Several object-relational models, for the media database.
*/

// Local imports.
const {MediaRetriever} = require("../retriever.js");
const ORM = require("./orm.js");

// Queries.
LIB_SELECT = "SELECT Book.*, Author.full_title AS author_full";
LIB_FROM = "FROM Book LEFT JOIN Author ON Author.code = Book.author";
LIB_ORDER_BY = "ORDER BY author, year_published, title";
LIBRARY_QUERIES = {
    theologyTheology:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'theology' ${LIB_ORDER_BY};`,
    theologyHebrew:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'hebrew' ${LIB_ORDER_BY};`,
    theologyGreek:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'greek' ${LIB_ORDER_BY};`,
    theologyLatin:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'latin' ${LIB_ORDER_BY};`,
    philosophy:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'philosophy' ${LIB_ORDER_BY};`,
    mathematics:
        `${LIB_SELECT} ${LIB_FROM} WHERE genre = 'mathematics' ${LIB_ORDER_BY};`
}

/*************
 ** CLASSES **
 ************/

class MediaORM extends ORM {
    getRetriever() {
        const result = new MediaRetriever();

        return result;
    }
}

class BooksORM extends MediaORM {
    constructor(query, params) {
        super();

        this.query = query;
        this.params = params;
    }

    fill() {
        this.data = this.fetch(this.query, this.params);
    }
}

/***************
 ** FUNCTIONS **
 **************/

function getLibrary(query) {
    const orm = new BooksORM(query, []);
    const result = orm.getData();

    return result;
}

// Exports.
module.exports = {LIBRARY_QUERIES, BooksORM, getLibrary};