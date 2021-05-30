const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isIncludesDir = pathname.includes('/');
  console.log(pathname);
  switch (req.method) {
    case 'GET':
      if (isIncludesDir) {
        res.statusCode = 400;
        return res.end('Not found!');
      } else {
        const streamRead = fs.createReadStream(filepath);
        streamRead.on('error', (err) => {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
          res.end('Not found!');
        });
        streamRead.pipe(res);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
