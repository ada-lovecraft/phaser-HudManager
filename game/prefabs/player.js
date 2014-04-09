'use strict';

var Player = function(game, x, y, frame) {
  var bmd = game.add.bitmapData(16,16);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0,0, 16,16);
  bmd.ctx.fillStyle = 'white';
  bmd.ctx.fill();
  bmd.render();

  Phaser.Sprite.call(this, game, x, y, bmd);



  this.ammoMax = 6;
  this.ammo = 6;
  this.reloadCounter = 50;
  this.moveSpeed = 200;
  this.canReload = false;
  this.fireRate = 300;
  this.fireTimer = 0;
  


  this.reloadTimer = this.game.time.create(false);
  

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;

  this.hud = Phaser.Plugin.HUDManager.get('gamehud');
  this.ammoHUD = this.hud.addBar(0,-12, 16, 2, this.ammoMax, 'ammo', this, '#ffbd55');
  this.ammoHUD.bar.anchor.setTo(0.5, 0.5);
  
  this.addChild(this.ammoHUD.bar);

  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.fireSound = this.game.add.audio('gunshot');
  this.reloadSound = this.game.add.audio('reloadSound');
  this.emptySound = this.game.add.audio('empty');

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

};
Player.prototype.canFire = function() {
  if(this.reloadTimer.running) {
    if(this.fireTimer <= this.game.time.now) {
      this.emptySound.play();
      this.fireTimer = this.fireRate + this.game.time.now;
    }
    return false;
  } else {
    return this.fireTimer <= this.game.time.now;
  }
};


Player.prototype.addAmmo = function() {
  this.ammo++;
  if (this.ammo === this.ammoMax - 1) {
    this.reloadSound.play();
  }
  if (this.ammo === this.ammoMax) {
    this.ammoHUD.bar.alpha = 1;
    this.reloadTimer.stop(true);
    this.fireTimer = this.game.time.now;
  }
};
Player.prototype.fire = function() {
  this.ammo--;
  if (this.ammo === 0) {
    this.ammoHUD.bar.alpha = 0.75;
    this.reloadTimer.repeat(Phaser.Timer.SECOND * 0.5, this.ammoMax, this.addAmmo, this);
    this.reloadTimer.start();
  }
  this.fireSound.play();
  this.fireTimer = this.fireRate + this.game.time.now;
};

module.exports = Player;
