let mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    PersonHelper = require(global.config.rootPath+"/people/helpers/retrievePerson"),
    Utils = require(global.config.rootPath+"/helpers/appUtils");

module.exports = function(router){
    router.delete('/people/:personId',
        PersonHelper.retrievePerson,
        (req, res)=> {
            Utils.info("Delete person "+req.currentPerson._id);
            req.currentPerson.remove().then(()=>{
                res.status(204).json();
            },(err)=>{
                Utils.error(err);
                res.status(400).json(err);
            })
    });
};