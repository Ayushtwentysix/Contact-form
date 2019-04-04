# Firebase SDK for Cloud Functions - HTTPS function for Email Trigger

This quickstart demonstrates the functioning of **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

# Introduction 
We'll use the function that send emails using **[Nodemailer](https://www.npmjs.com/package/nodemailer)** dependency. There are four input boxes:
- Sender email address **(required)**
- Receiver mail address **(required)**
- Subject
- Message

After we click on submit, the both the mail address are validated first. If any one of them is not a valid email address, then an error is generated (shown below in image).

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