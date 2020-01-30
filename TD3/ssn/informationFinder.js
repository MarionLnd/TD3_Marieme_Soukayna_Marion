let informationFinder = module.exports;
let infos = new Map();
require("../ssn/pays.json");
const fs= require('fs');
const paysInfo = new Map (Object.entries(JSON.parse(fs.readFileSync('../ssn/pays.json'))));


informationFinder.getInfo = function (ssn) {
        infos.set('0',informationFinder.extractSex(ssn));
        infos.set('1',informationFinder.extractBirthDate(ssn));
        infos.set('2',informationFinder.extractBirthPlace(ssn));
        infos.set('3',informationFinder.extractPosition(ssn));
        console.log(infos);
};
/**
 *
 */
informationFinder.extractSex = function (ssn) {
    let sex = ssn.substr(0, 1);
    return sex === "1" || sex === "3" || sex === "8" ? "Homme" : "Femme";
};
/**
 *
 */
informationFinder.extractBirthDate = function (ssn) {
    // -- Build a date
    let month = +ssn.substr(3, 2);
    // -- special case
    if (month === 62 || month === 63) {
        month = 1;
    }
    return new Date(+ssn.substr(1, 2), month);
};
/**
 *
 */
informationFinder.extractBirthPlace = function (ssn) {
        let dept = +ssn.substr(6, 2);
        // --- Case DOM TOM
        if (dept === 97 || dept === 98) {
                departement = ssn.substr(5, 3),
                commune = ssn.substr(8, 2)
        }
        else if (dept === 99) {
                departement = "Etranger",
                pays = ssn.substr(8, 3)
        }
        else {
                departement= ssn.substr(5, 2),
                commune = ssn.substr(7, 3)
        }

        return departement;
};
/**
 *
 */
informationFinder.extractPosition = function (ssn) {
    return +ssn.substr(10, 3);
};


