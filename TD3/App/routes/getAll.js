const  express  = require("express");
const  connectdb  = require("../dbconnexion");
const  persons  = require("./../models/person");

const  router  =  express.Router();

router.route("/").get((req, res, next) =>  {
    res.setHeader("Content-Type", "application/json");
    res.statusCode  =  200;
    connectdb.then(db  =>  {
        persons.find({}).then(person  =>  {
            res.json(person);
        });
    });
});

module.exports  =  router;