/*
Returns the pages for the various territories.
*/

// Imports.
const express = require("express");

// Local imports.
const KingdomRetriever = require("../lib/retrievers/kingdom_retriever.js");
const DuchyRetriever = require("../lib/retrievers/duchy_retriever.js");
const CountyRetriever = require("../lib/retrievers/county_retriever.js");
const BaronyRetriever = require("../lib/retrievers/barony_retriever.js");
const ManorRetriever = require("../lib/retrievers/manor_retriever.js");

// Constants.
const router = express.Router();

// Get the Kingdom's page.
router.get("/kingdom", function (req, res, next) {
    const retriever = new KingdomRetriever(req, res);

    retriever.startHere();
});

// Get a duchy's page.
router.get("/duchies/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new DuchyRetriever(req, res, key);

    retriever.startHere();
});

// Get a county's page.
router.get("/counties/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new CountyRetriever(req, res, key);

    retriever.startHere();
});

// Get a barony's page.
router.get("/baronies/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new BaronyRetriever(req, res, key);

    retriever.startHere();
});

// Get a manor's page.
router.get("/manors/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new ManorRetriever(req, res, key);

    retriever.startHere();
});

// Exports.
module.exports = router;
