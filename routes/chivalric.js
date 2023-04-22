/*
Returns the pages for the various chivalric orders.
*/

// Imports.
const express = require("express");

// Local imports.
const ChivalricRetriever = require("../lib/retrievers/chivalric_retriever.js");

// Constants.
const router = express.Router();


// Get a chivalric order's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new ChivalricRetriever(req, res, key);

    retriever.startHere();
});

// Exports.
module.exports = router;
