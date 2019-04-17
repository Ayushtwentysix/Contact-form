var functions = require('firebase-functions');
var express = require('express');
var engines = require('consolidate');
var nodemailer = require('nodemailer');
var handlebars = require("handlebars");
var validator = require('validator');

var app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

app.get("/",(req,res) => {
    res.render("main.hbs");
});

exports.app = functions.https.onRequest(app);

var app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');

app2.post("/contact",(req,res) => {

if(validator.isEmail(req.body.email_sender) && validator.isEmail(req.body.email_receiver)){
     var transporter = nodemailer.createTransport({
 service: 'gmail',
 secure: true,
 auth: {
       user: process.env.EMAIL,
        pass: process.env.PASSWORD 
    }
});
       var mailOptions = {
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
    var err = "Email input is not valid";
    res.render("main.hbs", {err: err});
}
});

exports.app2 = functions.https.onRequest(app2);
