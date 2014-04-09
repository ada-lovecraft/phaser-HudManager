'use strict';

function initWatchVal() {}


var HudManager = function(game, name, pollRate) {
  this.game = game;
  this.pollRate = pollRate || 100;
  this.digestTimer = this.game.time.events.loop(this.pollRate, this.$digest, this);
  this.digestTimer.timer.start();
  this.$$watchers = [];
  this.$$lastDirtyWatch = null;
  this.name = name || HudManager.hudCounter++;
};

HudManager.huds = {};
HudManager.hudCounter = 0;

HudManager.createHud = function(game, name, pollrate) {
    name = name || HudManager.hudCounter++;
    var hud = new HudManager(game, name, pollrate);
    HudManager.huds[name] = hud;
    return hud;
};

HudManager.prototype.destroy = function() {
 delete HudManager.huds[this.name];
 this.$$watchers = [];
};

HudManager.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {},
    last: initWatchVal,
  };
  this.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
  var self = this;
  return function() {
    var index = self.$$watchers.indexOf(watcher);
    if (index >= 0) {
      self.$$watchers.splice(index, 1);
    }
  };
};



HudManager.prototype.$digestOnce = function() {
  var newValue, oldValue, dirty;
  this.$$watchers.forEach(function(watcher) {
    newValue = watcher.watchFn(this);
    oldValue = watcher.last;
    if(newValue !== oldValue) {
      this.$$lastDirtyWatch = watcher;
      watcher.last = newValue;
      watcher.listenerFn(newValue, (oldValue == initWatchVal ? newValue: oldValue), this);
      dirty = true;
    } else if (this.$$lastDirtyWatch === watcher) {
      return false;
    }
  }, this);
  return dirty;
};

HudManager.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;
  do {
    dirty = this.$digestOnce();
    if (dirty && !(ttl--)) {
      throw "10 Digest Iterations Reached";
    }
  } while (dirty);
};

HudManager.prototype.addText = function(x, y, label, style, watched, context) {
  var text = this.game.add.text(x, y, label, style);
  context = context || window;
  var dereg = this.$watch(function() {
      return context[watched];
    }, function() {
      text.setText(label + context[watched]);
  });
  return {text: text, deregister: dereg};
};

HudManager.prototype.addProgressBar = function(x, y, width, height, max, watched, context) {
  var bmd = this.game.add.bitmapData(width, height);
  context = context || window;
  var bar = this.game.add.sprite(x, y, bmd);
  var dereg = this.$watch(function() {
    return context[watched];
  }, function(newVal) {
    var percent = newVal / max;
    if(percent <= 1) {
      bmd.clear();
      bmd.ctx.beginPath();
      bmd.ctx.moveTo(0,0);
      bmd.ctx.rect(0,0,width*percent, height);
      bmd.ctx.fillStyle = 'white';
      bmd.ctx.fill();
      bmd.ctx.closePath();
      bmd.render();
      bmd.refreshBuffer();
    } else {
      dereg();
    }
  });

  return {bar: bar,  deregister: dereg};
};


HudManager.prototype.addWatch = function(watched, watchedContext, callback, callbackContext) {
  watchedContext = watchedContext || window;
  callbackContext = callbackContext || window;
  var dereg = this.$watch(function() {
    return watchedContext[watched];
  }, function(newVal, oldVal) {
    callback.call(callbackContext, newVal, oldVal);
  });
  return dereg;
};

module.exports = HudManager;
