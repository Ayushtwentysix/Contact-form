# Firebase SDK for Cloud Functions - HTTPS function with Email Trigger

This quickstart demonstrates using the **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

## Table of contents
1. [Introduction](#Introduction)
2. [Configuration](#Configuration)
3. [Functions Code](#Functions-Code)
4. [Usage instructions](#Usage-instructions)
     * [Dependencies](#Dependencies)
     * [First Firebase Function](#First-Firebase-Function)
     * [Second Firebase Function](#Second-Firebase-Function)
     * [Nodemailer Code](#Nodemailer-Code)
     * [HTML Contact Form](#HTML-Contact-Form)
     * [Show Error](#Show-Error)
     * [Rewrites](#Rewrites)
     * [Deploy](#Deploy)
     * [Set Environment Variables](#Set-Environment-Variables)
5. [Report Bugs](#Report-Bugs)
6. [Contributing](#Contributing)

## Introduction 
We will create two files here - ```index.js``` and ```main.hbs```. The index.js is present in functions directory and it contain server code. The main.hbs is present in views directory which is inside functions directory and it has HTML contact form.

We'll will use **[Nodemailer](https://www.npmjs.com/package/nodemailer)** dependency to send mails. There are four input boxes in HTML form:
- Sender email address **(required)**
- Receiver mail address **(required)**
- Subject
- Message

After we click on submit, both the mail address go through validation process. If any one of them is not a valid email address, then an error is generated.
![error](https://res.cloudinary.com/dzdj5vlz4/image/upload/v1554842230/contact-form.png)

## Configuration

First install [Node.js](https://nodejs.org/en/download/) for your environment. 
**Nodemailer requires Node.js v6.0.0 or newer.**

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
Then delete the ```index.html``` file present in public folder. 
>Pubic folder contains all the static files like HTML files, robots.txt , xml files etc... & functions folder contain all the dynamic content.

**Watch the official video: [Node.js apps on Firebase Hosting Crash Course](https://youtu.be/LOeioOKUKI8)**

## Functions Code
See file ```functions/index.js``` for firebase functions and the email sending code ( under *app2* function).
Sending emails is performed using nodemailer. For simplicity, in this sample we're showing how to send email through SMTP using a Gmail account.

The dependencies are listed in ```functions/package.json```. Please make sure that ```firebase-admin``` dependency and ```firebase-functions``` dependency are present when we deploy the code to firebase. We have already installed the dependencies in [Configuration](#Configuration) section.
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

## Usage instructions
 Follow the instructions to create functions, create HTML contact form and deploy to firebase.
 
## Dependencies
Include below dependencies in ```functions/index.js``` file. 
```javascript
const functions = require('firebase-functions');//https://www.npmjs.com/package/firebase-functions
const express = require('express');  // https://www.npmjs.com/package/express
const engines = require('consolidate'); // https://www.npmjs.com/package/consolidate 
const nodemailer = require('nodemailer'); //https://www.npmjs.com/package/nodemailer
const handlebars = require("handlebars"); //https://www.npmjs.com/package/handlebars
var validator = require('validator'); //https://www.npmjs.com/package/validator
```

## First Firebase Function

1. Create an Express application.
2. Choose engine as hbs.
3. Set ```views``` folder as views.
4. Set hbs as engine.
```javascript
const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');
```
5. Create a GET method and render ```main.hbs``` file present in ```functions/views``` folder

```javascript
app.get("/",(req,res) => {      // GET method
    res.render("main.hbs");    // Rendering the file
});
```
6. Trigger the function ```app``` with an HTTP/HTTPS request.

```javascript
exports.app = functions.https.onRequest(app);
```
7. The full code of ```app``` function.
```javascript
const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine', 'hbs');

app.get("/",(req,res) => {      // GET method
    res.render("main.hbs");    // Rendering the file
});

exports.app = functions.https.onRequest(app);
```

## Second Firebase Function

1. Create an Express application.
2. Choose engine as hbs.
3. Set ```functions/views``` folder as views.
4. Set hbs as engine.

```javascript
const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');
```
5. Create a POST method.
```javascript
app2.post("/contact",(req,res) => {    // POST method
        //We WILL WRITE EMAIL SENDING CODE HERE
});
```
6. Trigger the function ```app2``` with an HTTP request.
```javascript
exports.app2 = functions.https.onRequest(app2);
```


7. Now we will validate both the emails using ```validator``` dependency. If any one of them is not valid, we will generate an error and render it in our webpage. The inputs are ```req.body.email_sender``` & ```req.body.email_receiver```. The ```validator``` validates the email using ```.isEmail```.

```javascript
 if(validator.isEmail(req.body.email_sender) && validator.isEmail(req.body.email_receiver)){
            // NODEMAILER CODE HERE
        }
        else {
            // GENERATE ERROR
}
```
8. We will first code else condition. In the below code, we pass value of ```error``` variable to ```err``` variable. Now ```err``` variable will be passed as a parameter to the ```render```..

```javascript
 const error = "Email input is not valid"; // the error 
    res.render("main.hbs", {err: error});
```

9. The basic code for ```app2``` firebase function looks like this:
```javascript
const app2 = express();
app2.engine('hbs', engines.handlebars);
app2.set('views','./views');
app2.set('view engine', 'hbs');

app2.post("/contact",(req,res) => {
        if(validator.isEmail(req.body.email_sender) && validator.isEmail(req.body.email_receiver)){
            // NODEMAILER CODE HERE
        }
        else {
    const error = "Email input is not valid"; // the error 
    res.render("main.hbs", {err: error});
}
});

exports.app2 = functions.https.onRequest(app2);
```
> It is similar to code written for ```app``` function except that we are using a POST method instead of a GET method.

## Nodemailer Code

Nodemailer is a module for Node.js applications to allow email sending. The code will come inside the ```if condition``` of POST method. Refer to [Nodemailer docs](https://nodemailer.com/about/) for more info.

It has three parts: createTransport, mailOptions & sendMail.

The ```createTransport``` takes a object which has service and auth field.
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

The ```mailOptions``` takes the information of sender and receiver.
```javascript
       var mailOptions = {
  from: req.body.email_sender, // sender address
  to: req.body.email_receiver, // list of receivers
  subject: req.body.subject, // Subject line
html: req.body.message
};
```

```sendMail``` sends the mail by taking mailOptions as input. Either we receive an error or a result. In both case we redirect to ```/``` route.
```javascript
     transporter.sendMail(mailOptions, function (err, info) {
        if(err){
         console.log(err);
         res.redirect('/');
        }
         else
          console.log(info);
          res.redirect('/');
});
```
 To see code, go to ```functions/index.js``` file.

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
Error rendering will be done in ```main.hbs``` file present in ```functions/views``` folder. We will place our code below the HTML form. The ```err``` will be passed in webpage when we will render ```main.hbs``` in ```app2``` firebase function. We use **double curly braces** to show ```err``` in webpage **only** under the ```if  condition```. 
 >If and only if both the email addresses are valid, then code under ```if condition``` will not be displayed.

```handlebars
{{# if err }}
<h3>{{err}}</h3>
{{/if}}
```

##  Rewrites
Here we will connect the firebase functions with GET/POST method by writing function name & source in rewrites object. If function name is not properly connected with source, you will get a ```Page Not Found``` error. 
**Do not modify JSON objects other than Rewrites**. 
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

## Deploy

Now we will deploy both functions to firebase. Run the command:
```sh
$ firebase deploy
```

This will create two functions which can be seen under Functions section in firebase console. At the end, you will get a link of webpage in Linux terminal/ Command Prompt. 
> As our webpage is hosted on firebase, we can also get link by visiting the Hosting section in Firebase Console. 

Now, just one step left before we send mails. Go to [set environment variables](#Set-Environment-Variables) section.

## Set Environment Variables 

Now we will go for **Auth** object under createTransport in Nodemailer.

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
Here ```process.env.EMAIL``` and ```process.env.PASSWORD``` are variables defined in environment.

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
 > If after the refresh, email is not send, deploy the functions again by using the command: ```firebase deploy```.

## Report Bugs
Follow steps mentioned in ```ISSUE_TEMPLATE.md``` to report bugs.

## Contributing
We'd love that you contribute to the project. Before doing so please read our [Contributor guide](https://github.com/firebase/functions-samples/blob/master/CONTRIBUTING.md).







