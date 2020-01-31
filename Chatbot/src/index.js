"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var port = 8080; // default port to listen
// Configure Express to use EJS
app.set("vues", path.join(__dirname, "vues"));
app.set("view engine", "ejs");
// define a route handler for the default home page
app.get("/", function (req, res) {
    // render the index template
    res.render("index");
});
// start the express server
app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost:" + port);
});
