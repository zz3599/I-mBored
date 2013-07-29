var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var static = require('node-static');


var staticfs = new static.Server('./public');


//serve api calls
var httpserve = function(request, response){
};


//router
var route = function(request, response){
    var parsedurl = url.parse(request.url, true);
    console.log('Request for ' + parsedurl.pathname + " received");
    if(parsedurl.pathname.indexOf('search') !== -1){
        httpserve(request, response);
    }
    else {
        staticfs.serve(request, response);
    }
};


//Server 
http.createServer(function (request, response) {
    route(request, response);
}).listen(process.env.PORT || 5000);