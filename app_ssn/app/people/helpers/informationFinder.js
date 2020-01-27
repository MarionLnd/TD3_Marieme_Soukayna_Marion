let informationFinder = module.exports;

const async = require('async');

informationFinder.getInfo = function (ssn) {
    return new Promise((resolve, reject)=>{
        async.parallel({
            sex: (callback) => {
                callback(null, this.extractSex(ssn))
            },
            birthDate: (callback) =>{
                callback(null, this.extractBirthDate(ssn));
                },
            birthPlace: (callback) =>{
                this.extractBirthPlace(ssn).then((result =>{
                    callback(null,result)}
                ),(err)=>{
                    callback(err,null);
                })},
            birthPosition: (callback) =>{
                callback(null, this.extractPosition(ssn))}
        },(err,result)=>{
            console.log(err,result);
            if(!err){
                resolve(result)
            }else{
                reject(err);
            }
        })
    })
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
    if (month == 62 || month == 63) {
        month = 1;
    }
    let birth = new Date(+ssn.substr(1, 2), month);
    return birth;
};
/**
 *
 */
informationFinder.extractBirthPlace = function (ssn) {
    return new Promise((resolve, reject)=>{
        let dept = +ssn.substr(5, 2);
        // --- Case DOM TOM
        if (dept === 97 || dept === 98) {
            resolve( {
                dept: ssn.substr(5, 3),
                commune: ssn.substr(8, 2)
            });
        }
        else if (dept == 99) {
            resolve( {
                dept: "Etranger",
                pays: ssn.substr(7, 3)
            });
        }
        else {
            resolve( {
                dept: ssn.substr(5, 2),
                commune: ssn.substr(7, 3)
            });
        }
    })
};
/**
 *
 */
informationFinder.extractPosition = function (ssn) {
    return +ssn.substr(10, 3);
};


