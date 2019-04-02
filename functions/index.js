const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");


const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

app.get("/",(req,res) => {
    res.render("main.hbs");
});

exports.app = functions.https.onRequest(app);

const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');

app2.post("/contact",(req,res) => {

});