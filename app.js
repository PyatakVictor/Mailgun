const path = require('path');
const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const bodyParser = require('body-parser');
const nconf = require('nconf');
const auth = require('./config.json');
const port = process.env.PORT || 8081;

const app = express();
const server = require('http').createServer(app);

// app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
});
app.use(logger('dev'));
app.use(logger('combined', {
    stream: accessLogStream
}));

// app.get('/', function (request, response) {
//     response.sendFile(path.join(__dirname + '/assets/index.html'));
// });

// app.get(function (request, response) {
//     response.sendFile(path.join(__dirname + '/assets/404.html'));
// });

// app.get('/about', function (req, res) {
//     response.sendFile(path.join(__dirname + '/assets/about.html'));
// });


app.get('/contact', function(req,res){
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/contact', function(req,res){
    
    var api_key= 'key-cb5c6ed0c0fbaf47164c28d5e10a8f2d';
    var domain='sandboxe744ced73ebf437ea1e34af48dcd0909.mailgun.org';
    var mailgun = require('mailgun-js')({apiKey:api_key, domain:domain});


    var mailOptions ={
        from:'"Pyavic" <pyavic@gmail.com>',
        to:'pyavic@gmail.com',
        subject: req.body.name,
        text:req.body.content,
    };

mailgun.messages().send(mailOptions, function(err, content){
    console.log(content);
    if(!err)
        res.send("Mail Sent!");
    else
        res.send("Mail not Sent!");
});

    // transporter.sendMail(mailOptions, function(error, info){
    //     if(error){
    //         console.log('\nERROR:'+ error+'\n');
    //     }else{
    //         console.log('\nRESPONSE SENT:'+info.response+ '\n');
    //     }
    // });
});

server.listen(port, function () {
    console.log('Web app started and listening on http://localhost:' + port);
  });