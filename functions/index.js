const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
var validator = require('validator');

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

if(validator.isEmail(req.body.email_sender) && validator.isEmail(req.body.email_receiver)){
     const transporter = nodemailer.createTransport({
 service: 'gmail',
 secure: true,
 auth: {
       user: process.env.EMAIL,
        pass: process.env.PASSWORD 
    }
});
     const mailOptions = {
  from: req.body.email_sender, // sender address
  to: req.body.email_receiver, // list of receivers
  subject: req.body.subject, // Subject line
html: req.body.message
};

     transporter.sendMail(mailOptions, function (err, info) {
        if(err){
         console.log(err);
         res.redirect('/');
        }
         else
          console.log(info);
          res.redirect('/');
});   
}
else {
    const err = "Email input is not valid";
    res.render("main.hbs", {err: err});
}


});

exports.app2 = functions.https.onRequest(app2);