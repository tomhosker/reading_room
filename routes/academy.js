/*
Returns the pages for the various pages relating to the Royal Cyprian Academy.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const {
    DepartmentORM,
    FacultyORM,
    AcademyORM
} = require("../lib/orm/academy_orms.js");
const {
    AllBooksORM,
    AlmanackORM,
    CatalogueORM,
    AnthemsORM,
    AlbumsORM,
    CinemaORM,
    TelevisionORM
} = require("../lib/orm/media_orms.js");

// Local constant objects.
const router = express.Router();

// Get the academy's page.
router.get("/", function (req, res, next) {
    const orm = new AcademyORM(null, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "academy", data);
});

// Get the page for a given faculty.
router.get("/faculties/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new FacultyORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    if (!data) res.send(`No faculty with code: ${key}`);
    else finaliser.protoRender(req, res, "faculty", data);
});

// Get the page for a given department.
router.get("/departments/:id", function (req, res, next) {
    const key = req.params.id;
    const orm = new DepartmentORM(key, true);
    const data = orm.getData();
    const finaliser = new Finaliser();

    if (!data) res.send(`No department with code: ${key}`);
    else finaliser.protoRender(req, res, "department", data);
});

// Get the page for the list of all the Academy's books.
router.get("/books", function (req, res, next) {
    const orm = new AllBooksORM();
    const data = orm.getData();
    const finaliser = new Finaliser();

    finaliser.protoRender(req, res, "books", data);
});

// Get the page for a given canon.
router.get("/canons/:id", function (req, res, next) {
    const key = req.params.id;
    const finaliser = new Finaliser();
    let orm;
    let data = null;

    if (key === "almanack") orm = new AlmanackORM();
    else if (key === "catalogue") orm = new CatalogueORM;
    else if (key === "anthems") orm = new AnthemsORM;
    else if (key === "albums") orm = new AlbumsORM;
    else if (key === "cinema") orm = new CinemaORM;
    else if (key === "television") orm = new TelevisionORM;

    if (orm) data = orm.getData();

    if (!data) res.send(`No canon with key: ${key}`);
    else finaliser.protoRender(req, res, "canon", data);
});

// Exports.
module.exports = router;
