/*
Returns the pages giving a table from the database "as is".
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const {AsIsORM} = require("../lib/orm/asis_orm.js");

// Constants.
const router = express.Router();

// Get a table's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new AsIsORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    if (!data) res.send(`Bad table name: ${key}`);
    else finaliser.protoRender(req, res, "asis", data);
});

// Exports.
module.exports = router;
