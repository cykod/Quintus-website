# Input in Quintus

What fun is a game that you can't interact with? Not much. For this reason the two Quintus user input modules make it easy to capture and gather user input for your game.

The two modules are `Quintus.Input`, for button input (pressing up, down left, right, space, fire, etc.) and `Quintus.Touch` for touch input, which consists of clicking on specific Sprites on the page and tracking drag and release events. (The Touch module also handles mouse events).

Both of these modules abstract away from the details of input and provide an easy way to keep a consistent control scheme on both desktop and mobile devices.

## Capturing Default Button input

As mentioned, the `Quintus.Input` module is responsible for capturing button input. On the desktop this means listening for keyboard input while on touch screen devices Quintus supports drawing onscreen buttons.

While it supports a fair amount of configuration, to help you get started quickly, the Input module provides a helper function called `controls()` that gives you some reasonable defaults:

    var Q = Quintus().include("Input")
                     .setup()
                     .controls();
                     
This method will set up default input controls for the keyboard and add buttons for left, right and a and b for touch devices on screen if you are using the Scenes module.

Note: the order here is important - you must call `setup()` before `controls()` so that the controls have an element to bind events to and a size to calculate from.

The `controls` method takes in a single parameter which, if set to true, will use a 4-way joypad on the left side of the screen instead of left and right buttons. Turn this on if you need 4-way controls on mobile.

    // Replace left and right buttons with a 4-way joypad
    var Q = Quintus().include("Input")
                     .controls(true);
                     
## Accessing button input

Quintus provides a translation from key and touch input into named inputs. This way multiple input mechanisms (such as keyboard and touch) both map to the same game input, making it easier to build your game without worrying about the specific input mechanism used.

The default controls map to 6 inputs:

* up - when the up arrow is pressed or the joy pad moved up
* down - down arrow or joypad down
* left - left arrow, left on-screen button or joypad left
* right - right arrow, right on-screen button or joypad right
* fire - space or z key pressed or button "a" pressed on-screen
* action - x key pressed or button "b" pressed on-screen  

The easiest way to check for the state of a button is by looking at the `Q.inputs` hash and checking whether the named button is true. For example in your sprite step method, you could check if the `action` key has been pressed with:

    if(Q.inputs['action']) {
      // do something
    }
    
This method of listening for input is referred to as polling and it's the easiest way to check for the current state of a button. It's most commonly used for movement (i.e. move left whenever the left arrow is held down)
    
## Listening for input events

If you want to be notified the moment when a key is pressed, you can also bind to events on the `Q.input` object. Please note, `Q.input` represents the input subsystem, while `Q.inputs` (plural) is the current state of inputs.

You can bind to both `action` and `actionUp` events. For example if you have a player character, you might bind to the `fire` event to tell the player to fire their weapon:


    Q.Sprite.extend("Player",{
      init: function(p) {
        this._super(p);
        
        Q.input.on("fire",this,"fireWeapon");
      },
      
      fireWeapon: function() {
        // Do something
      }
    });
    
The only caveat here is that because the `Q.input` is a global variable, you should make sure to call `player.destroy()` whenever you get rid of a player object to unbind unnecessary events. As Scenes do not automatically destroy all their sprites when they are destroyed, you could do the following:

    Q.scene("testerScene",function(stage) {
        var player = new Q.Player();

        stage.on("destroy",function() {
            player.destroy();
            // or you can call player.unbind() directly.
        });
    });

## Customizing the keyboard mapping

If you need more or different controls than just the defaults, you can manually set up the keyboard inputs by skipping the call to `Q.controls` and telling the input subsystem how to configure itself manually. You can do this with a call to `Q.input.keyboardControls({ .. key bindings .. })`

For key bindings you can map either a key name from KEY\_NAMES (see the top of quintus\_input.js for these) or directly from a key code to an action name. For example if you just wanted left and right you could write:

    var Q = Quintus().include("Input").setup();
    
    Q.input.keyboardControls({
      LEFT: "goLeft",
      RIGHT: "goRight"
    });
    
This would create two buttons called "goLeft" and "goRight" instead of the standard "left" and "right".

## Customizing the on-screen buttons

To control the on-screen buttons, you can use the `Q.input.touchControls(options)` method. There are a number of configuration options, but the most important ones are what buttons should show up. This is controlled via the `controls` option. It takes an array of arrays where each array is an action and the text to display. The default controls would be set up as follows: 

    var Q = Quintus().include("Input").setup();
  
    Q.input.touchControls({
      controls:  [ ['left','<' ],
                   ['right','>' ],
                   [],
                   ['action','b'],
                   ['fire', 'a' ]]
    });
    
  
You can pass in an empty array `[]` to indicate an empty spot. The buttons are sized to go all the way across the screen, so if you wanted smaller buttons you should use more empty arrays.

If you wanted to only have a left button on the left and a right button on the right (but leave the buttons 1/5th of the size of the page, you could write:


    var Q = Quintus().include("Input").setup();
  
    Q.input.touchControls({
      controls:  [ ['left','<' ],
                   [],
                   [],
                   [],
                   ['right','>' ]]
    });
    
## Manually adding in the joypad

If you want a d-pad style control that allows 4-way movement with an onscreen control, you can use the joypad.

It is activated by calling `Q.input.joypadControls(options)`:

    var Q = Quintus().include("Input");
    
    Q.input.joypadControls();
    
You can control the area where the joypad is active (this defaults to 1/2 the size of the game) as well as how big it should be and how far a user has to move to trigger action events.

Please see the defaults that are set up in quintus_input.js for the configuration options on the joypad.

## Touch controls

In addition to the Input module, you can use the Touch module to allow direct manipulation of Sprites onscreen.

To add touch controls to your game, call the `Q.touch()` after including the Sprites and Touch module:

    var Q = Quintus().include("Sprites,Touch")
                     .setup()
                     .touch();
                     
The touch method takes two parameters: the types of Sprites to turn on touch events for and an array of stages to search for sprites. By default only Q.SPRITE\_UI sprites (from the UI module) are enabled for touch, but if you want to enable others (or Q.SPRITE\_ALL to have all sprites affected) you can do so.

Sprites that have touch enabled will receive three events when they are manipulated onscreen: `touch`, `drag` and `touchEnd`. Touch events will only trigger on a single Sprite per touch, so users can interact with only one element at a time per finger.
  
The system also supports multitouch, so you may have two elements being dragged at the same time:

The data that is available in the touch event object is as follows:

* x: x location of the touch
* y: y location of the touch
* origX: original x location of the object
* origY: original y location of the object
* identifier: a number identifying the touch
* obj: the object being touched
* stage: the stage containing the object

In addition, drag events will add in two parameters to indicate how far the touch is moved:

* dx: distance touch has moved in the x direction
* dy: distance touch has moved in the y direction

This makes it easy to drag objects by simply updating their position on drag to be their original location + dx,dy on drag:

    Q.Sprite.extend("DraggableObject", {
      init: function() {
        this.on("drag");
      },
      
      drag: function(touch) {
        this.p.x = touch.origX + touch.dx;
        this.p.y = touch.origY + touch.dy;
      }
    });
    
## Control components

The `Q.input` module also includes two components, `platformerControls` and `stepControls` that take some of the hassle out of writing player controls. The first adds in some basic 2D platformer behavior to the player while the second moves the player around the stage in set increments.

You'll learn more about these components in the chapter on the 2D module.

## Chapter Summary

This chapter covered the basics of the two modules in Quintus dedicated to input `Input` and `Touch`.


Next up: [Adding in Animations](animation.md)
