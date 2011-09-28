var Queue = require('../lib/queuestream').QueueStream(),
    fs = require('fs');

stream.on('error', function(err) {
  console.log('err: ' + err);
});

stream.on('data', function(data) {
  console.log(data.toString());
});

stream.on('end', function() {
  console.log('done');
});

var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
stream.queue(test1);
var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
stream.queue(test2);

stream.start();
