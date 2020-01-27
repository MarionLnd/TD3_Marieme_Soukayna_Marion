let mongoose = require('mongoose'),
    Schema	 	= mongoose.Schema;

const SSNValidator = require(global.config.rootPath+"/people/helpers/ssnValidator"),
    informationFinder = require(global.config.rootPath+"/people/helpers/informationFinder");

//------------------------------------------- Resources Schema
let PersonSchema = new Schema({
    id : String,
    lastName : { type : String, required : true},
    firstName : String,
    SSN : { type : String, required : true}
});

PersonSchema.statics.create = function(params){
    return new Promise((resolve,reject)=>{

        // -- Create instance
        let Person = mongoose.model('Person');
        let myPerson = new Person(params);
        myPerson.id = myPerson._id;

        // --- Check SSN
        SSNValidator.isValid(myPerson.SSN).then(()=>{
            // -- Saved
            myPerson.save().then(()=>{
                resolve(myPerson)
            },(err)=>{
                reject(err);
            });
        },()=>{
            reject("Not Valid SSN");
        })
    })
};

PersonSchema.methods.toWebFormat = function(){
    return new Promise((resolve,reject)=>{
        informationFinder.getInfo(this.SSN).then((extraInfo)=>{
            resolve({
                lastName : this.lastName,
                firstName : this.firstName,
                SSN : this.SSN,
                extraInfo : extraInfo
            })
        },(err)=>{
            reject(err)
        })
    })
};


mongoose.model('Person', PersonSchema);