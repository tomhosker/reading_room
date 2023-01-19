/*
This code defines a class which handles time and date.
*/

// Imports.
const { HDate } = require("@hebcal/core");

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
const CURRENT_MONARCH_CODE = "T";
const CURRENT_MONARCH_HEBREW_YEAR_DIFF = 5774;
const ROSH_HOSHANAH_MONTH_NUM = 7;

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Timings {
    constructor() {
        this.greg = new Date();
        this.gregDay = this.greg.getDate();
        this.gregMonth = this.greg.getMonth();
        this.gregYear = this.greg.getFullYear();
        this.hebrewDate = new HDate();
    }

    // Ronseal.
    getNow() {
        return this.greg.toISOString();
    }

    // Get a (Gregorian) date string, formatted just how I like it.
    getMyGreg() {
        let result, dayString, monthString, yearString;

        dayString = this.gregDay.toString();

        if (dayString.length === 1) dayString = "0" + dayString;

        monthString = GREGORIAN_MONTHS[this.gregMonth];
        yearString = this.gregYear.toString();
        result = [dayString, monthString, yearString].join(" ");

        return result;
    }

    // Convert the current Hebrew year to the Cyprian year number.
    getCyprianYearNum() {
        let result =
            this.hebrewDate.getFullYear() - CURRENT_MONARCH_HEBREW_YEAR_DIFF;

        if (this.hebrewDate.getMonth() >= ROSH_HOSHANAH_MONTH_NUM) {
            result--;
        }

        return result;
    }

    // Get a date string giving today's Cyprian date.
    getCyprianDateString() {
        const dayString = this.hebrewDate.getDate();
        const monthString = CYPRIAN_MONTHS[this.hebrewDate.getMonth()-1];
        const yearString =
            '<span class="frak">' +
            CURRENT_MONARCH_CODE +
            "</span><sub>" +
            this.getCyprianYearNum() +
            "</sub>";
        const result = [dayString, monthString, yearString].join(" ");

        return result;
    }
}

// Exports.
module.exports = Timings;
