'use strict';

var Player = function(game, x, y, frame) {
  var bmd = game.add.bitmapData(16,16);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0, 16,16);
  bmd.ctx.fillStyle = 'white';
  bmd.ctx.fill();
  bmd.render();
  this.reloadMax = 50;
  this.reloadCounter = 50;
  this.moveSpeed = 200;
  this.canReload = false;

  Phaser.Sprite.call(this, game, x, y, bmd);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;

  this.hud = Phaser.Plugin.HUDManager.get('gamehud');
  this.reloader = this.hud.addBar(0,-12, 16, 2, this.reloadMax, 'reloadCounter', this, '#ffbd55');
  this.reloader.bar.anchor.setTo(0.5, 0.5);
  
  this.addChild(this.reloader.bar);

  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.fireSound = this.game.add.audio('gunshot');
  this.reloadSound = this.game.add.audio('reloadSound');

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
  if (this.reloadCounter === 20  ) {
    console.debug('playing reload sound', this.reloadSound);
    this.reloadSound.play();
    
  }
};

Player.prototype.fire = function() {
  this.reloadCounter = 0;
  this.fireSound.play();
};

module.exports = Player;
