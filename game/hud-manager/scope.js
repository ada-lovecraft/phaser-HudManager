'use strict';
function initWatchVal() {}

function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || function() {},
    last: initWatchVal,
  };
  this.$$watchers.push(watcher);
  this.$$lastDirtyWatch = null;
};



Scope.prototype.$digestOnce = function() {
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

Scope.prototype.$digest = function() {
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

module.exports = Scope;