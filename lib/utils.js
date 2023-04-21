/*
This code defines some UTILITY FUNCTIONS used across the codebase.
*/

/***************
 ** UTILITIES **
 **************/

function camelifyString(str) {
    const result =
        str.toLowerCase().replace(/([-_][a-z])/g, group =>
            group
                .toUpperCase()
                .replace("-", "")
                .replace("_", "")
        );

    return result;
}

function camelify(obj) {
    let newProperty;

    for (let property in obj) {
        if (!obj.hasOwnProperty(property)) continue;

        newProperty = camelifyString(property);
        obj[newProperty] = obj[property];

        if (newProperty !== property) delete obj[property];

    }
}

function camelifyList(listOfObjects) {
    for (let obj of listOfObjects) {
        camelify(obj);
    }
}

function appendKVPairsToObject(kvPairs, obj) {
    for (let pair of kvPairs) {
        obj[pair.key] = pair.val;
    }
}

function copyPropertiesOfLeftToRight(left, right) {
    for (let property in left) {
        if (!left.hasOwnProperty(property)) continue;

        right[property] = left[property];
    }
}

function makeLink(route, key, text) {
    const href = route + key
    const result = '<a href="' + href + '">' + text + "</a>";

    return result;
}

// Exports.
module.exports = {
    appendKVPairsToObject,
    camelify,
    camelifyList,
    copyPropertiesOfLeftToRight,
    makeLink
};
