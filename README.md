# Firebase SDK for Cloud Functions - HTTPS function for Email Trigger

This quickstart demonstrates the functioning of **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

# Table of contents
1. [Introduction](#Introduction)
2. [Configuration](#Configuration)
3. [Functions Code](#Functions-Code)
4. [Usage instructions](#Usage-instructions)

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
