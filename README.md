# Firebase SDK for Cloud Functions - HTTPS function for Email Trigger

This quickstart demonstrates the functioning of **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

## Table of contents
1. [Introduction](#Introduction)
2. [Configuration](#Configuration)
3. [Functions Code](#Functions-Code)
4. [Usage instructions](#Usage-instructions)
     * [Dependencies](#Dependencies)
     * [First Firebase Function](#First-Firebase-Function)
     * [Second Firebase Function](#Second-Firebase-Function)
     * [HTML Contact Form](#HTML-Contact-Form)
     * [Show Error](#Showr-Error)
     * [Rewrites](#Rewrites)
     * [Deploy](#Deploy)
     * [Set Environment Variables](#Set-Environment-Variables)
5. [Report Bugs](#Report-Bugs)

## Introduction 
We'll use the function that send emails using **[Nodemailer](https://www.npmjs.com/package/nodemailer)** dependency (a node based Email client with comprehensive EMail server setup). There are four input boxes:
- Sender email address **(required)**
- Receiver mail address **(required)**
- Subject
- Message

After we click on submit, then both the mail address are validate first. If any one of them is not a valid email address, then an error is generated (shown below in image).

![error](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554367826/error_contact.png)

##  Configuration

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

## Functions Code
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
 
## Writing Dependencies

Add below dependencies in ```functions/index.js``` file. 

```javascript
var functions = require('firebase-functions');
var express = require('express');
var engines = require('consolidate');
var nodemailer = require('nodema iler');
var handlebars = require("handlebars");
var validator = require('validator');
```
## First Firebase Function

1. Create an Express application.
2. Choose engine as hbs.
3. Set ```functions/views``` folder as views.
4. Set hbs as engine.
5. Create a GET method and render ```main.hbs``` file present in ```functions/views``` folder
6. Trigger the function ```app``` with an HTTP request.

```javascript
const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

app.get("/",(req,res) => {   // GET route
    res.render("main.hbs");  // Rendering the file
});

exports.app = functions.https.onRequest(app);
```

## Second Firebase Function

Since this code is bit large, we will break it into chunks.
1. Creates an Express application.
2. Choose engine as hbs.
3. Set ```functions/views``` folder as views.
4. Set hbs as engine.

```javascript
const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');
```
5. Create a POST Method.
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

## HTML Contact Form

The code is in ```main.hbs``` file present in ```functions/views``` folder. 
We used ```POST``` method to send the data to ```/contact``` route. We will send:
  1. Email Address of Sender
  2. Email Address of Receiver
  3. Subject
  4. Message

Then *Submit Button* will submit the data to ```/contact```.

```HTML
<form method="POST" action="/contact">
  <label>Enter your mail ID:</label>
<input type="email" required name="email_sender" />  
  <label>Enter receiver mail ID:</label>
<input type="email" required name="email_receiver" />  
  <label>Subject</label>
<input type="text" required name="subject" />  
  <label>Enter Message:</label>
<input type="text" required name="message" /> 
    <button type="submit">Submit</button>
</form>
```

## Show Error
Error rendering will be done in ```main.hbs``` file present in ```functions/views``` folder. **We will place our code below the HTML form**. The ```err``` will be passed in webpage when we will render ```main.hbs``` in ```index.js``` file. We use **double curly braces** to render ```err``` in webpage **only** under the ```if``` condition.

```handlebars
{{# if err }}
<h3>{{err}}</h3>
{{/if}}
```
#  Rewrites
Here we will connect the firebase functions with GET/POST method by writing app name & source in rewrites object. If app name is not properly connected with source, you will get a ```Page Not Found``` error. **Do not modify JSON objects other than Rewrites**. 
See file ```firebase.json``` for full JSON object.
```javascript
"rewrites": [
      {
        "source": "/",
        "function": "app" 
      },
      {
        "source": "/contact",
        "function": "app2"
      }]
```

# Deploy and Test

Now we will deploy both functions to firebase. Run the command:
```sh
$ firebase deploy
```

This will create two functions which can be seen under Functions section in firebase console. At the end you will get a link of webpage in Linux terminal/ Command Prompt. As this is hosted on firebase, you can also get link by visiting the Hosting section in Firebase Console. Go to next section to set environment variables so as to send mails.

# Set Environment Variables 

Now we will go for Auth object under createTransport in Nodemailer.

```javascript
 var transporter = nodemailer.createTransport({
 service: 'gmail',
 secure: true,
 auth: {
       user: process.env.EMAIL,
        pass: process.env.PASSWORD 
    }
});
```
Here ```process.env.EMAIL``` and ```process.env.PASSWORD``` are variables defined in Google environment.

To be able to send emails with your Gmail account: **first enable access to [Less Secure Apps](https://myaccount.google.com/lesssecureapps)**.
Set the ```EMAIL``` and ```PASSWORD``` Google Cloud environment variables to match the email and password of the Gmail account used to send emails. To set the variables follow these steps:
1. Go to firebase console & select the project where you deployed the code.
2. Then click on functions link present in sidebar.
3. In the dashboard tab, hover on ```app2``` function. On right hand side, click on **three vertical dots** and then on **Detailed usage stats** link. This will open the ```app2``` function in Google Cloud Platform (GCP).
![firebase dashboard](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554479053/dashboard_firebase.png)
4. Click on **edit** in GCP dashboard. *The green tick against the app2 shows that the function is deployed properly*.
 ![GCP dashboard](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554479409/GCP_console.png)
5. Click on **more** option and head over to Environment variables section. Now replace the *values* of **EMAIL** & **PASSWORD** box with the email and password of the Gmail account used to send emails.
![environment variables](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554479959/environment_variables.png) 
Refersh the page and enter the email address of sender, email address of sender, Subject & Message. Then press Submit. 

## Report Bugs
Follow steps mentioned in ```ISSUE_TEMPLATE.md``` to report bugs.




  






 
