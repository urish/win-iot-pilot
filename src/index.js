const http = require('http');
console.log('hello', 123);
http
  .createServer((req, res) => {
    res.end(`
      <html>
        <head>
          <title>Windows IoT Pilot</title>
        </head>
        <body>
          <h2>Welcome to IoT!</h2>
        </body>
      </html>
    `);
  })
  .listen(1280);
