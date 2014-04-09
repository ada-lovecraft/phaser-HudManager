phaser-HudManager
=================
Introducing AnguarJS Style data bindings for your game's hud.

Demo: http://phaser-hudmanager.herokuapp.com

Usage is simple:

```language-javascript
create: function() {
  this.score = 0;
  
  var style = { font: '18px Arial', fill: '#ffffff', align: 'center'};

  this.hud = Phaser.Plugins.HUDManager.createHud(this.game, this, 'gamehud');
  this.scoreHUD = this.hud.addText(x, y, 'Score: ', style, 'score', this);
  this.game.add.existing(this.scoreHUD.text);
},

update: function() {
  this.score++;
}
```

The hud manager will watch for changes on the `this.score` variable and update your text object so that it will output:

#### Score: 0

There's also progress/health bars, and general watchers.

## API
### Static Methods
#### HUDManager.create(game, parent, name, pollrate):
##### returns: a new hud instance. if the name given already exists, it will return the current instance of the hud with that name
Don't create a bunch of hud instances around the game. Instead, create one for your game's hud, and one to encompass all of your sprites, if you're using the health bar component.

By default, the poll rate is once every 100ms. This means the hud dirty checks the watched variables 10 times a second. 



#### HUDManager.get(name):
##### returns the hud instance with the given name, or throws an exception if the named hud isn't found

### Instance Methods
#### HUDManager.destroy()
##### Destorys the current instance of HUDManager.


#### HUDManager.addText(x, y, label, style, watched, context)
##### arguments:
  * `x`: (number) the x position of the created Phaser.Text object 
  * `y`: (number) the y position of the created Phaser.Text object 
  * `label`: (string) the string to prepend to the Phaser.Text object
  * `watched`: (string) the name of the variable to watch in the given context
  * `context`: (object) the context of the watched variabled

##### returns: 
{ text: Phaser.Text, deregister: Function }
Calling the deregistration function will cause the HUDManager instance to stop updating on changes

#### HUDManager.addBar(x, y, width, height, max, watched, context, color, backgroundColor, shouldCountUp )
Adds a progress/health bar.
##### arguments
  * `x`: (number) the x position of the created Phaser.Sprite object 
  * `y`: (number) the y position of the created Phaser.Sprite object 
  * `width`: (number) the width of the created Phaser.Sprite object 
  * `height`: (number) the height of the created Phaser.Sprite object 
  # `max`: (number) the maximum value of the watched value
  * `watched`: (string) the name of the variable to watch in the given context
  * `context`: (object) the context of the watched variabled
  * `color`: (string | function) the color of the created bar. You can provide a function that accepts (percent) as an argument. Percent will be a value between 0 and 1 indicating how much of the bar is filled. The function must return a string that represents a color. DEFAULT: 'white'
  * 'backgroundColor': (string) A string representing a color. DEFAULT: '#999'

##### returns: 
{ bar: Phaser.Sprite, deregister: Function }
Calling the deregistration function will cause the HUDManager instance to stop updating on changes

#### HUDManager.HEALTHBAR
This is a predefined function that you can pass as the `color` argument in `HUDManager.addBar`. This will automatically return a green, yellow, or red color to signify the health amount.


#### HUDManager.addWatch(watched, watchedContext, callback, callbackContext)
##### arguments
  * `watched`: (string) the name of the variable to watch in the given context
  * `watchedContext`: (object) the context of the watched variabled
  * `callback`: (Function(newValue, oldValue)) callback to call when a change has been detected
  * `callbackContext`: (object) the context of the callback function

##### returns: Function
  The returned function is the deregistration function. Calling this function will stop the HUDManager instance from watching for changes on this watched item.
