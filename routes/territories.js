/*
Returns the pages for the various territories.
*/

// Imports.
const express = require("express");

// Local imports.
const KingdomRetriever = require("../lib/retrievers/kingdom_retriever.js");

const Finaliser = require("../lib/finaliser.js");
const {ManorORM, BaronyORM, CountyORM, DuchyORM} = require("../lib/orm/territorial_orms.js");

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
    const orm = new DuchyORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "duchy", data);
});

// Get a county's page.
router.get("/counties/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new CountyORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "county", data);
});

// Get a barony's page.
router.get("/baronies/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new BaronyORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "barony", data);
});

// Get a manor's page.
router.get("/manors/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new ManorORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "manor", data);
});

// Exports.
module.exports = router;
