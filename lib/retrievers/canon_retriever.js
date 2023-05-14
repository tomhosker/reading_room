/*
This code defines an abstract parent class for retrieving a given CANON from the
media database, and also its various implementations.
*/

// Local imports.
const constants = require("../constants.js");
const Retriever = require("./retriever.js");
const { camelify, camelifyList } = require("../utils.js");
const {
    HoskersAlmanackPageMaker,
    HoskersCataloguePageMaker,
    HoskersAnthemsPageMaker,
    HoskersAlbumsPageMaker,
    HoskersCinemaPageMaker,
    HoskersTelevisionPageMaker
} = require("../page_makers/canon_page_maker.js");

/******************
 ** PARENT CLASS **
 *****************/

// The class in question.
class CanonRetriever extends Retriever {
    getPageMakerClass() {
        return null;
    }

    getMediaQuery() {
        return null;
    }

    startHere() {
        this.fetchCanon();
    }

    fetchCanon() {
        const query = this.getMediaQuery();
        let that = this;

        if (query) {
            this.media.all(query, function (err, extract) {
                if (err) throw err;

                camelifyList(extract);

                if (extract.length === 0) extract = null;

                that.data.canon = extract;

                that.wrapUp();
            });
        } else {
            this.data.canon = null;
            this.wrapUp();
        }
    }
}

/*******************
 ** CHILD CLASSES **
 ******************/

class HoskersAlmanackRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersAlmanackPageMaker;
    }
}

class HoskersCatalogueRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersCataloguePageMaker;
    }

    getMediaQuery() {
        const result =
            "SELECT PaperBook.id, PaperBook.title, PaperBook.year_published, " +
                "PaperBook.in_library, PaperBook.genre, PaperBook.notes, " +
                "Author.full_title " +
            "FROM PaperBook " +
            "JOIN BookGenre ON BookGenre.code = PaperBook.genre " +
            "LEFT JOIN Author ON Author.code = PaperBook.author " +
            "ORDER BY BookGenre.seniority, Author.surname, " +
                "Author.full_title, PaperBook.year_published, " +
                "PaperBook.title;";
        return result;
    }
}

class HoskersAnthemsRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersAnthemsPageMaker;
    }

    getMediaQuery() {
        const result =
            "SELECT * " +
            "FROM Song " +
            "WHERE rank BETWEEN 1 AND " +
            constants.LONG_CANON_LENGTH +
            " " +
            "ORDER BY rank ASC;";
        return result;
    }
}

class HoskersAlbumsRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersAlbumsPageMaker;
    }

    getMediaQuery() {
        const result =
            "SELECT * " +
            "FROM Album " +
            "WHERE rank BETWEEN 1 AND " +
            constants.SHORT_CANON_LENGTH +
            " " +
            "ORDER BY rank ASC;";
        return result;
    }
}

class HoskersCinemaRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersCinemaPageMaker;
    }

    getMediaQuery() {
        const result =
            "SELECT * " +
            "FROM Film " +
            "WHERE rank BETWEEN 1 AND " +
            constants.LONG_CANON_LENGTH +
            " " +
            "ORDER BY rank ASC;";
        return result;
    }
}

class HoskersTelevisionRetriever extends CanonRetriever {
    getPageMakerClass() {
        return HoskersTelevisionPageMaker;
    }

    getMediaQuery() {
        const result =
            "SELECT * " +
            "FROM TVSeries " +
            "WHERE rank BETWEEN 1 AND " +
            constants.SHORT_CANON_LENGTH +
            " " +
            "ORDER BY rank ASC;";
        return result;
    }
}

// Exports.
module.exports = {
    HoskersAlmanackRetriever,
    HoskersCatalogueRetriever,
    HoskersAnthemsRetriever,
    HoskersAlbumsRetriever,
    HoskersCinemaRetriever,
    HoskersTelevisionRetriever
};
