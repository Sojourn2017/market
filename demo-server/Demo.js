let user = require('./user');
console.log(user.sayHello());

let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res) => {
  res.statusCode = 200;

  res.setHeader("Content-Type","text/plain; charset=utf-8");
  res.end(util.inspect(url.parse(req.util)));
});

server.listen(3000,'127.0.0.1',()=>{
  console.log('Server running on 3000 port');
});