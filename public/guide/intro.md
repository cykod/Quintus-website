# Quintus Guide

## Warning: this guide refers to two unreleased features (update instead of step, stage.locate) that will get sorted out in the next release - until then just use `this._super(dt)` inside of `step` and don't use `stage.locate`

The Quintus engine is an HTML5 game engine designed to be modular and lightweight, with a concise JavaScript-friendly syntax. In lieu of trying to shoehorn a standard OOP-game engine structure into an HTML5 JavaScript engine, Quintus takes some cues from jQuery and provides plugins, events and a selector syntax. Instead of a deep single-inheritance-only model, Quintus provides a flexible component model in addition to traditional inheritance to make it easier to reuse functionality and share it across games and objects.

## Guide Breakdown

The goal of this guide is to provide an overview of the major components of the Quintus game engine. It's broken down into 7 chapters:

1. [Core Quintus Basics](core.md)
2. [Working with Sprites](sprites.md)
3. [Building Scenes and setting the Stage](scenes.md)
4. [Dealing with Input](input.md)
5. [Animations](animation.md)
6. [Getting noisy: playing sound](sound.md)
7. [The 2D Module](2d.md)

## History of Quintus

The initial version of Quintus was built over the course of writing [Professional HTML5 Mobile Game Development](http://www.amazon.com/gp/product/B0094P2TU6/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B0094P2TU6&linkCode=as2&tag=tun02-20), although the repo code has diverged a bit from the Engine built in the book, the main philosophy and technologies used have not changed, and reading the book will give you a fairly exhaustive understanding of the internals of the Quintus Engine.

## About this Guide

This guide was written January 2013 on vacation in Jamaica while under the influence of many Red Stripes - there may be a few typos and inconsistencies as well as the occasional random reference to Bob Marley. Rest assured those will get cleaned up over the coming weeks. 

## I could use your help

**If you'd like to help make this guide better, if you find any typos or problems in the document, just click on the "Found a TYPO" button at the bottom right of any page of the guide, then click on the sentence with a problem and suggest a fix.** If you have larger changes or contributions you'd like to make, you can [Fork the Repo](https://github.com/cykod/Quintus-website) for this site and edit the markdown for the guides in public/guide/.

## Let's get rolling

Start your dive into Quintus by reading: [Core Quintus Basics](core.md)


