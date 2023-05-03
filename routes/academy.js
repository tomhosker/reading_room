/*
Returns the pages for the various pages relating to the Royal Cyprian Academy.
*/

// Imports.
const express = require("express");

// Local imports.
const AcademyRetriever = require("../lib/retrievers/academy_retriever.js");
const FacultyRetriever = require("../lib/retrievers/faculty_retriever.js");
const DepartmentRetriever =
    require("../lib/retrievers/department_retriever.js");
const {
    HoskersAlmanackRetriever,
    HoskersCatalogueRetriever,
    HoskersAnthemsRetriever,
    HoskersAlbumsRetriever,
    HoskersCinemaRetriever,
    HoskersTelevisionRetriever
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
    const retriever = new AcademyRetriever(req, res);

    retriever.startHere();
});

// Get the page for a given faculty.
router.get("/faculties/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new FacultyRetriever(req, res, key);

    retriever.startHere();
});

// Get the page for a given department.
router.get("/departments/:id", function (req, res, next) {
    const key = req.params.id;
    const retriever = new DepartmentRetriever(req, res, key);

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
