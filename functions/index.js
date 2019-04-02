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