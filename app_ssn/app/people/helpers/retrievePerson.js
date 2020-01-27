const mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    Utils = require(global.config.rootPath+"/helpers/appUtils");

const PersonUtil = module.exports;

PersonUtil.retrievePerson = function(req,res,next){

    Utils.info("Load a person");

    Person.findOne({_id : req.params.personId}).then((person)=>{
        if(person){
            req.currentPerson = person;
            next()
        }else{
            Utils.error("Person not found");
            res.status(404).json();
        }
    },(err)=>{
        Utils.error(err);
        res.status(400).json(err);
    })
}