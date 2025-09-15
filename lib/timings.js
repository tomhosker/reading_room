/*
This code defines a class which handles time and date.
*/

// Imports.
const { execSync } = require("child_process");

// Local imports.
const constants = require("./constants");

// Constants.
const GREGORIAN_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const CYPRIAN_MONTHS = [
    "Pri",
    "Sec",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Uno",
    "Duo",
    "Int"
];

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Timings {
    constructor() {
        this.gregDateObj = new Date();
    }

    // Ronseal.
    getNow() {
        return this.gregDateObj.toISOString();
    }

    // Get a (Gregorian) date string, formatted just how I like it.
    getMyGreg() {
        let result, dayString, monthString, yearString;

        dayString = stringifyDayNum(this.gregDateObj.getDate());

        monthString = GREGORIAN_MONTHS[this.gregDateObj.getMonth()];
        yearString = this.gregDateObj.getFullYear().toString();
        result = [dayString, monthString, yearString].join(" ");

        return result;
    }

    // Get a simple object describing a Cyprian date.
    getCyprian() {
        const output = execSync("get-cyprian-date --as-json", { encoding: "utf-8" });
        const parsed = JSON.parse(output);
        const result = parsed.cyprian;

        return result;
    }

    // Get a string giving today's Cyprian date.
    getCyprianString() {
        const cyprian = this.getCyprian();
        const dayString = stringifyDayNum(cyprian.day);
        const monthString = CYPRIAN_MONTHS[cyprian.month];
        const yearString =
            '<span class="frak">' +
            constants.CURRENT_MONARCH_CODE +
            "</span><sub>" +
            cyprian.year +
            "</sub>";
        const result = [dayString, monthString, yearString].join(" ");

        return result;
    }
}

// Convert to a string, and add a leading zero as required.
function stringifyDayNum(dayNum) {
    let result = dayNum.toString();

    if (result.length === 1) result = "0" + result;

    return result;
}

// Exports.
module.exports = { Timings };
