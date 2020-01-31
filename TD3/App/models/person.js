const Schema = mongoose.Schema;

let PersonSchema = new Schema({
    prenom : String,
    nom : { type : String, required : true},
    SSN : { type : String, required : true},
    genre : { type : String, required : true},
    naissance : { type : String, required : true},
    departement : { type : String, required : true},
    pays : { type : String, required : true}
});

mongoose.model('person', PersonSchema);

