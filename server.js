const express = require('express');
const bodyParser = require('body-parser');
const app = express();
      
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = require('socket.io').listen(server);
require('./routes/socket')(io);

server.listen(8080, ()=>{
  console.log('http://localhost:8080');
});    
