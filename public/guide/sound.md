# Getting Noisy: playing sound

Quintus has some basic sound support available via the `Audio` module. 

To enable Audio support, add in the `Audio` module and call `Q.enableSound`:

    var Q  = Quintus().include("Audio")
                      .enableSound();
                      
This will turn on either the Web Audio support or the HTML5 Audio Support, depending on the browser. On desktop everything will behave as you might expect: once you load an audio resource via the `Q.load` or `Q.preload` commands you can play them when you like. On mobile, Audio will work fine on iOS 6 after the first touch, but Android, which doesn't yet support Web Audio is out of luck. HTML5 Audio support on Android is poor.

## Loading audio assets

As you saw in the first chapter, Quintus has built in support for loading audio files. It is recommended you provide at least two formats of audio for desktop browsers: .mp3 and .ogg, which covers all HTML5 compatible browsers. Quintus has two sound engines: Web Audio and HTML5 Audio. It will use Web Audio if available and fall back to HTML5 Audio if not. iOS 6+ support Web Audio using MP3's, but Android unfortunately does not yet.

When you set up the engine, however, you can control what formats of audio you want to provide by passing in an audioSupport option. For example:

    var Q = Quintus({ audioSupported: [ 'wav','mp3' ] });
    
This would support only .wav and .mp3 and prefer to load the .wav file.

**Important note: You must call `Q.enabledSound()` before loading your first audio asset, as it needs to determine the appropriate loading mechansim (Ajax for Web Audio, Audio tag for HTML5 Audio).**

When you call `load` or `preload` you only need to provide a single format and Quintus will load the first playable format. For example:

    Q.load([ "fire.mp3" ], function() {
      ...
    });
    
If audioSupported is set to [ 'wav', 'mp3' ], the engine will assume you've provided both a fire.wav and a fire.mp3 sound file and will see if the browser supports .wav and load that, if not it will see if the browser supports .mp3 and load that. Otherwise no sound will be loaded.

## Playing sounds

To play a loaded sound asset, you simply must call `Q.audio.play` with the name of the sound:

    Q.audio.play('fire.mp3');
    
Note the name of the asset will be the name you provided to `Q.load`, so even if the .wav file is loaded, you should pass the .mp3 version to play.

Play also take a second parameter which is an optional debounce time in seconds. This will prevent the sound from being played again for that period of time.

## Looping sounds

To loop a sound, call `play` with the loop option set to true:

    Q.audio.play('music.mp3',{ loop: true });

This sound will play in a loop until you stop it.

## Stopping sounds

To stop all sounds, call `Q.audio.stop()` with no arguments:

    Q.audio.stop(); // Everything will stop playing

To stop a single sound, pass the name of the sound in to stop:

    Q.audio.stop("music.mp3");

## Chapter Summary

This Chapter talked (briefly) about sound and audio.

Next Up: [The 2D Module](2d.md)

