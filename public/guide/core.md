
# Core Quintus Basics

The core engine, located in [quintus.js](../quintus/docs/quintus.html), does very little game-wise by itself and provides little more than a backbone for the other modules to build around. The main features of the core engine are the module system; a set of utility methods (primarily taken from Underscore.js.); Game Loop support; support for classes, events and components; setup methods for getting a game container on screen; asset loading and math utility methods.

[quintus.js](../quintus/docs/quintus.html) is well commented and viewing the annotated source code is worth a quick read-through if you want to understand more about the engine. There are a couple pieces (Matrix functionality, all the Underscore.js carryovers) that aren't covered in this guide.

## Creating an engine instance

To create a new instance of the engine, you use the `Quintus()` constructor method and save the result:

    // Create a new instance of the engine.
    var Q = Quintus();
    
These guides will generally use the variable `Q` to refer to an instance of the engine. You can create multiple instances of the engine on a single page, but note that each instance is completely separate from the other and they won't interact with each other in any way.

## Including modules

To make the engine do anything useful, you'll need to include at least a few modules. Quintus uses modules even for core behavior to reduce coupling between the various parts of the engine, make it clear what the responsibility of each subsystem is, and make it easier for someone to swap out a custom piece of functionality (want your own input library? Duplicate the external API in [quintus_input.js](../quintus/docs/quintus_input.html) and swap out your module for the provided one)

To include a module in Quintus, you use `Q.include(...)` and pass either a string of comma-separate modules names or an array of the modules themselves. The former syntax is more compact and more common, but both are allowed:

    // Include the Sprites, Scenes and Input modules
    var Q = Quintus().include("Sprites, Scenes, Input");

    // Alternate syntax, same result.
    var Q2 = Quintus().include([
                Quintus.Sprites,
                Quintus.Scenes,
                Quintus.Input ]);
                
## Creating your own modules

Modules aren't anything terribly special, all they do is extend an instance of the engine with additional functionality. They are generally created by adding a method to the base `Quintus` object that takes in an instance of the engine and adds properties onto it. 

For example, if you wanted to create a `Quintus.Random` module that adds in a `Q.random(min,max)` method to generate random numbers, you could write the following:

    
    Quintus.Random = function(Q) {
    
      Q.random = function(min,max) {
        return min + Math.random() * (max - min);
      }
      
    };

While any method that takes in a single argument (the engine instance `Q`) can be used as a Quintus module, if you add your module onto the base `Quintus` constructor method, as is done above, you can use the shortened string syntax from the last section.

Notice that modules are added onto the `Quintus` constructor object, while they operate (and add functionality to) an instance of the engine (usually stored in `Q`).

## Getting your game on the page

Before you can do anything with your game, you need to get an instance of the engine onto the page. The `Q.setup([id],[options={}])` method is responsible for binding the engine to a canvas element on the page and configuring the size of the canvas element. Both arguments are optional.

At its simplest invocation, you can call `Q.setup` with no arguments to create a canvas element 320 pixels wide by 420 pixels tall and add it to the page for you:

    var Q = Quintus().setup();
    
All the initial Quintus setup methods return the `Q` object, so you can generally chain together your initial configuration calls:

    var Q = Quintus().include("Sprites, Scenes, Input")
                     .setup();
    
If you already have a canvas element on the page, you pass the `id` of that element and Quintus will bind to that existing element (note, since Quintus doesn't rely on jQuery don't prefix the id with a pound sign):

    <canvas id='myGame' width='500' height='500'></canvas>
    
    <script>
      var Q = Quintus().setup("myGame");
    </script>
  
If you want your game to take up the full page, you can pass a `maximize` option set to true and Quintus will resize the canvas element to the size of the page. If you want the game only to maximize on touch devices, but otherwise to stay in a fixed box, set the option to the string "touch":

    // Always maximize
    var Q = Quintus().setup({ maximize: true });

    // Maximize only on touch devices
    var Q2 = Quintus().setup({ maximize: "touch" });
    
In addition to maximize, setup also takes a number of different options to control the size of the element on the page, as shown in the example below:


    var Q = Quintus.setup({
      width:   800, // Set the default width to 800 pixels
      height:  600, // Set the default height to 600 pixels
      upsampleWidth:  420,  // Double the pixel density of the 
      upsampleHeight: 320,  // game if the w or h is 420x320
                            // or smaller (useful for retina phones)
      downsampleWidth: 1024, // Halve the pixel density if resolution
      downsampleHeight: 768  // is larger than or equal to 1024x768
    });
    
## The canvas context

For canvas games, the rendering context will be available in the Q.ctx variable. Unless you are creating your own rendering loop, you generally won't need to access `Q.ctx` directly as the context will be passed in to a Sprite's `draw` method.

If you are using the Scenes module, drawing directly to the context at other times (such as during the `step` method) usually isn't a good idea as the context is cleared preceding the calls to draw.
    
## Creating classes

Once you have the engine on the page, you'll want to start building some classes for your game. Quintus provides a customized implementation of John Resig's [simple JavaScript inheritance](http://ejohn.org/blog/simple-javascript-inheritance/) to add a traditional inheritance model into Quintus.

The base class is `Q.Class`. To extend from this class you call `Q.Class.extend(ClassName, { .. methods .. }, { .. class methods .. })`. The class name is included as an argument to allow the class some introspection properties. A special `init` method acts as the constuctor. For example, calling extend with a name of "MyClass" will automatically add MyClass to Q, as shown below:

    Q.Class.extend("MyClass", { 
       init: function() { console.log("MyClass instance created"); },
       doIt: function() { alert("Doin it!"); }  
    });
    
    var myInstance = new Q.MyClass(); // MyClass instance created
    
    myInstance.doIt(); // Doin it!
    
    console.log(myInstance.className); // 'MyClass'
    console.log(myInstance instanceof Q.Class); // true
    console.log(myInstance instanceof Q.MyClass); // true
    
If you are overriding an existing method on a class, you can call the method you overloaded via `this._super(..)`.
    
    
### Events with Evented

Instead of building off of the base class, most of the time you'll inherit from a built-in class that provides a little more functionality. Oftentimes, you'll start with the `Q.Sprite` class, described in the next chapter.

If you don't need the full functionality provided by `Q.Sprite`, you can start with a lighter class, either `Q.Evented` or `Q.GameObject`.

The `Q.Evented` class adds an event system into the base class. It provides a mechanism for listening for and triggering events. Quintus uses events extensively to reduce coupling between different components while still making it easy for various parts of your game to interact with each other. 

Components (described in the next section,) often use events to extend the functionality of the object they are added to without needing to override methods.

Quintus provides two methods, `on` and `off` to add and remove listeners respectively. The syntax is:

    srcObj.on("eventName",[ targetObj, ] [ callback ]);
    srcObj.off("eventName",[ targetObj, ] [ callback ]);
    
 The only required parameter to each method is the event name, in the form of a string. If no other parameters are provided, then the method will assume the target object is the same as the source object and the callback is the same as the event name. If you provide a string for a callback instead of a function, the system will look up a property of that name on the `targetObj`.
 
 For example the collision system will trigger a `hit` event on an object each time it collides with another. If you just wanted that object to call its own `hit` method each time that event is triggered, you could write:
 
     srcObj.on("hit");
     
For the `off` method, the more parameters you provide the more specific the event unbound will be. If you only provide an event name, all events on that source object with that name will be removed. If you provide all three parameters, only 1 specific event will be unbound.

`Evented` also provides a `debind` method that will remove all the events an object is listening to. `debind` is called automatically when Sprites are destroyed, meaning you don't normally need to worry about unbinding events yourself.

Some more examples of how `on` can be called are shown below:

    var spaceship = new Q.SpaceShip();
    var spacestation = new Q.SpaceStation();
    
    // Provide callback inline
    spaceship.on("fire",function(gun) {
      console.log("Just fired gun: " + gun);
    });
    
    // The recharegeShield method will be called on spaceship
    // each step
    spaceship.on("step","rechargeShield"); 
    
    spaceship.on("dock",spacestation,"shipDocked");

To trigger events, you call the `trigger` method with the name of the event you are triggering and up to 3 arguments. It's important to be consistant with what arguments you pass to events as these provide much of the external API to your objects.

For example, to continue with our spaceship example, you might have the following:

    spaceship.on("step", function() {
      if(Q.inputs['fire1']) {
        this.trigger("fire","gun1");
      }
      if(Q.inputs['fire2']) {
        this.trigger("fire","gun2");
      }
    });
 
 Quintus does not support namespaced events at this time, but you can use any characters in your event names that you like.
 
## Components with GameObject
 
 The last generic base class that Quintus provides is the `GameObject` class. It inherits from `Evented` and adds in support for components. Components are small pieces of reusable functionality that can be added and removed from objects dynamically. Components will often trigger events when anything exciting happens so that the main object can be notified that it might want to take some action.
 
 You'll often create sprites that add a number of existing components to it in the `init` constructor method to set up some basic functionality and then listen for some events on those components. Components are added by calling the `GameObject.add` method and passing a comma separated string of components.
 
 For example the 2D module defines a number of components to make working with 2D games easier and the Input module defines components for having sprites be controlled by player input.
 
 To have a sprite that acts like a player-controlled 2D platformer, you could simply add those two components to the sprite on `init`:
 
     var Q = Quintus().include("Sprites, Scenes, 2D, Input");
 
     // Every instance of Q.Player will have these two components
     Q.Sprite.extend("Player", {
       init: function() {
         this.add("2d, platformerControls");
       }
     });
     
(Note: this sprite doesn't define an asset or a sprite sheet and doesn't have a width or height, so it wouldn't look like anything yet. Take a look at the [Chapter on sprites](sprites.md) for more details)

Since components are added and removed dynamically, you can add and remove them as you like on the fly. To remove a componnent, use the `GameObject.del` method. Let's say you were using components to control what gun a user was currently firing, you could remove the pistol component and add the rocket launcher component in:

    player.del("pistol");
    player.add("rocketLauncher");

You can use `GameObject.has` to determine if a object has a certain component:

    player.has("pistol"); // false
    player.has("rocketLauncher"); // true
    
## Creating Components

To create your own component, you use the `Q.component` method with a component name and a set of methods. If you call `Q.component` with only a single parameter, it will return that component class.

You generally don't want to override the `init` method of a component, which is called when the component is created but has not yet been added to an object. Instead you should override the `added` method which is called once the component has actually been added to an existing sprite. The object the component is added to is stored in the `entity` property.

Methods are generally added to the entity under the namespace of the component, but you can also extend the main object directly by adding in an `extend` property to the component. 

For example, to create a `pistol` component that has its own method called `refillAmmo` and adds a method on the player called `fire` you could write:

    Q.component("pistol", {
      added: function() {
        // Start the ammo out 1/2 filled
        this.entity.p.ammo = 30;
      },
    
      refillAmmo: function() {
        // We need to say this.entity because refillAmmo is 
        // added on the component
        this.entity.p.ammo = 60;
      },
      
      extend: {
        fire: function() {
          // We can use this.p to set properties
          // because fire is called directly on the player
          if(this.p.ammo > 0) {
            this.p.ammo-=1;
            console.log("Fire!");
          }
        }      
      }
    });


    // Example usage:
    
    Q.Sprite.extend("Player");
    
    var player = new Q.Player();
    
    player.add("pistol");
    
    // Call fire directly
    player.fire(); // Fire!
    
    // Call refillAmmo on the pistol component
    player.pistol.refillAmmo();
    
## The Game Loop

Any game you build with Quintus is going to need a game loop. The good news is most of the time the game loop is completely transparent as a special game loop gets started automatically by the `Scenes` modules when you stage your first scene in a game, but it's worth knowing how the game loop works as you can use it to pause and unpause your game.

If you want to write a custom game loop callback, you can do that by calling `Q.gameLoop(callback)` with a custom callback function. The callback will be called upto 60 times per second with an argument of `dt` which represents the time in seconds (usually fractions of a second) since the method was last called.

For example:

     Q.gameLoop(function(dt) {
        Q.clear();
        // .. do something .. 
     });
     
Each instance of Quintus can only have one `gameLoop`, so if you are using the `Scenes` module you should let that module handle creating the loop.

If you want to pause or unpause Quintus completely, you can run:
 
    Q.pauseGame();
    // Do something ..
    Q.unpauseGame();
    
This will stop the game loop from running at all and then restart it afterwards. Please note, pausing the game will turn off both stepping and drawing.

## Game State

Quintus (v0.0.4 and up) provides a mechanism for tracking global game state - be it number of lives remaining, score or inventory. This comes in the form of the `Q.state` object (an instance of `Q.GameState`).

`Q.state` is nothing more than a light wrapper on top of `Q.GameObject` to allow you to set properties and track changes to those properties. The most common use case might be something like a player's score. 

When a player starts a new game, you can use `Q.state.reset({ ... props ... })` to set some initial properties, such as:

    Q.reset({ score: 0, lives: 2 });

`Q.reset` resets all the properties to the passed in hash (or nothing if no hash is passed in) and removes all event listeners to the game state. You can add listeners to the game state that are triggered on certain properties. For example, let's say you have a score sprite, you could do something like the following:

    Q.UI.Text.extend("Score",{ 
      init: function(p) {
        this._super({
          label: "score: 0",
          x: 0,
          y: 0
        });

        Q.state.on("change.score",this,"score");
      },

      score: function(score) {
        this.p.label = "score: " + score;
      }
    });

Now the above sprite will update itself whenever the score changes.

To change the score in `Q.state`, it's important to use the `set`, `inc`, or `dec` methods, for example:

    Q.state.set("score",50); // set the score to fifty
    Q.state.set({ score: 50, lives: 1 }); // alternative object syntax

    Q.state.inc("score",50); // add 50 to the score
    Q.state.dec("score",50); // remove fifty from the score

All of these calls will trigger both a "change.score" event and a more generic "change" event on `Q.state`

If you need to return a property, use `Q.state.get(prop)`, for example:

    Q.state.get("score"); // return the score

If you need more objects that behave like this, you can instantiate new instances of `Q.GameState`.
    
## Assets & Asset loading

Assets are an important part of any game, and Quintus provides a couple of easy ways to get your Art, Audio and Data assets loaded into the system. Once an asset is loaded, it's available by calling `Q.asset` with the name of the asset.

Quintus provides two main ways to load assets: `Q.load` and `Q.preload`. Both do the same thing (`Q.preload` actually uses `Q.load`) but have a little bit of a different philosophy.

The easiest way to load assets is to call `Q.load` with an array or hash of assets and pass a callback to be called once all are loaded. For example:

    Q.load([ "sprites.png", "sprites.json", "music.ogg" ], function() {
      // Start your game
    });

The callback won't be called until all the assets are loaded.

To help organize your assets, Quintus defines some default paths for where you should put your assets. Image assets are loaded from "images/" (nested under the main directory where your HTML file is located). Audio is loaded under "audio/" and anything else is loaded via Ajax from "data/". You can control these by passing in an options hash to the initial Quintus constructor method if you want to use different paths, for example to load everything from "http://cdn.yourgame.com/assets/":

  var Q = Quintus({ imagePath: "http://cdn.yourgame.com/assets/",
                    audioPath: "http://cdn.yourgame.com/assets/",
                    dataPath: "http://cdn.yourgame.com/assets/" });
                    
Quintus by default assumes you have both .mp3 and .ogg versions of any audio files and will load the appropriate one depending on what the browser supports. If you want to override this behavior you can adjust the supported formats by passing in a property called `audioSupported`. If the browser can't handle of any of the supported formats, no audio will be loaded.

If you want to accumulate a set of files to load before loading, you can use `Q.preload`. Call preload as many times as you like with object to be loaded and then one final time with a callback method to be called when all those files are ready. For example:

    Q.preload("sprites.png");
    Q.preload([ "music1.ogg", "music2.ogg" ]);
    
    Q.preload(function() {
      // Go time
    });

## Loading status

If you have a number of assets to load, it's probably a good idea to add in some sort of loading bar on the screen. Quintus doesn't have a loading bar built in, but you can pass a `progressCallback` to `Q.load` to achieve the necessary effect with a DOM element and a little bit of CSS if you like:

### HTML:

        <div id='loading'>
          <div id='loading_container'>
            Loading...
            <div id='loading_progress'></div>
          </div>
        </div>

### CSS:

        #loading {
          margin:50px auto;
          max-width:1024px;
          position:fixed;
          width:100%;
          height:100%;
          text-align:center;
        }

        #loading_container {
          position:relative;
          margin:0 auto;
          width:50%;
          height:20px;
          border:1px solid black;
          text-align:center;
          padding-top:10px;
        }

        #loading_progress {
          width:0%;
          background-color:red;
          position:absolute;
          height:30px;
          top:0px;
          left:0px;
          opacity:0.4;
        }

### Quintus

    Q.load([ "sprites.png", "sprites.json", "music.ogg" ], function() {
      // Start your game
    }, {
      progressCallback: function(loaded,total) {
        var element = document.getElemenyById("loading_progress");
        element.style.width = Math.floor(loaded/total*100) + "%";
      }
    });
    
    
## Chapter summary

This covers the basics of the core Quintus engine. It didn't cover the helper methods or the Math and Matrix manipulation methods as those are lower level and often you won't touch em when building a game, but if you'd like to know more please see the [annotated source code](../quintus/docs/quintus.html)

Onto sprites! [Working with Sprites](sprites.md)

