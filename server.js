#!/bin/env node

var express = require('express');
var http = require('http');

var app = express();

app.use(function(req, res) {
    res.send('hello world');
});

http.createServer(app).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080, function(req, res) {
    console.log('listening on port ' + process.env.OPENSHIFT_NODEJS_PORT || 8080);
    console.log('ip: ', process.env.OPENSHIFT_NODEJS_IP);
});