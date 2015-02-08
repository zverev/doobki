#!/bin/env node

var express = require('express');
var http = require('http');

var app = express();

app.use(function(req, res) {
    res.send('hello world');
});

http.createServer(app).listen(8080, function(req, res) {
    console.log('listening on port ' + 8080);
});