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

// Constants.
const router = express.Router();


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

// Exports.
module.exports = router;
