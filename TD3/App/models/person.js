const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
let person = new Schema({
    sauvegarde : String,
    firstname : String,
    lastname : String,
    ssn : String,
    Genre : String,
    Naissance : String,
    Departement : String,
    Pays : String,
});
let  newPerson  =  mongoose.model("Person", person);
module.exports  =  newPerson;

