# Getting Noisy: playing sound

Quintus has some basic sound support available via the `Audio` module. This module needs some work and doesn't currently support the Web Audio API (it will at some point)

To enable Audio support, add in the `Audio` module and call `Q.enableSound`:

    var Q  = Quintus().include("Audio")
                      .enableSound();
                      
This will turn on either the desktop audio support or the mobile audio support. On desktop everything will behave as you might expect: once you load an audio resource via the `Q.load` or `Q.preload` commands you can play them when you like.

On mobile things are a little more tricky and audio files will **not** be loaded or played normally. To enable audio on mobile you'll need to compile together an audio sprite which consists of a single audio file separated by silence and a JSON file describing the position of the sounds. Please see the quintus_audio.js file for more details on how to set this up.

## Loading audio assets

As you saw in the first chapter, Quintus has built in support for loading audio files. It is recommended you provide at least two formats of audio for desktop browsers: .mp3 and .ogg, which covers all HTML5 compatible browsers. Mobile browsers require either using sound sprites (Android) or the Web Audio API (iOS 6+ - unfortunately not yet integrated into Quintus, but coming soon). Sound sprites are supported by the engine, but really, there such a horrible thing that I'm not even going to cover them in the documentation.

When you set up the engine, however, you can control what formats of audio you want to provide by passing in an audioSupport option. For example:

    var Q = Quintus({ audioSupported: [ 'wav','mp3' ] });
    
This would support only .wav and .mp3 and prefer to load the .wav file.

When you call `load` or `preload` you only need to provide a single format and Quintus will load the first playable format. For example:

    Q.load([ "fire.mp3" ], function() {
      ...
    });
    
If audioSupported is set to [ 'wav', 'mp3' ], the engine will assume you've provided both a fire.wav and a fire.mp3 sound file and will see if the browser supports .wav and load that, if not it will see if the browser supports .mp3 and load that. Otherwise no sound will be loaded.

## Playing sounds

To play a loaded sound asset, you simply must call `Q.play`:

    Q.play('fire.mp3');
    
Note the name of the asset will be the name you provided to `Q.load`, so even if the .wav file is loaded, you should pass the .mp3 version to play.

Play also take a second parameter which is an optional debounce time in seconds. This will prevent the sound from being played again for that period of time.

## Chapter Summary

This Chapter talked (briefly) about sound and audio.

Next Up: [The 2D Module](2d.md)

