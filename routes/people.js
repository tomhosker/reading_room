/*
Returns the pages for the various territories.
*/

// Imports.
const express = require("express");

// Local imports.
const PersonRetriever = require("../lib/retrievers/person_retriever.js");

// Constants.
const router = express.Router();


// Get a person's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new PersonRetriever(req, res, key);

    retriever.startHere();
});

// Exports.
module.exports = router;
