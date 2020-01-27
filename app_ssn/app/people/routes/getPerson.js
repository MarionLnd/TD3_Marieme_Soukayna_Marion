let mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    PersonHelper = require(global.config.rootPath+"/people/helpers/retrievePerson");

module.exports = function(router){
    // -- GET ALL Person
    router.get('/people/:personId',PersonHelper.retrievePerson,(req, res)=> {
        res.status(200).json(req.currentPerson);
    });
};