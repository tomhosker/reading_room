/*
Several object-relational models, for the media database.
*/

// Local imports.
const {MediaRetriever} = require("../retriever.js");
const ORM = require("./orm.js");
const constants = require("../constants.js");

// Queries.
const BK_SELECT = "SELECT Book.*, Author.full_title AS author_full";
const BK_FROM = "FROM Book LEFT JOIN Author ON Author.code = Book.author";
const SELECT_ALL_BOOKS = `${BK_SELECT} ${BK_FROM} ORDER BY id;`;
const SELECT_CATALOGUE = (
    "SELECT PaperBook.id, PaperBook.title, PaperBook.year_published, " +
        "PaperBook.in_library, PaperBook.genre, PaperBook.notes, " +
        "Author.full_title AS author_full " +
    "FROM PaperBook " +
    "JOIN BookGenre ON BookGenre.code = PaperBook.genre " +
    "LEFT JOIN Author ON Author.code = PaperBook.author " +
    "ORDER BY BookGenre.seniority, Author.surname, Author.full_title, "+
        "PaperBook.year_published, PaperBook.title;"
);
const SELECT_ANTHEMS = (
    "SELECT * " +
    "FROM Song " +
    `WHERE rank BETWEEN 1 AND ${constants.LONG_CANON_LENGTH} ` +
    "ORDER BY rank ASC;"
);
const SELECT_ALBUMS = (
    "SELECT * " +
    "FROM Album " +
    `WHERE rank BETWEEN 1 AND ${constants.SHORT_CANON_LENGTH} ` +
    "ORDER BY rank ASC;"
);
const SELECT_CINEMA = (
    "SELECT * " +
    "FROM Film " +
    `WHERE rank BETWEEN 1 AND ${constants.LONG_CANON_LENGTH} ` +
    "ORDER BY rank ASC;"
);
const SELECT_TELEVISION = (
    "SELECT * " +
    "FROM TVSeries " +
    `WHERE rank BETWEEN 1 AND ${constants.SHORT_CANON_LENGTH} ` +
    "ORDER BY rank ASC;"
);
// Library queries.
const LIB_ORDER_BY = "ORDER BY author, year_published, title";
const LIBRARY_QUERIES = {
    theology: `${BK_SELECT} ${BK_FROM} WHERE genre = 'theology' ${LIB_ORDER_BY};`,
    hebrew: `${BK_SELECT} ${BK_FROM} WHERE genre = 'hebrew' ${LIB_ORDER_BY};`,
    greek: `${BK_SELECT} ${BK_FROM} WHERE genre = 'greek' ${LIB_ORDER_BY};`,
    latin: `${BK_SELECT} ${BK_FROM} WHERE genre = 'latin' ${LIB_ORDER_BY};`,
    philosophy: `${BK_SELECT} ${BK_FROM} WHERE genre = 'philosophy' ${LIB_ORDER_BY};`,
    mathematics: `${BK_SELECT} ${BK_FROM} WHERE genre = 'mathematics' ${LIB_ORDER_BY};`
};

/*************
 ** CLASSES **
 ************/

class MediaORM extends ORM {
    getRetriever() {
        const result = new MediaRetriever();

        return result;
    }
}

class LibraryORM extends MediaORM {
    constructor(key) {
        super();

        this.key = key;
        this.query = LIBRARY_QUERIES[key];
    }

    fill() {
        this.data = this.fetch(this.query, []);
    }
}

class AllBooksORM extends LibraryORM {
    constructor() {
        super();

        this.query = SELECT_ALL_BOOKS;
    }

    fill() {
        this.data = {
            title: "All Books",
            books: this.fetch(this.query, [])
        };
    }
}

class AlmanackORM extends MediaORM {
    fill() {
        this.data = {
            key: "almanack",
            title: "Hosker's Almanack"
        };
    }
}

class CatalogueORM extends MediaORM {
    fill() {
        this.data = {
            key: "catalogue",
            title: "Hosker's Catalogue",
            catalogue: this.fetch(SELECT_CATALOGUE, [])
        };
    }
}

class AnthemsORM extends MediaORM {
    fill() {
        this.data = {
            key: "anthems",
            title: "Hosker's Anthems",
            anthems: this.fetch(SELECT_ANTHEMS, [])
        };
    }
}

class AlbumsORM extends MediaORM {
    fill() {
        this.data = {
            key: "albums",
            title: "Hosker's Albums",
            albums: this.fetch(SELECT_ALBUMS, [])
        };
    }
}

class CinemaORM extends MediaORM {
    fill() {
        this.data = {
            key: "cinema",
            title: "Hosker's Cinema",
            films: this.fetch(SELECT_CINEMA, [])
        };
    }
}

class TelevisionORM extends MediaORM {
    fill() {
        this.data = {
            key: "television",
            title: "Hosker's Television",
            series: this.fetch(SELECT_TELEVISION, [])
        };
    }
}

/***************
 ** FUNCTIONS **
 **************/

function getLibrary(key) {
    const orm = new LibraryORM(key);
    const result = orm.getData();

    return result;
}

// Exports.
module.exports = {
    AllBooksORM,
    AlmanackORM,
    CatalogueORM,
    AnthemsORM,
    AlbumsORM,
    CinemaORM,
    TelevisionORM,
    getLibrary
};