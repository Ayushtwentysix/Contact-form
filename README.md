# Firebase SDK for Cloud Functions - HTTPS function with Email Trigger

This quickstart demonstrates using the **Firebase SDK for Cloud Functions** with an HTTPS trigger *for sending the emails*.

# Introduction 
We'll use the function that send emails using **[Nodemailer](https://www.npmjs.com/package/nodemailer)** dependency. There are four input boxes:
- Sender email address **(required)**
- Receiver mail address **(required)**
- Subject
- Message

After we click on submit, the both the mail address are validated first. If any one of them is not a valid email address, then an error is generated.
