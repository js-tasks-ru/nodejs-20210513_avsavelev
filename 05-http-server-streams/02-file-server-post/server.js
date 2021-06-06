const url = require('url');
const http = require('http');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/') || pathname.includes('..')) {
        res.statusCode = 400;
        return res.end('Nested paths are not allowed');
      };

      const limitedStream = new LimitSizeStream({limit: 1048576});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      let isAborted = false;

      function destroyWriteStream() {
        isAborted = true;
        writeStream.destroy();
      }

      req.pipe(limitedStream).pipe(writeStream);

      writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File is alredy exist');
        } else {
          res.statusCode = 500;
          res.end(error.statusCode, error.message);
        }
      });

      writeStream.on('close', () => {
        if (isAborted) {
          fs.unlink(filepath, () => {});
        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('It\'s all right');
      });

      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('Large post request body');
          destroyWriteStream();
        } else {
          res.statusCode = 500;
          res.end(error.statusCode, error.message);
        }
      });

      req.on('aborted', destroyWriteStream);

      req.on('error', (error) => {
        res.statusCode = 500;
        res.end(error.statusCode, error.message);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  };
});

module.exports = server;
