/*
Returns the pages for the various people.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const PersonORM = require("../lib/orm/person_orm.js");

// Constants.
const router = express.Router();


// Get a person's page.
router.get("/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new PersonORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

console.log(data);

    finaliser.protoRender(req, res, "person", data);
});

// Exports.
module.exports = router;
