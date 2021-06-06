const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/') || pathname.includes('..')) {
        res.statusCode = 400;
        return res.end('Nested paths are not allowed');
      };
      fs.unlink(filepath, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end();
          } else {
            res.statusCode = 500;
            res.end(error.message);
          }
        } else {
          res.statusCode = 200;
          res.end('success');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
