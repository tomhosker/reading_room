/*
This code defines a class which handles time and date.
*/

// Imports.
const { HDate } = require("@hebcal/core");

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
        this.cyprianDateObj = new CyprianDate(this.gregDateObj);
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

    // Get a date string giving today's Cyprian date.
    getCyprianDateString() {
        return this.cyprianDateObj.toString();
    }
}

/**********************************
 ** HELPER CLASSES AND FUNCTIONS **
 *********************************/

// A class to yield the properties of a Cyprian date, given a Gregorian date.
class CyprianDate {
    constructor(gregDateObj) {
        this.hebDateObj = new HDate(gregDateObj);
        this.day = this.hebDateObj.getDate();
        this.month = this.hebDateObj.getMonth() - 1;
        this.year = this.calculateCyprianYear();
    }

    calculateCyprianYear() {
        let result =
            this.hebDateObj.getFullYear() -
            constants.CURRENT_MONARCH_HEBREW_YEAR_DIFF;

        if (this.hebDateObj.getMonth() > this.hebDateObj.getTishreiMonth()) {
            result--;
        }

        return result;
    }

    toString() {
        const dayString = stringifyDayNum(this.day);
        const monthString = CYPRIAN_MONTHS[this.month];
        const yearString =
            '<span class="frak">' +
            constants.CURRENT_MONARCH_CODE +
            "</span><sub>" +
            this.year +
            "</sub>";
        const result = [dayString, monthString, yearString].join(" ");

        return result;
    }

    getDate() {
        return this.day;
    }

    getMonth() {
        return this.month;
    }

    getFullYear() {
        return this.year;
    }
}

// Convert to a string, and add a leading zero as required.
function stringifyDayNum(dayNum) {
    let result = dayNum.toString();

    if (result.length === 1) result = "0" + result;

    return result;
}

// Exports.
module.exports = { Timings, CyprianDate };
