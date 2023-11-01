// Create web server using Express.js
// Created by: Team 4
// Date created: 11/20/19
// Description: This file is used to create the web server for the comments page
//              and handle the requests and responses.

// Import modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// Import modules from other files
const db = require('./db.js');
const config = require('./config.js');

// Set port
const port = 3001;

// Set up CORS
app.use(cors());

// Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Set up routes
app.get('/api/comments', (req, res) => {
    db.getComments()
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        console.log(err);
        res.status(404).send(err);
    });
});

app.post('/api/comments', (req, res) => {
    db.addComment(req.body)
    .then((data) => {
        res.status(201).send(data);
    })
    .catch((err) => {
        console.log(err);
        res.status(404).send(err);
    });
});

// Set up email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.user,
        pass: config.pass
    }
});

// Set up email route
app.post('/api/email', (req, res) => {
    let mailOptions = {
        from: config.user,
        to: config.user,
        subject: req.body.subject,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        } else {
            console.log('Email sent: ' + data.response);
            res.status(200).send(data);
        }
    });
});

// Set up error handling
app.use((req, res, next) => {
    res.status(404).send('Error 404: Page not found');
});

//

