
'use strict';

var Player = require('../prefabs/player');
var Enemy = require('../prefabs/enemy');
var GameRegistry = require('../registries/game-registry');


function Menu() {}


Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.hud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');

    this.player = new Player(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.player);
    GameRegistry.setPlayer(this.player);

    this.bulletBMD = this.game.add.bitmapData(4,4);
    this.bulletBMD.ctx.beginPath();
    this.bulletBMD.ctx.rect(0,0, 4,4);
    this.bulletBMD.ctx.fillStyle = '#008aff';
    this.bulletBMD.ctx.fill();
    this.bulletBMD.render();

    this.bullets = this.game.add.group();

    this.enemies = this.game.add.group();
    this.enemies.add(new Enemy(this.game, this.game.world.randomX, this.game.world.randomY));
    
    this.score = 0;
    this.shotsFired = 0;
    this.accuracy = null;
    this.hits = null;
    
    var style = { font: '18px Arial', fill: '#ffffff', align: 'center'};
    this.scoreHUD = this.hud.addText(10, 10, 'Score: ', style, 'score', this);
    this.game.add.existing(this.scoreHUD.text);

    this.firedHUD = this.hud.addText(150, 10, 'Shots Fired: ', style, 'shotsFired', this);
    this.game.add.existing(this.scoreHUD.text);

    this.accuracyHUD = this.hud.addText(300, 10, 'Accuracy: ', style, 'accuracy', this);
    this.game.add.existing(this.accuracyHUD.text);


    /*
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.textWatcher = this.hud.addText(this.game.world.centerX, 300, 'Update Calls: ', style, 'score', this);
    this.textWatcher.text.anchor.setTo(0.5, 0.5);

    
    this.progressWatcher = this.hud.addProgressBar(5, 10, 790, 100, 300, 'score', this );

    this.cooldownWatcher = this.hud.addWatch('cooldownCounter',this, this.cooldownHandler, this);

    this.bmd = this.game.add.bitmapData(790, 50);
    this.bmd.ctx.rect(0,0,790,50);
    this.bmd.ctx.fillStyle = 'white';
    this.bmd.ctx.fill();
    this.bmd.render();
    this.cooldownSprite = this.game.add.sprite(5,400, this.bmd);
    this.cooldownSprite.alpha = 0;
    var cooldownText = this.game.add.text(this.cooldownSprite.width/2,this.cooldownSprite.height / 2,'cooldown');
    cooldownText.anchor.setTo(0.5, 0.5);
    
    this.cooldownSprite.addChild(cooldownText);
    */

  },
  update: function() {
    if(this.game.input.activePointer.isDown) {
      this.fire();
    }

    this.game.physics.arcade.collide(this.bullets, this.enemies, this.killEnemy, null, this);
  },

  killEnemy: function(bullet, enemy) {
    this.hits++;
    this.accuracy = (this.hits / this.shotsFired * 100).toFixed(2);
    bullet.kill();
    enemy.damage(1);
    
    if(this.enemies.countLiving() == 0) {
      this.score++;
      var enemy = this.enemies.getFirstExists(false);
      enemy.reset(this.game.world.randomX, this.game.world.randomY, enemy.maxHealth);
    }
    
  },
  fire: function() {
    if(this.player.reloadCounter >= this.player.reloadMax) {
      var bullet = this.bullets.getFirstExists(false);
      if(!bullet) {
        bullet = this.bullets.add(this.game.add.sprite(0,0, this.bulletBMD));
        this.game.physics.arcade.enableBody(bullet);
        bullet.anchor.setTo(0.5, 0.5);
      }
      bullet.reset(this.player.x, this.player.y);
      this.game.physics.arcade.moveToPointer(bullet, 1000);
      this.player.fire();
      this.shotsFired++;
      
    }
  },
  cooldownHandler: function(cooldownValue, oldVal) {
    if(cooldownValue <= 0 ) {
      this.cooldownWatcher();
    } else {
      var percent = cooldownValue / 300;
      this.cooldownSprite.alpha = percent;
    }

  },
};

module.exports = Menu;
