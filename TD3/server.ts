import * as express from "express";
import config = require('./config/express');

//EXPRESS : Framework JS qui reunit plein de fonctions
const app: express.Application = express();

config.applyConfig(app);

app.get('/', function (req, res) {
    res.send('Hello World Evry! ');
});

app.listen(3030, function () {
    console.log('Example app listening on port 3030!');
});