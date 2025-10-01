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
    HoskersAlmanackRetriever,
    HoskersCatalogueRetriever,
    HoskersAnthemsRetriever,
    HoskersAlbumsRetriever,
    HoskersCinemaRetriever,
    HoskersTelevisionRetriever,
    BooksRetriever
} = require("../lib/retrievers/canon_retriever.js");

// Local constant objects.
const router = express.Router();

// Local constants.
const KEY_TO_RETRIEVER_CLASS = {
    almanack: HoskersAlmanackRetriever,
    catalogue: HoskersCatalogueRetriever,
    anthems: HoskersAnthemsRetriever,
    albums: HoskersAlbumsRetriever,
    cinema: HoskersCinemaRetriever,
    television: HoskersTelevisionRetriever
};

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
    const retriever = new BooksRetriever(req, res);

    retriever.startHere();
});

// Get the page for a given canon.
router.get("/canons/:id", function (req, res, next) {
    const key = req.params.id;
    const RetrieverClass = KEY_TO_RETRIEVER_CLASS[key];
    const retriever = new RetrieverClass(req, res, key);

    retriever.startHere();
});

// Exports.
module.exports = router;
