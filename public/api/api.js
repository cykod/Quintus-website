YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Q.Class",
        "Q.Component",
        "Q.Evented",
        "Q.GameObject",
        "Q.GameState",
        "Q.InputSystem",
        "Q.Matrix2D",
        "Q.MovingSprite",
        "Q.Scene",
        "Q.Sprite",
        "Q.SpriteSheet",
        "Q.Stage",
        "Quintus",
        "Quintus.Input",
        "Quintus.Scenes",
        "Quintus.Sprites",
        "Quintus.TMX",
        "platformerControls",
        "stepControls"
    ],
    "modules": [
        "Quintus",
        "Quintus.Input",
        "Quintus.Scenes",
        "Quintus.Sprites"
    ],
    "allModules": [
        {
            "displayName": "Quintus",
            "name": "Quintus",
            "description": "Quintus HTML5 Game Engine \n\nThe code in `quintus.js` defines the base `Quintus()` method\nwhich create an instance of the engine. The basic engine doesn't\ndo a whole lot - it provides an architecture for extension, a\ngame loop, and a method for creating or binding to an exsiting\ncanvas context. The engine has dependencies on Underscore.js and jQuery,\nalthough the jQuery dependency will be removed in the future.\n\nMost of the game-specific functionality is in the \nvarious other modules:\n\n* `quintus_input.js` - `Input` module, which allows for user input via keyboard and touchscreen\n* `quintus_sprites.js` - `Sprites` module, which defines a basic `Q.Sprite` class along with spritesheet support in `Q.SpriteSheet`.\n* `quintus_scenes.js` - `Scenes` module. It defines the `Q.Scene` class, which allows creation of reusable scenes, and the `Q.Stage` class, which handles managing a number of sprites at once.\n* `quintus_anim.js` - `Anim` module, which adds in support for animations on sprites along with a `viewport` component to follow the player around and a `Q.Repeater` class that can create a repeating, scrolling background."
        },
        {
            "displayName": "Quintus.Input",
            "name": "Quintus.Input",
            "description": "Quintus HTML5 Game Engine - TMX Loader module\n\nModule responsible for loading Tiled TMX files"
        },
        {
            "displayName": "Quintus.Scenes",
            "name": "Quintus.Scenes",
            "description": "Quintus HTML5 Game Engine - Scenes Module\n\nThe code in `quintus_scenes.js` defines the `Quintus.Scenes` module, which\nadds in support for Scenes and Stages into Quintus. \n\nDepends on the `Quintus.Sprite` module.\n\nScenes let you create reusable definitions for setting up levels and screens.\n\nStages are the primary container object in Quintus, handling Sprite management,\nstepping, rendering and collision detection."
        },
        {
            "displayName": "Quintus.Sprites",
            "name": "Quintus.Sprites",
            "description": "Quintus HTML5 Game Engine - Sprites Module\n\nThe code in `quintus_sprites.js` defines the `Quintus.Sprites` module, which\nadd support for sprite sheets and the base sprite class.\n\nMost games will include at a minimum `Quintus.Sprites` and `Quintus.Scenes`"
        }
    ]
} };
});