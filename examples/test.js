var Queue = require('../lib/queuestream').QueueStream(),
    fs = require('fs');

Queue.on('error', function(err) {
  console.log('err: ' + err);
});

Queue.on('data', function(data) {
  console.log('listener 1: ' + data.toString());
});
Queue.on('data', function(data) {
  console.log('listener 2: ' + data.toString());
});
Queue.on('data', function(data) {
  console.log('listener 3: ' + data.toString());
});

Queue.on('end', function() {
  console.log('done');
});

var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
Queue.queue(test1);
var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
Queue.queue(test2);

Queue.startNext();
