let informationFinder = module.exports;

informationFinder.getInfo = function (ssn) {
        let sexe = informationFinder.extractSex();
        let birth = informationFinder.extractBirthDate();
        let birthplace = informationFinder.extractBirthPlace();

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
        let dept = +ssn.substr(5, 2);
        // --- Case DOM TOM
        if (dept === 97 || dept === 98) {
                departement = ssn.substr(5, 3),
                commune = ssn.substr(8, 2)
        }
        else if (dept === 99) {
                departement = "Etranger",
                pays = ssn.substr(7, 3)
        }
        else {
                departement= ssn.substr(5, 2),
                commune = ssn.substr(7, 3)
        }
};
/**
 *
 */
informationFinder.extractPosition = function (ssn) {
    return +ssn.substr(10, 3);
};


