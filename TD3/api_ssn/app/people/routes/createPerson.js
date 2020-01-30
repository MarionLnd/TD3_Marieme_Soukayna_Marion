let mongoose = require('mongoose'),
    Person = mongoose.model('Person');

const Utils = require(global.config.rootPath+"/helpers/appUtils");

module.exports = function(router){
    // -- GET ALL Person
    router.post('/people',(req, res)=> {
        Utils.info("Create Person");

        Person.create(req.body).then((myPerson)=>{
            res.status(200).json(myPerson);
        },(err)=>{
            Utils.error(err);
            res.status(400).json({error : err});
        });
    });
};