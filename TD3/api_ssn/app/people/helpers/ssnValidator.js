let ssnValidator = module.exports;
const async = require('async');
/**
 * RegExp to valid format
 * @param ssn
 * @returns {Promise<unknown>}
 */
ssnValidator.controlSsnValue = function(ssn){
    return new Promise((resolve, reject)=>{
        let regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");

        if(regExpSsn.test(ssn)){
            resolve();
        }else{
            reject()
        }
    })
};
/**
 * Check NIR
 * @param ssn
 * @returns {Promise<unknown>}
 */
ssnValidator.controlSsnKey = function (ssn) {
    return new Promise((resolve, reject)=> {
        // -- Extract classic information
        let myValue = ssn.substr(0, 13);
        let myNir = ssn.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        let myNumber = +myValue;
        if(97 - (myNumber % 97) == +myNir){
            resolve()
        }else{
            reject()
        };
    })
};
/**
 * Method to Valid a SSN
 * @param ssn
 * @returns {Promise<unknown>}
 */
ssnValidator.isValid = function(ssn){
    return new Promise((resolve, reject)=>{
        async.parallel({
            controlSsnValue : (callback)=>{
                ssnValidator.controlSsnValue(ssn).then(()=>{
                    callback(null,true)
                },()=>{
                    callback(true,null)
                })
            },
            controlSsnKey : (callback)=>{
                ssnValidator.controlSsnKey(ssn).then(()=>{
                    callback(null,true)
                },()=>{
                    callback(true,null)
                })
            }
        },(err,result)=>{
            if (!err) {
                resolve()
            } else {
                reject("SSN Invalid : "+JSON.stringify(result));
            }
        })
    })
};