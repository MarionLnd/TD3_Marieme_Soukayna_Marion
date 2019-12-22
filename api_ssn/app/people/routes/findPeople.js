let mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    async = require('async');

const Utils = require(global.config.rootPath+"/helpers/appUtils");

module.exports = function(router){
    // -- GET ALL Person
    router.get('/people',(req, res)=> {
        Utils.info('Find people');
        Person.find({}).then((people)=>{

            let arrayPeople = [];

            async.each(people,(person,callback)=>{
                person.toWebFormat().then(personUpdated=>{
                    arrayPeople.push(personUpdated);
                    callback()
                },(err)=>{
                    Utils.error("failed to web format",err);
                    callback()
                })
            },()=>{
                res.status(200).json(arrayPeople);
            })


        },(err)=>{
            Utils.error(err);
            res.status(400).json(err);
        })
    });
};