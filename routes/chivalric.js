/*
Returns the pages for the various chivalric orders.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const ChivalricORM = require("../lib/orm/chivalric_orm.js");

// Constants.
const router = express.Router();

// Get a chivalric order's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new ChivalricORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    if (!data) res.send(`No chivalric order with code: ${key}`);
    else finaliser.protoRender(req, res, "chivalric", data);
});

// Exports.
module.exports = router;
