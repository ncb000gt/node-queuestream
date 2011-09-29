var testCase = require('nodeunit').testCase,
    fs = require('fs'),
    QueueStream = require('../lib/queuestream').QueueStream;

module.exports = testCase({
  "test injecting": function(assert) {
    var stream = QueueStream();
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);
    stream.inject(test1);

    assert.equal(stream.length(), 2);

    var queue = stream.getQueue();
    assert.deepEqual(queue[0], test1);
    assert.deepEqual(queue[1], test2);

    assert.done();
  },
  "test injecting nothing": function(assert) {
    var stream = QueueStream();
    stream.inject();

    assert.equal(stream.length(), 0);

    var queue = stream.getQueue();
    assert.equal(queue.length, 0);

    assert.done();
  },
  "test injecting array": function(assert) {
    var stream = QueueStream();
    var test0 = fs.createReadStream(__dirname + '/files/test1.txt');
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test0);
    stream.inject([test1, test2]);

    assert.equal(stream.length(), 3);

    var queue = stream.getQueue();
    assert.equal(queue.length, 3);
    assert.deepEqual(queue[0], test1);
    assert.deepEqual(queue[1], test2);

    assert.done();
  },
  "test queuing": function(assert) {
    var stream = QueueStream();
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);

    assert.equal(stream.length(), 1);

    var queue = stream.getQueue();
    assert.deepEqual(queue[0], test1);

    assert.done();
  },
  "test queuing nothing": function(assert) {
    var stream = QueueStream();
    stream.queue();

    assert.equal(stream.length(), 0);

    var queue = stream.getQueue();
    assert.equal(queue.length, 0);

    assert.done();
  },
  "test queuing array": function(assert) {
    var stream = QueueStream();
    var test0 = fs.createReadStream(__dirname + '/files/test1.txt');
    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test0);
    stream.queue([test1, test2]);

    assert.equal(stream.length(), 3);

    var queue = stream.getQueue();
    assert.equal(queue.length, 3);
    assert.deepEqual(queue[1], test1);
    assert.deepEqual(queue[2], test2);

    assert.done();
  },
  "test data emits": function(assert) {
    assert.expect(6);
    var count = 0;
    var stream = QueueStream();

    stream.on('error', function(err) {
      console.log('err: ' + err);
    });

    function dataCb(data) {
      var str = data.toString();
      assert.ok((str == 'Hello\n' || str == 'World\n'));

      if (++count == 6) assert.done();
    }

    stream.on('data', dataCb);
    stream.on('data', dataCb);
    stream.on('data', dataCb);

    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);

    stream.startNext();
  },
  "test data emits with small buffers": function(assert) {
    assert.expect(12);
    var count = 0;
    var stream = QueueStream();

    stream.on('error', function(err) {
      console.log('err: ' + err);
    });

    function dataCb(data) {
      var str = data.toString();
      assert.ok(str == 'He' || str == 'll' || str == 'o\n' || str == 'World\n');

      if (++count == 12) assert.done();
    }

    stream.on('data', dataCb);
    stream.on('data', dataCb);
    stream.on('data', dataCb);

    var test1 = fs.createReadStream(__dirname + '/files/test1.txt', {bufferSize: 2});
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);

    stream.startNext();
  },
  "test next": function(assert) {
    assert.expect(1);
    var count = 0;
    var stream = QueueStream();

    var test1 = fs.createReadStream(__dirname + '/files/test1.txt');
    stream.queue(test1);
    var test2 = fs.createReadStream(__dirname + '/files/test2.txt');
    stream.queue(test2);

    stream.next();
    var current = stream.getCurrent();
    assert.deepEqual(current, test1);

    assert.done();
  }
});
