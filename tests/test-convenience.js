var testCase = require('nodeunit').testCase,
    fs = require('fs'),
    QueueStream = require('../lib/queuestream').QueueStream;

module.exports = testCase({
  "test length": function(assert) {
    var stream = QueueStream();
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);

    assert.equal(stream.length(), 2);

    assert.done();
  },
  "test current": function(assert) {
    var stream = QueueStream();
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);
    assert.equal(stream.length(), 2);

    stream.next();
    var current = stream.getCurrent();
    assert.deepEqual(current, test1);

    assert.done();
  },
  "test queue": function(assert) {
    var stream = QueueStream();
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);
    assert.equal(stream.length(), 2);

    var queue = stream.getQueue();
    assert.deepEqual(queue[0], test1);
    assert.deepEqual(queue[1], test2);

    assert.done();
  }
});
