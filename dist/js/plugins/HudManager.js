'use strict';
/**
* A Sample Plugin demonstrating how to hook into the Phaser plugin system.
*/
function initWatchVal() {}

Phaser.Plugin.HudManager = function (game, parent, name, pollRate) {

  Phaser.Plugin.call(this, game, parent);

  this.pollRate = pollRate || 100;
  this.digestTimer = this.game.time.events.loop(this.pollRate, this.$digest, this);
  this.digestTimer.timer.start();
  this.$$watchers = [];
  this.$$lastDirtyWatch = null;
  this.name = name || Phaser.Plugin.HudManager.hudCounter++;
};

Phaser.Plugin.HudManager.huds = {};
Phaser.Plugin.HudManager.hudCounter = 0;

Phaser.Plugin.HudManager.HEALTHBAR = function(percent) {
  if (percent <= 0.25) {
    return '#ff7474'; //red
  }
  if (percent <= 0.75) {
    return '#eaff74'; //yellow
  }
  return '#74ff74'; //green
};


Phaser.Plugin.HudManager.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.HudManager.prototype.constructor = Phaser.Plugin.HudManager;



Phaser.Plugin.HudManager.create = function(game, parent, name, pollrate) {
    var hud = Phaser.Plugin.HudManager.huds[name];
    if(!!hud) {
      return hud;
    }
    name = name || Phaser.Plugin.HudManager.hudCounter++;
    hud = new Phaser.Plugin.HudManager(game, parent, name, pollrate);
    Phaser.Plugin.HudManager.huds[name] = hud;
    return hud;
};

Phaser.Plugin.HudManager.get = function(name) {
    var hud = Phaser.Plugin.HudManager.huds[name];
    if(hud) {
      return hud;
    } else {
      throw 'HUD "' + name + '" not found';
    }
};


Phaser.Plugin.HudManager.prototype.destroy = function() {
 delete Phaser.Plugin.HudManager.huds[this.name];
 this.$$watchers = [];
};

Phaser.Plugin.HudManager.prototype.$watch = function(watchFn, listenerFn) {
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



Phaser.Plugin.HudManager.prototype.$digestOnce = function() {
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

Phaser.Plugin.HudManager.prototype.$digest = function() {
  var ttl = 10;
  
  var self = this;

  this.$$lastDirtyWatch = null;
  function digest() {
    var dirty = self.$digestOnce();
    if (dirty && !(ttl--)) {
      throw "10 Digest Iterations Reached";
    }
    if(dirty) {
      setTimeout(digest, 0);
    }
  }
  setTimeout(digest, 0);
    
};

Phaser.Plugin.HudManager.prototype.addText = function(x, y, label, style, watched, context) {
  var text = this.game.add.text(x, y, label, style);
  context = context || window;
  var dereg = this.$watch(function() {
      return context[watched];
    }, function() {
      text.setText(label + context[watched]);
  });
  return {text: text, deregister: dereg};
};

Phaser.Plugin.HudManager.prototype.addBar = function(x, y, width, height, max, watched, context, color, backgroundColor, shouldCountUp ) {
  max = max || 100;
  if(typeof backgroundColor === 'boolean') {
    shouldCountUp = backgroundColor;
    backgroundColor = null;
  }

  shouldCountUp = shouldCountUp !== null ? shouldCountUp : true; 
  color = color || 'white';
  backgroundColor = backgroundColor || '#999';

  var colorFunction = function() { return color; };

  if(typeof color === 'function' ) {
    colorFunction = color;
  }

  
  var bmd = this.game.add.bitmapData(width, height);
  context = context || window;
  var bar = this.game.add.sprite(x, y, bmd);
  var dereg = this.$watch(function() {
    return context[watched];
  }, function(newVal) {
    var percent = newVal / max;
    if((percent <= 1 && shouldCountUp) || (percent >= 0 && !shouldCountUp)) {
      bmd.clear();
      bmd.ctx.beginPath();
      bmd.ctx.moveTo(0,0);
      bmd.ctx.rect(0,0, width, height);
      bmd.ctx.closePath();
      bmd.ctx.fillStyle = backgroundColor;
      bmd.ctx.fill();
      bmd.ctx.beginPath();
      bmd.ctx.rect(0,0,width*percent, height);
      bmd.ctx.fillStyle = colorFunction(percent);
      bmd.ctx.fill();
      bmd.ctx.closePath();
      bmd.render();
      bmd.refreshBuffer();
    } 
  });

  return {bar: bar,  deregister: dereg};
};


Phaser.Plugin.HudManager.prototype.addWatch = function(watched, watchedContext, callback, callbackContext) {
  watchedContext = watchedContext || window;
  callbackContext = callbackContext || window;
  var dereg = this.$watch(function() {
    return watchedContext[watched];
  }, function(newVal, oldVal) {
    callback.call(callbackContext, newVal, oldVal);
  });
  return dereg;
};



