# Adding in animation

The Quintus `Anim` module adds in support for both frame based animation and tween based animation via two components: `animation` and `tween`. The first works by setting up sprites that work with sprite sheets to define animations (stuff like walk left, walk right, jump, etc) the second by animating properties of sprites via keyframes.

## Setting up animation sprites

Before you can add in frame animations to a Sprite, you need to create an animation sheet by calling `Q.animations` and passing in a name and the details about the different named animations.

Here's an example:

    var Q = Quintus().include("Sprites, Anim");
    
    Q.animations('player', {
      run_right: { frames: [7,6,5,4,3,2,1], rate: 1/15}, 
      run_left: { frames: [19,18,17,16,15], rate:1/15 },
      fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30, trigger: "fired" },
      fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30, trigger: "fired" },
      stand_right: { frames: [8], rate: 1/5 },
      stand_left: { frames: [20], rate: 1/5 },
      fall_right: { frames: [2], loop: false },
      fall_left: { frames: [14], loop: false }
    });

This will define an animation sprite called "player" and 8 different named animations to go along with it.

You'll notice there are a number of different options you can pass as details for each animation. The only required option is `frames`. The rest have reasonable defaults unless you need to override them.

* `frames`: an array of frame numbers that make up the animation   
* `rate`: frames per second, best expressed as a fraction
* `loop`: defaults to true, which plays the animation over and over. Set to false to have it play once
* `next`: the animation to play directly after this one (automatically sets loop to false)
* `trigger`: event to trigger when the animation is done - useful for doing something (like adding a bullet sprite) when the animation is done playing.

## Playing animations on sprites

To play an animation you set a "sprite" property on your Sprite with the name of the animation sheet ("player" in the example above), add the "animation" component and then call "play(name)" with the name of the animation to play.

All the animation component actually does is set the frame variable to the appropriate number at the appropriate time. For bitmap keyframe animations, however, this can be very powerful.

Here's an example:

    Q.Sprite.extend("Player", {
      init: function(p) {
        this._super(p,{
          sprite: "player",
          sheet: "player"
        });
        
        this.add("animation");
      }
    });
    
    var player = new Q.Player();
    
    player.play("fire_right");
    
The `play` method also takes a second parameter which is a priority number. The higher the priority the more important the animation. Combined with the fact that calling `play` with the same animation that is already playing has no effect means that you can have your step method be responsible for playing ongoing effects (like running, jumping and falling) and then have events such as firing or getting hit override the active animation by playing at a higher priority.

Here's the last player example fleshed out a little more:


    Q.Sprite.extend("Player", {
      init: function(p) {
        this._super(p,{
          sprite: "player",
          sheet: "player"
        });
        
        this.add("2d, platformerControls, animation");
        
        Q.input.on("fire");
        
        // Wait until the firing animation has played until
        // actually launching the bullet
        this.on("fired",this,"launchBullet");
      },
      
      fire: function() {
        // Play the fire animation at a higher priority
        if(this.p.direction > 0) {
          this.play("fire_right",1);
        } else {
          this.play("fire_left",1);
        }
      },
      
      launchBullet: function() {
        var bullet = new Q.Bullet({  ... });
        this.stage.insert(bullet);
      },
      
      step: function(dt) {
        if(this.p.vx > 0) {
          this.play("run_right");
        } else if(this.p.vx < 0) {
          this.play("run_left");
        } else {
          this.play("stand_" + this.p.direction > 0 ? "right" : "left");
        }
      }
    });
    
    
In the above example the step method tries to play a default moving/resting animation every frame, but in the case that the player presses the fire button, the fire animation is played at a priority of 1, which means it'll take precedence over the default priority of 0. Once the fire animation is done, it triggers the "fired" event and lets the step method's lower priority firing take back over.

## Playing tweened animations

For non-bitmap animations where you want parameters to change smoothly over a set period of time, you can use the `tween` component. This adds a method called animate to the Sprite which you can use to affect properties over time (much like the jQuery animate method)

For example, if you wanted to have a sprite that moved from the 0,0 to 500,500 while rotating a full 360 degrees, you could do the following:

    var sprite = new Q.Sprite({ asset: "image.png",
                                x:0, y:0, angle: 0 });
    sprite.add("tween");
    
    sprite.animate({ x: 500, y: 500, angle: 360 });
    
This will animate the sprite linearly over the course of 1 second. If you want more control over animations, the full method signature for animate is:

      function animate(properties,[duration,] [easing,] [options])
      
Where properties is a hash of properties for the end result (you can use set before hand if you need to set the initial state. Duration is a duration in seconds and easing is an easing function that takes in a value from 0 to 1 and returns a number from 0 to 1. Quintus has a few easing functions built-in (taken from [Tween.js](https://github.com/sole/tween.js/))

* `Q.Easing.Linear` - map linearly from 0 to 1
* `Q.Easing.Quadratic.In` - start slowly and accelerate
* `Q.Easing.Quadratic.Out` - start fast and slow down
* `Q.Easing.Quadratic.InOut` - start slow, accelerate, decelerate and end slow

The final options hash currently supports two options:

* delay - a delay in seconds before starting the animation
* callback - a callback to trigger when the animation is done

The component also adds two additional methods to the Sprite: `chain` and `stop`. `chain` works the exact same way as `animate`, except it calculates the delay automatically to start after the currently playing animation and `stop` stops all currently playing animations

## Chapter Summary

This chapter covered the two different animation mechanisms support by Quintus: keyframe and tweening.


Next Up: [Getting noisy: playing sound](sound.md)
