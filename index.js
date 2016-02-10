var app = require('./server.js');
  
// var port = 4568;

// app.listen(port);

// console.log('Server now listening on port ' + port);


app.listen(process.env.PORT || 4568, function() {
  console.log('Node app is running on port', process.env.PORT || 4568);
});