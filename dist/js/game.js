(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'hud-manager');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
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

},{"../registries/game-registry":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';

var Player = require('../prefabs/player');
var Enemy = require('../prefabs/enemy');
var GameRegistry = require('../registries/game-registry');


function Menu() {}


Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.hud = Phaser.Plugin.HudManager.create(this.game, this, 'gamehud');

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

},{"../prefabs/enemy":2,"../prefabs/player":3,"../registries/game-registry":4}],8:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.script('HudManager', 'js/plugins/HudManager.js');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])