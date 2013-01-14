
# Working with Sprites

Sprites are the building block for a large amount of what you'll do in Quintus, but they are are pretty simple creatures in and of themselves. A lot of the magic happens when you combine sprites with stages, but we'll wait until the next chapter to cover those.

To use sprites in your game, make sure you include the `Sprites` module.

The base `Q.Sprite` class inherits from `Q.GameObject`, which means sprites come pre-loaded with support for events and components. In addition they add three primary overloadable methods: `init(p,defaults)`, `step(dt)` and `draw(ctx)`.

## Initializing sprites

The first overloadable method is the base constructor, `init(p,defaults)`. It's primary duties are setting the sprite's properties, stored in the `p` object (whenver you see a varible named, `p`, think "properties").

All a Sprites mutable properties are generally stored in the `p` object on the sprite. The reason for this is to first separate a sprite's state from its methods and secondly to make it easy to know what properties need to be serialized or sent over the wire for a multi-player game. For performance reasons, the properties on the `p` object can be get an set directly and don't need to be set with getters and setters. 

The default constructor takes two parameters, an initial set of properties `p` and a default set of properties `defaults` that are used if the corresponding property is unset on `p`. While this might seem a little surperfluous, the reason for the defaults hash is that it makes it easy to set default properties when creating a subclass of `Q.Sprite`.

For example, let's say you had a Player sprite that you want to set some defaults on:

    Q.Sprite.extend("Player",{
      init: function(p) {
        this._super(p, {
            hitPoints: 10,
            damage: 5,
            x: 5,
            y: 1
        });
    }); 

Whenever you create a player now it will have those defaults pre-set:

     var player1 = new Q.Player();
     
     console.log(player1.hitPoints); // 10
     console.log(player1.damage); // 5
   
However, you can easily create instances that have different values as well:

     var player2 = new Q.Player({ hitPoints: 20 });
     
     console.log(player1.hitPoints); // 20
     console.log(player1.damage); // Still 5
   
## Core sprite properties

Sprites have a few core properties that are used for rendering and collision detection (Collision detection is mostly the purview of the Scenes module, which is described in the next chapter).

The core properties a sprite has are (some of these only make sense when Sprites are used in Scenes, but that is how you'll use them most often anyway, so those properties are included here as well):

* `p.x` - the x location of the center of the sprite
* `p.y` - the y location of the center of the sprite
* `p.z` - the stacking order, higher in front, of the sprite (used by the Scenes module)
* `p.w` - the width of the sprite
* `p.h` - the height of the sprite
* `p.cx` - the distance from the left of the sprite to its center
* `p.cy` - the distance from the top of the sprite to its center  
* `p.scale` - the scaling multiplier to grow or shrink the sprite. If not set, it defaults to 1.
* `p.angle` - the angle of rotation in degrees of the sprite. If not set it defaults to 0
* `p.type` - the type of Sprite, a bit-mask used for collision detection, defaults to Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE
* `p.points` - an array of points in the form [[x0,y1],[x1,y1]..] that define convex collision shape used for collision detection (more on this in the next chapter). If not set defaults to the square bounding box.
* `p.asset` - the name of the asset used to render a static image for the sprite (see the next couple of sections)
* `p.sheet` - use a sprite sheet instead of an asset to render (also, see the next couple of sections)
* `p.frame` - if using a sprite sheet, this is the frame in the sheet to use.

You can set all these properties directly (i.e. you don't need to use a setter method), but you can also use `Sprite.set({ ... })` to set multiple properties at once (remember this will create an object that will need to be garbage collected however, so use appropriately)

Sprites recalculate their own translation matrices and bounding boxes each frame if necessary.
   
## Using sprites and image assets

If you add an asset property before you call the predefined `init` method, the Sprite class will use that asset to calculate its width and height, stored in the `w` and `h` properties and the center, stored in the `cx` and `cy` properties (if you can tell, I'm not a huge fan of typing) 

That asset will then be used to render the spite on the screen. For example, for a full example that draws the penguin.png asset:

   var Q = Quintus().include("Sprites").setup();

   Q.Sprite.extend("Penguin", {
     init: function(p) {
       this._super({
         asset: "penguin.png"
       });
     }
   });
   
   // Make sure penguin.pn is loaded
   Q.load("penguin.png",function() {
      var penguin = new Q.Penguin();
      
      Q.gameLoop(function(dt) {
         Q.clear();
         Q.step(dt);
         Q.render(Q.ctx);
      });
   });

## Defining Spritesheets

The Sprites module also includes the Spritesheet class. This allows you to define sprite sheets that have a large number of images in a single image asset and define a number of frames for each image.

To tell Quintus about a sprite sheet, you call the `Q.sheet` method with a name, an asset name, and a hash of options that define the frames of the sheet.

For example, if you had an asset called player.png that had a 40 frames for the player character, each 40 pixels wide by 40 pixels tall, you could tell the engine about this sheet like so:

    Q.sheet("player",
            "player.png",
            {
              tilew: 40,  // Each tile is 40 pixels wide
              tileh: 40,  // and 40 pixels tall
              sx: 0,   // start the sprites at x=0
              sy: 0    // and y=0
             });
             
(You could actually leave the sx and sy parameters out as they default to 0,0)

## Compiling sprite sheets

Manually entering the data for sprite sheets is error prone, so a better option is to use a tool to generate the sheets an accompanying data for you. Quintus will eventually support a variety of different input formats, but right now it expects a JSON file with the following input format (it's the same as `Q.sheet` above):

    { sprite1name: {
          tilew: 40,
          tileh: 40,
          sx: 0,
          sy: 0,
          w: 160,
          h: 80
      },
      sprite2name: {
          tilew: 40,
          tileh: 40,
          sx: 80,
          sy: 0,
          w: 160,
          h: 80
      }

If you have a single JSON data asset with a number of sprites defined as above, you can generate all the necessary sprite sheets by loading the image and data asset and then calling compile sheets:

    Q.load(["sprites.png","sprites.json"], function() {
      
      // this will create the sprite sheets sprite1name and sprite2name
      Q.compileSheets("sprites.png","sprites.json");
    }

As mentioned, Quintus doesn't currently have a method for generating sprite sheets in the main repository, but you can install github.com/cykod/Spriter to generate a sprites.png and sprites.json from a directory of image assets:

    # will generate a sprites.png and sprites.json
    $ spriter assets/
    
The images in the asset directory should be of the form NAMEXXX.png (or .jpg)

    assets/spriteOne01.png
    assets/spriteOne02.png
    ...
    assets/spriteTwo01.png
    assets/spriteTwo02.png
    ...
    
    ...
    
It will generate sprite sheets with names `spriteOne` and `spriteTwo` in a sprites.json file and a single image sprites.png.


## Using Spritesheets

The most common way to use sprite sheets is to define a `sheet` property on a Sprite instead of a `asset` property. If you also set the `frame` property to a number the sprite will use that frame number to render itself.

To go back to the penguin, you could set up a sprite that uses the Sprite sheet "player" and have it use the 8th frame (index 7) that was just defined by:

    Q.Sprite.extend("Penguin", {
         init: function(p) {
           this._super({
             sheet: "player",
             frame: 7
           });
         }
       });

Oftentimes you'll let the frame be controlled by the `animation` component, described in a later chapter, which is used for defining named animations from a set of frames (i.e. 'walk', 'run', etc)

Assigning a `sheet` property will set the width, height and center of the sprite in the same way that setting an asset does.

If you want to render a sheet manually (i.e. let's say your are creating a sprite that layers a number of different images on top of itself), you can also grab the sheet and tell it to draw yourself:

    Q.sheet("spriteOne").draw(ctx, x, y, frameNum);

## Overriding the draw method

If you want to have some control over the rendering of your sprite, you can overload the `draw` method. There is also a method called `render` which does a number of setup and teardown steps before calling draw that you can overload if you need more fine-tuned control over the drawing process, but the majority of the time overriding draw will get you where you need to be.

By the time the canvas rendering context reaches draw, the canvas transformation matrix has already been set up for you so that all you need to do is render your object centered at 0,0 with a width of `p.w` and a height of `p.h`. 

Regardless of the position, rotation or scale of the object, if you render it centered at 0,0 with it's width and height, the object will render on the screen correctly. 

One important note: Quintus assumes when you create a Sprite the center of the will be the x and y location specified and the sprite will rotate around this point. To this end it will calculate `cx` and `cy` properties based on the `w` and `h` properties in the `init` constructor. If you change an object's `w` or `h` after the fact, you'll also need to manually update the `cx` and `cy` properties if you want the sprite to continue to rotate around its center.

To see this in action, imagine you wanted to create a "Square" sprite that renders a filled square of a certain color. You could create the sprite as follows:

    Q.Sprite.extend("Square",{
      init: function(p) {
        this._super(p,{
          color: "red",
          width: 50,
          height: 50
        });
      },
      
      draw: function(ctx) {
        ctx.fillStyle = this.p.color;
        // Draw a filled rectangle centered at
        // 0,0 (i.e. from -w/2,-h2 to w/2, h/2
        ctx.fillRect(-this.p.cx,
                     -this.p.cy,
                     this.p.w,
                     this.p.h);
      
      }
    });

You can now position, rotate and scale this sprite however you would like and it will render correctly as the `render` method will setup of the transformation matrix correctly before calling `draw`.


## Step

The last methhod that you'll often overload when working with sprites is the step method. This method is called each frame for each Sprite and it's job is to update the sprites properties based on any behaviors the sprite should take.

This means stuff like updating position for player characters based on user input or updating position of enemies based on their AI.

The step method is called by the `update(dt)` method each frame. Much like `draw` and `render` you don't usually need to override the `update` method as this method takes care of triggering events and invoking frame on each of a Sprite's child. 

The default implementation of update looks as follows:

     update: function(dt) {
      this.trigger('prestep',dt);
      if(this.step) { this.step(dt); }
      this.trigger('step',dt);
      this.refreshMatrix();
      Q._invoke(this.children,"frame",dt);
    }
    
All frame does by default is trigger two events `prestep` and `step`, refresh the Sprites transformation matrix (used for drawing and collision detection) and then call update on any children the sprite might have.

If you need to override your sprite's `update` method, you can do so, but make sure you trigger the `step` and `prestep` events as components rely on these to add in additional behaviors.

## A complete example with sprites

With only the Sprites module and not the Scenes or Input module, the type of examples you can make are limited, but let's show a simple, complete example of a ball that follows a parabolic arc (a similar example is in examples/ball for your perusal as well) This example will run it's own mini game loop with a single sprite (you'll normally let the Scenes module control the game loop):

    var Q = Quintus().include("Sprites").setup();
    
    Q.Sprite.extend("Ball",{
      init:function(p) {
        this._super(p,{
          asset: "ball.png",
          x: 0, 
          y: 300,
          vx: 50,
          vy: -400
        }); 
      },
     
      step: function(dt) {
        this.p.vy += dt * 9.8;
        
        this.p.x += this.p.vx * dt;
        this.p.y += this.p.vy * dt;
      }
    });
    
    Q.load(["ball.png"],function() {
      var ball = new Q.Ball();
      Q.gameLoop(function(dt) {
        ball.update(dt);
        Q.clear();
        ball.render(Q.ctx);
      });
    });
 
 This example creates a simple Ball sprite that moves linearly left to right across the board. It flies up with an initial negative velocity but eventually falls back down to earth because of a positive vertical acceleration.
 
To run the example, the ball.png sprite is loaded and then a scustom game loop that calls frame and render on the single ball sprite is run.

## Chapter Summary

This chapter covered the basics of using and extending Sprites. The next chapter will talk about how many sprites can work together in a Stage with the Scenes module.

Next up:  [ Building Scenes and setting the Stage](scenes.md)
