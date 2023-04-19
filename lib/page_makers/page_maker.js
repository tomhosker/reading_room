/*
This code defines a PARENT class for the various PAGE MAKER child classes.
*/

// Local imports.
const Finaliser = require("../finaliser.js");

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class PageMaker {
    constructor(req, res, data) {
        this.req = req;
        this.res = res;
        this.data = data;
        this.pageProperties = { title: this.getTitle() };
    }

    getTitle() {
        return null;
    }

    getView() {
        return null;
    }

    deliver() {
        this.makePageProperties();
    }

    makePageProperties() {
        this.wrapUp();
    }

    wrapUp() {
        const finaliser = new Finaliser();

        finaliser.protoRender(
            this.req, this.res, this.getView(), this.pageProperties
        );
    }
}

// Exports.
module.exports = PageMaker;
