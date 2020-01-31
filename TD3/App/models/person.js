const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PersonSchema = new Schema({
    sauvegarde : String,
    firstname : String,
    lastname : { type : String, required : true},
    ssn : { type : String, required : true},
    Genre : { type : String, required : true},
    Naissance : { type : String, required : true},
    Departement : { type : String, required : true},
    Pays : { type : String, required : true}
});

mongoose.model('person', PersonSchema);

