'use strict';

var Player = function(game, x, y, frame) {
  var bmd = game.add.bitmapData(32,32);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0, 32,32);
  bmd.ctx.fillStyle = 'white';
  bmd.ctx.fill();
  bmd.render();
  this.reloadMax = 50;
  this.reloadCounter = 50;
  this.moveSpeed = 100;

  Phaser.Sprite.call(this, game, x, y, bmd);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;

  this.hud = Phaser.Plugin.HudManager.get('gamehud');
  this.reloader = this.hud.addBar(0,-20, 32, 2, this.reloadMax, 'reloadCounter', this, '#ffbd55');
  this.reloader.bar.anchor.setTo(0.5, 0.5);
  
  this.addChild(this.reloader.bar);

  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
  // movement
  if(this.leftKey.isDown) {
    this.body.velocity.x = -this.moveSpeed;
  }
  if(this.rightKey.isDown) {
    this.body.velocity.x = this.moveSpeed;
  }
  if(this.downKey.isDown) {
    this.body.velocity.y = this.moveSpeed;
  }
  if(this.upKey.isDown) {
    this.body.velocity.y = -this.moveSpeed;
  }

  if(this.reloadCounter < this.reloadMax) {
    this.reloadCounter++;
  }
};

Player.prototype.fire = function() {
  this.reloadCounter = 0;
};

module.exports = Player;
