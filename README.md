# Firebase SDK for Cloud Functions - HTTPS function for Email Trigger

This quickstart demonstrates the functioning of **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

# Table of contents
1. [Introduction](#Introduction)
2. [Configuration](#Configuration)
3. [Functions Code](#Functions-Code)
4. [Usage instructions](#Usage-instructions)
     * [Writing Dependencies](#Writing-Dependencies)
     * [First Firebase Function](#First-Firebase-Function)
     * [Second Firebase Function](#Second-Firebase-Function)

# Introduction 
We'll use the function that send emails using **[Nodemailer](https://www.npmjs.com/package/nodemailer)** dependency (a node based Email client with comprehensive EMail server setup). There are four input boxes:
- Sender email address **(required)**
- Receiver mail address **(required)**
- Subject
- Message

After we click on submit, then both the mail address are validate first. If any one of them is not a valid email address, then an error is generated (shown below in image).

![error](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554367826/error_contact.png)

#  Configuration

First install [Node.js](https://nodejs.org/en/download/) for your environment.
Then run the following commands to make directory & initialize package.json .
```sh
$ mkdir contact_form
$ cd contact_form
$ npm init -y
```

Now we will initialize [firebase](https://firebase.google.com/):- *hosting* & *function*.
```sh
$ npm i -g firebase-tools
$ firebase init hosting
```
 Select your firebase project which you created in [firebase console](https://firebase.google.com/). Then initialize functions & install required dependencies .
```sh
$ firebase init functions
$ cd functions
$ npm i --save express consolidate handlebars nodemailer validator
```

**Watch the official video: [Node.js apps on Firebase Hosting Crash Course](https://youtu.be/LOeioOKUKI8)**

# Functions Code
See file ```functions/index.js``` for the Functions trigger and the email sending code.
Sending emails is performed using nodemailer. For simplicity, in this sample we're showing how to send email through SMTP using a Gmail account.

The dependencies are listed in ```functions/package.json```. Please make sure that ```firebase-admin``` dependency and ```firebase-functions``` dependency are present when deploying the code to firebase.
```javascript
"dependencies": {
    "consolidate": "^0.15.1",
    "express": "^4.16.4",
    "firebase-admin": "~7.0.0",
    "firebase-functions": "^2.2.0",
    "handlebars": "^4.1.1",
    "nodemailer": "^6.0.0",
    "validator": "^10.11.0"
  }
```
**Go for the latest version of dependencies !**

# Usage instructions
 Follow the below written instructions.
 
# Writing Dependencies

```javascript
const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const nodemailer = require('nodemailer');
const handlebars = require("handlebars");
var validator = require('validator');
```
# First Firebase Function

1. Create an Express application.
2. Choose engine as hbs.
3. Set ```functions/views``` folder as views.
4. Set hbs as engine.
5. Create a GET route and render ```main.hbs``` file present in ```functions/views``` folder
6. Trigger the function ```app``` with an HTTP request.

```javascript
const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

app.get("/",(req,res) => {
    res.render("main.hbs");
});

exports.app = functions.https.onRequest(app);
```

# Second Firebase Function

Since this code is bit large, we will break it into chunks.
1. Creates an Express application.
2. Choose engine as hbs.
3. Set ```functions/views``` folder as views.
4. Set hbs as engine.

*see the below code.*
```javascript
const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');
```
5. Create a POST route.
```javascript
app2.post("/contact",(req,res) => {
        //We WILL WRITE CODE HERE
});
```
6. Trigger the function ```app2``` with an HTTP request.
```javascript
exports.app2 = functions.https.onRequest(app2);
```

Now the basic code for ```app2``` firebase function looks like this:
```javascript
const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');

app2.post("/contact",(req,res) => {
        //We WILL WRITE EMAIL SENDING CODE HERE
});

exports.app2 = functions.https.onRequest(app2);
```
7. Now we will validate both the emails. If they are not valid, we will generate an error and render it in our webpage. The inputs are ```req.body.email_sender``` & ```req.body.email_receiver```. The ```validator``` validates the email using ```.isEmail```.

```javascript
app2.post("/contact",(req,res) => {
        if(validator.isEmail(req.body.email_sender) && validator.isEmail(req.body.email_receiver)){
            // NODEMAILER CODE HERE
        }
        else {
    const err = "Email input is not valid"; // the error
    res.render("main.hbs", {err: err});
}
});
```

In the below code, we pass value of ```error``` variable to ```err``` variable. Now ```err``` variable will be passed as a parameter to the ```render```.

```javascript
 const error = "Email input is not valid"; // the error 
    res.render("main.hbs", {err: error});
```

