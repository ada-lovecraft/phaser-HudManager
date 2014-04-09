'use strict';

var GameRegistry = function() {
  GameRegistry.player = null;
};

GameRegistry.getPlayer = function() {
  return GameRegistry.player;
};

GameRegistry.setPlayer = function(p) {
  GameRegistry.player = p;
};

module.exports = GameRegistry;