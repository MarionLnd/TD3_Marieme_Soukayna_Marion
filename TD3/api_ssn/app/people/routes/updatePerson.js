let mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    PersonHelper = require(global.config.rootPath+"/people/helpers/retrievePerson");

const Utils = require(global.config.rootPath+"/helpers/appUtils");

module.exports = function(router){
    router.put('/people/:personId',PersonHelper.retrievePerson,(req, res)=> {
        Utils.info("Update person "+req.currentPerson._id);
        req.currentPerson.update(req.body).then(()=>{
            res.status(204).json();
        },(err)=>{
            Utils.error(err);
            res.status(400).json(err);
        })
    });
};