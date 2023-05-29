/*
Test the Timings class.
*/

// Standard imports.
const expect = require("expect");

// Local imports.
const { CyprianDate, Timings } = require("../lib/timings.js");

/*************
 ** TESTING **
 ************/

describe("Test CyprianDate", function () {
    it("Test 01 Pri T1", function () {
        const actual = new CyprianDate(new Date(2014, 3, 1)).toString();
        const expected = '01 Pri <span class="frak">T</span><sub>1</sub>';

        expect(actual).toEqual(expected);
    });
    it("Test 30 Pri T1", function () {
        const actual = new CyprianDate(new Date(2014, 3, 30)).toString();
        const expected = '30 Pri <span class="frak">T</span><sub>1</sub>';

        expect(actual).toEqual(expected);
    });
    it("Test 01 Sec T1", function () {
        const actual = new CyprianDate(new Date(2014, 4, 1)).toString();
        const expected = '01 Sec <span class="frak">T</span><sub>1</sub>';

        expect(actual).toEqual(expected);
    });
    it("Test 29 Duo T1", function () {
        const actual = new CyprianDate(new Date(2015, 2, 20)).toString();
        const expected = '29 Duo <span class="frak">T</span><sub>1</sub>';

        expect(actual).toEqual(expected);
    });
    it("Test 01 Pri T2", function () {
        const actual = new CyprianDate(new Date(2015, 2, 21)).toString();
        const expected = '01 Pri <span class="frak">T</span><sub>2</sub>';

        expect(actual).toEqual(expected);
    });
    it("Test 01 Int T2", function () {
        const actual = new CyprianDate(new Date(2016, 2, 11)).toString();
        const expected = '01 Int <span class="frak">T</span><sub>2</sub>';

        expect(actual).toEqual(expected);
    });
});

describe("Test Timings", function () {
    it("Test getNow", function () {
        const expected = (new Date()).toISOString();
        let timings = new Timings();

        expect(timings.getNow()).toEqual(expected);
    });
});
