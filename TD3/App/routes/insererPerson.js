let mongoose = require('mongoose'),
    Person = mongoose.model('person');

module.exports = function(router){
    // -- GET ALL Person
    router.post('/people',(req, res)=> {
        Person.create(req.body).then((myPerson)=>{
            res.status(200).json(myPerson);
        },(err)=>{
            Utils.error(err);
            res.status(400).json({error : err});
        });
    });
};