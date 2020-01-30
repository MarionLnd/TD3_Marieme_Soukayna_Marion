let ssnValidator = module.exports;

ssnValidator.controlSsnValue = function(ssn){
        let regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");

        return regExpSsn.test(ssn);
};

ssnValidator.controlSsnKey = function (ssn) {
        // -- Extract classic information
        let myValue = ssn.substr(0, 13);
        let myNir = ssn.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        let myNumber = +myValue;
        return (97 - (myNumber % 97) === +myNir);

};

ssnValidator.isValid = function(ssn){
    if (ssnValidator.controlSsnKey(ssn) && ssnValidator.controlSsnValue(ssn))
    {
        let result = "OK";
        console.log(result);
    }
    else
    {
        let result = "KO";
        console.log(result);
    }
};

