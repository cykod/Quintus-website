# Building Scenes and setting the Stage

The Quintus scenes module, which requires the Sprites module, finally pulls together most of the interesting pieces of Quintus into a cohesive, usable package.

There are still a few important pieces left to discuss, such as input and sound, but the Scenes module contains a lot of the behavior and complexity that you'll build your game off of.

## Scenes

The Scenes module introduces two important objects into the mix: the Scene class and the Stage class. 

The Scene class is actually a quite simple class that doesn't provide a lot of functionality. It's however quite an important class for Quintus as it serves a single, important purpose: to let you build reusable scenes that can staged.

Scenes hold only two properties: a callback method for adding items to a stage and a hash of options that control the behavior of the stage. Think of scenes as instructions for how you might set up a stage.

To create a Scene you call `Q.scene` with a name and a callback method that adds items to a stage. You can optionally pass in a third parameter that will be a set of options that control some behaviors of the created scene.

Here's an example of a simple scene (don't worry about the stage insert command, it'll be explained next):

    Q.scene("level1",function(stage) {
      stage.insert(new Q.Ball());
    });
    
This simple scene, called "level1", does nothing more than add a sprite called Ball onto the stage.

## Staging a scene, intro

Once you have created a scene, your next task is to stage that scene, which clears out a stage for you and runs your scene function with that stage. To stage the scene you just created, you'd call:

     Q.stageScene("level1");
    
This will stage the scene on the default (index 0) stage and remove anything else on that stage.

## Stages

Stages have been mentioned a few times already, but what actually are they? Well, the easiest way to think of a stage is as a container for a bunch of sprites and methods for letting you the developer interact with those sprites and letting those sprites interact with each other.

You can have multiple stages active at once (in fact it's pretty common), but the main thing to note is that sprites from one stage will not interact with sprites from another stage. Each stage is independant. Sprites from different stages can listen for and trigger events on different stages and sprites in different stages, but for things like collision detection sprites in different stages won't see each other.

The default stage, stage 0, is most commonly used for the main gameplay. Higher level stages are most commonly used for things like HUD elements and UI screens. Higher numbered stages render on top of lower numbered stages, although by default all stages share the same rendering context (this is something that can be overriden however).

The stage class inherits from GameObject, which means that Stages can have components and listen for and trigger events themselves.

## Staging a scene, in depth

The most common way to create a new stage is to use the stageScene method, which creates a new empty stage and runs the Scene's stage function on it.

If you want a completely empty stage, you can also just call stageScene with an null parameter to indicate an empty scene:
   
    Q.stageScene(null);
    
This will stage an empty scene on the first stage.

The second parameter to stageScene can be used to stage a scene on a different stage:

    Q.stageScene("level1",1);
   
This will stage a scene on the second (index 1) stage, leaving anything on the first stage (index 0) alone.

The third parameter to `stageScene` allows you to pass a hash of additional options into the stage, offering some flexibility in creating scenes.

For example if you had a scene that showed a message on a label that you wanted to be able to control when you stage the scene you could do the following (this snippet pulled from the platformer example):

    Q.scene("endGame",function(stage) {
      var label = stage.insert(new Q.UI.Text({
        x: Q.width/2, 
        y: Q.height/2,
        label: stage.options.label
      }));
    });
   
    // Stage a scene on stage 1 and pass in a label
    Q.stageScene("endGame",1, { 
      label: "This is the label"
    }); 

## Getting a stage

To retrieve a stage object, you can call `Q.stage()` to return the current, active stage. Usually this is stage 0, but if you call `Q.stage()` from the `step` method of Sprite, it will return the stage that sprite is a member of.

You can also pass in the number of the stage you'd like to return if it's not the default or active one:

    Q.stage(); // returns the active stage
    Q.stage(0); // always returns stage 0
    Q.stage(1); // always return stage 1
    
`Q.stage()` might return an undefined object if that stage doesn't exist, so beware.

## Inserting objects into a stage

The main purpose of a stage is to add sprites to it. This is accomplished by passing a sprite to `Stage.insert`:

    var ball = stage.insert(new Q.Ball());
    
You'll note the insert method returns the sprite itself, so you can keep a reference to the sprite if you like in a single line.

You can also pass a second parameter to `Stage.insert` that represents the container sprite. This is most often used for UI elements, but if you have sprites that live in a nested hierarchy, you can use containers as well.

The most common use case (outside of nested UI elements) is when you have child sprites that need to layer visually on top of their parent. For example if your player's ship can have different guns, you might use child sprites to place the guns. 

Child sprites inherit all the transforms of their parent, but can still respond to collision events (although you'll want to be careful with those as the child sprites, if they have collisions, may detach from the parent)

For example:
  
    var car = stage.insert(new Q.Car());
    var wheel1 = stage.insert(new Q.Wheel(), car);
    
## Pausing and Unpausing a stage

Instances of the `Q.Stage` class have two methods for pausing and unpausing stages:

    // Pause the stage, Sprite will no longer be stepped
    // but will render each frame
    Q.stage().pause();  
    
    // Unpause the stage
    Q.stage().unpause();
  
These methods are useful when you want the game to continue to render but at the same time to pop up some screen of information (or a pause screen) to the player on a higher stage number.

## Searching the stage for sprites

To find objects at a specific location on the stage, you can call the `Stage.locate` method. This method takes an x and y location (note: these points are in stage coordinates, not canvas coordinates) and an optional `collisionMask` and returns the first element on the stage that is found at that coordinate.

For example:

    // Find any object that collides with the point 50,50
    var obj = Q.stage().locate(50,50);  
    
    // Find any enemies that collide with the point 50,50
    var obj2 = Q.stage().locate(50,50,Q.ENEMY_TYPE);
    
## Collision detection

The stage class is also responsible for discovering collisions. The primary way it does this is with the provided `Q.collide` method. This method takes in a Sprite, runs collisions checks on it, and then triggers events when it finds collisions.

By default, all sprites have the Q.SPRITE_DEFAULT and Q.SPRITE_ACTIVE types. In order to control collisions with other objects, you must add a property call `p.collisionMask` that indicates what types of other Sprites a sprite should collide with. If you don't set the `p.collisionMask` property a sprite will collide with all other sprites (but not the collisionLayer).

For example, you may want to separate out enemy sprites from player sprites and not have enemies collide with enemies and players with players. In this case you can set the types and collisionMasks of sprites from the available options in such a way as to prevent collisions:

      Q.SPRITE_NONE     = 0;
      Q.SPRITE_DEFAULT  = 1;
      Q.SPRITE_PARTICLE = 2;
      Q.SPRITE_ACTIVE   = 4;
      Q.SPRITE_FRIENDLY = 8;
      Q.SPRITE_ENEMY    = 16;
      Q.SPRITE_UI       = 32;
      Q.SPRITE_ALL   = 0xFFFF;

The Sprite it triggers events on is expected to take the collision information and move itself away from the collision. This is usually taken care of by the `2d` component, described in the next chapter, but if you want to not use the `2d` component or write your own reaction to collisions, you can do so by listening for the `hit` event as shown below:

    Q.sprite.extend("MySprite",{
      init: function() {
        // Listen for hit event and call the collision method
        this.on("hit",this,"collision");
      
      },
      
      collision: function(col) {
        // .. do anything custom you need to do ..
        
        // Move the sprite away from the collision
        this.p.x -= col.separate[0];
        this.p.y -= col.separate[1];
      },
      
      step: function(dt) {
        // Tell the stage to run collisions on this sprite
        this.stage.collide(this);
      }
    });
   
As mentioned above, it isn't necessary to do this if you use the `2d` component.

In addition to the `separate` property, the `hit` event will pass in a collision object that has a number of pieces of information about the collision:

    sprite.on("hit",function(col) {
      col.normalX; // normal of the collision, x direction
      col.normalY; // normal of the collision, y direction
      col.obj; // Object we collided with
      col.distance; // Distance we had to move to resolve the collision
      col.separate[0]; // normalX multiplied by distance
      col.separate[1]; // normalY multiplied by distance
    });

## Working with a Stages sprites

Instances of the Q.Stage class also have a number of methods you can invoke to work with the set of Sprites in the stage:

    // Call method name on every sprite in the stage
    Q.stage().invoke("methodName",arg1,arg2);
  
    // Return the first sprite for which method returns truthy
    var sprite = Q.stage().detect(method);
    
## Selecting objects from a stage

Stages suppport a jQuery-like selector syntax to make it easier to find objects in your game.

Like jQuery, when you have the Scenes module included the engine instance `Q` is actually a function that returns a selector.

The Quintus selector is currently fairly limited, but will eventually be expanded on. It supports two selection methods: class name and component. To select by class name, just use the name. To select by component, prefix the component name with a dot.

    var balls = Q("Ball"); // returns all instances of Q.Ball
    
    var two_d = Q(".2d"); // return all sprites with the 2d component

The selector will default to the active stage, but if you want to be explicit about which stage number to use, you can pass a second parameter indicating the stage number: 

    var balls = Q("Ball",0); // stage 0
    
    var two_d = Q(".2d", 1); // stage one.  
        
The selector syntax also has convenience methods to return the first, last or a specific element from the set (these return the actual Sprite, not a selector instance):

    var ball = Q("Ball").first();
    
    var ball2 = Q("Ball").last();
        
    var ball3 = Q("Ball").at(4);
    
Do note that any of these three methods will return null if the object doesn't exist at that index.

Is it ok to use selectors if you are worried about performance? The answer for the most part is "yes". Selectors actually work using pre-calculated lists that the Stage keeps up to date automatically. This means that the selector doesn't loop through all the sprites on the stage when you are looking for certain objects or components.  In fact, the extent of the damage done by using selectors is the creation of a single Q.StageSelector object, the actual array of items that is used is just a reference to the main list.

One other thing to note - unlike jQuery, the Quintus selector syntax is limited to a single class or component - you can't use a single selector string on multiple components (this is done primarily for performance reasons, as using multiple selections at once would require creating separate arrays to avoid selecting individual sprites twice) This is likely to change in the future as there are optimizations that can be done to avoid this.  

## Selector methods

As mentioned above, every time you call Q("selector") the engine returns an instance of the `Q.StageSelector` class.

Once you have a selector you can set properties on all the returned set of elements by calling one of the two forms of `set`:

    // Set y=50 on all Q.Ball's
    Q("Ball").set("y",50);

    // Set y=50 and vy=0 on all Q.Ball's on the active stage
    Q("Ball").set({ y: 50, vy: 0 });


This class provides a number of helpful methods for working with multiple object at a time. Many of these methods mirror methods that are available on the Q.Stage class. Here's some examples:

    // Return all instances of Q.Ball
    var balls = Q("Ball");
    
    // Trigger a "shine" event on each ball
    balls.trigger("shine"); 
    
    // Call the doSomething() method on each ball
    balls.invoke("doSomething"); 
    
    // If you need more complicated functionality, use each
    balls.each(function(ball) {
      if(ball.testSomething()) {
        ball.doSomething();
      }
    }); 
    
    // Finally, get rid of all the balls
    balls.destroy();
    
## Clearing stages
 
Sometimes you just need to clear out one or more stages. To do this you can use the `Q.clearStage(num)` and `Q.clearStages()` methods. the first clears a single stage while the latter clears all the stages.

## Chapter Summary

This chapter covered the details of how Sprites interact with each other on the Stage and how to create reusable scenes.

Next up: [Dealing with input](input.md)

