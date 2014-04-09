'use strict';
var GameRegistry = require('../registries/game-registry');

var Enemy = function(game, x, y, frame) {
  var bmd = game.add.bitmapData(32,32);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0, 32,32);
  bmd.ctx.fillStyle = 'red';
  bmd.ctx.fill();
  bmd.render();
  this.maxHealth = 5;
  Phaser.Sprite.call(this, game, x, y, bmd);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.health = 5;
  this.alive = true;

  this.hud = Phaser.Plugin.HudManager.get('gamehud');
  this.healthHUD = this.hud.addBar(0,-20, 32, 2, this.maxHealth, 'health', this, Phaser.Plugin.HudManager.HEALTHBAR, false);
  this.healthHUD.bar.anchor.setTo(0.5, 0.5);
  this.addChild(this.healthHUD.bar);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
  this.game.physics.arcade.moveToObject(this,GameRegistry.getPlayer());
  
};

module.exports = Enemy;
