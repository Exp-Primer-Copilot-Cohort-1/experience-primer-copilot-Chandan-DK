// Create web server
// To run this file:
// 1. Open a terminal
// 2. Change the directory to the location of this file
// 3. Run the command: node comments.js
// 4. Open a web browser and go to http://localhost:8080

// Load the http module
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');

// Configure the HTTP server to respond with a simple HTML page
var server = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    var contentType = 'text/html';
    console.log(uri);
    if (uri === '/comment') {
        if (request.method === 'POST') {
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                var post = qs.parse(body);
                var comment = post.comment;
                fs.appendFile('comments.txt', comment + '\n', function(err) {
                    if (err) throw err;
                    console.log('The comment was saved!');
                });
                response.writeHead(302, {
                    'Location': '/'
                });
                response.end();
            });
        }
    } else {
        if (uri === '/') {
            filename = path.join(process.cwd(), '/index.html');
        }
        fs.exists(filename, function(exists) {
            if (!exists) {
                response.writeHead(404, {
                    "Content-Type": "text/plain"
                });
                response.write("404 Not Found\n");
                response.end();
                return;
            }
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                response.writeHead(200, {
                    "Content-Type": contentType
                });
                response.write(file, "binary");
                response.end();
            });
        });
    }
});

// Listen for incoming requests on port 8080
server.listen(8080);

// Put a friendly message on the terminal
console.log("Server running at http://localhost:8080/");
