/*
Returns the pages giving a table from the database "as is".
*/

// Imports.
const express = require("express");

// Local imports.
const AsIsRetriever = require("../lib/retrievers/asis_retriever.js");

// Constants.
const router = express.Router();

// Get a table's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new AsIsRetriever(req, res, key);

    retriever.startHere();
});

// Exports.
module.exports = router;
