// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');

const dotenvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({path:dotenvPath});

const app = express();

const encrypt = process.env.HTTPS;
const domain = process.env.DOMAIN;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

if(encrypt==='true') {
  // Certificate
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/chain.pem', 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
}