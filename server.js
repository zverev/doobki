#!/bin/env node

var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(function(req, res, next) {
    if (req.url === '/millisecondstomay') {
        var now = new Date();
        var may = new Date(now.getFullYear(), 04, 01);
        var timeLeft = may.getTime() - now.getTime();
        if (!timeLeft) {
            res.status(200).send('0');
        } else {
            res.status(200).send(timeLeft + '');
        }
    } else {
        next();
    }
});

app.use(function(req, res) {
    res.status(404).send('not found');
})

console.log('port: ', process.env.OPENSHIFT_NODEJS_PORT || 8080);
console.log('ip: ', process.env.OPENSHIFT_NODEJS_IP);

http.createServer(app).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP, function(req, res) {
    console.log('listening on port ' + (process.env.OPENSHIFT_NODEJS_PORT || 8080));
});