var static = require('node-static');

// Creates a node static server that serves static files 
var file = new static.Server('./');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(3000);
