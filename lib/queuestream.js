var util = require('util'),
    Emitter = require('eventemitter2').EventEmitter2;

function QueueStream(opts) {
  Emitter.call(this, {});

  //set defaults
  this.streams = [];
  this.current;
  this.paused = false;
  this.keepAlive = false;

  //set options
}

util.inherits(QueueStream, Emitter);

// convenience functions
QueueStream.prototype.length = function() {
  return this.streams.length;
}

QueueStream.prototype.getQueue = function() {
  return this.streams;
}

QueueStream.prototype.getCurrent = function() {
  return this.current;
}

// meat
QueueStream.prototype.queue = function(stream) {
  if (stream) {
    if (stream instanceof Array) {
      do {
        this.queue(stream.shift());
      } while (stream.length > 0)
    } else {
      stream.pause();
      this.streams.push(stream);
    }
  }
}

QueueStream.prototype.inject = function(stream) {
  stream.pause();
  this.streams.unshift(stream);
}

QueueStream.prototype.injectAndStart = function(stream) {
  this.inject(stream);
  this.next();
}

QueueStream.prototype.start = function() {
  var self = this;

  if (this.current) {
    this.current.on('end', function() {
      self.currentEnd.call(self);
    });
    this.current.on('data', function(data) {
      self.currentData.call(self, data);
    });
    this.current.on('error', function(err) {
      self.currentError.call(self, err);
    });
    this.current.on('pause', function() {
      self.currentPause.call(self);
    });
    this.current.on('resume', function() {
      self.currentResume.call(self);
    });

    if (this.current.paused) this.current.resume();
  } else if (this.streams.length > 0) {
    this.startNext();
  } else if (!(this.keepAlive)) {
    this.end();
  }
}

QueueStream.prototype.next = function() {
  if (this.current) this.current.destroy();
  if (this.streams.length > 0) {
    this.current= this.streams.shift();
  }
}

QueueStream.prototype.startNext = function() {
  this.next();
  this.start();
}

QueueStream.prototype.remove = function(stream) {
  //ATM - meh
}

// Standard Stream Methods
QueueStream.prototype.pause = function() {
  this.current.pause();
  this.emit('pause');
}

QueueStream.prototype.error = function(err) {
  this.emit('error', err);
}

QueueStream.prototype.resume = function() {
  if (!(this.paused)) this.current.resume();
  this.emit('pause');
}

QueueStream.prototype.end = function() {
  this.streams = [];
  if (this.current) this.current.destroy();
  this.emit('end');
}

// Handle currentStream Events
QueueStream.prototype.currentEnd = function() {
  this.current = null;
  this.startNext();
}

QueueStream.prototype.currentData = function(data) {
  this.emit('data', data);
}

QueueStream.prototype.currentError = function(err) {
  this.emit('err', err);
}

QueueStream.prototype.currentPause = function() {
  this.paused = true;
  this.emit('pause');
}

QueueStream.prototype.currentResume = function() {
  this.emit('resume');
}

module.exports = {
  QueueStream: function(opts) {
    return new QueueStream(opts);
  }
}
