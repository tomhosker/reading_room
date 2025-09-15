/*
This code defines an abstract Object-Relational Model class.
*/

// Local imports.
const {Retriever} = require("../retriever.js");
const {camelifyList} = require("../utils.js");

/****************
 ** MAIN CLASS **
 ***************/

// An abstract class.
class ORM {
    constructor(key, complex = false) {
        this.key = key;
        this.complex = complex;
        this.retriever = this.getRetriever();
        this.data = null;
    }

    getRetriever() {
        const result = new Retriever();

        return result;
    }

    fetch(query, params) {
        const result = this.retriever.fetchAll(query, params);

        camelifyList(result);

        return result;
    }

    fill() {
        this.data = {};

        this.retriever.close();
    }

    getData() {
        this.fill();

        return this.data;
    }
}

// Exports.
module.exports = ORM;