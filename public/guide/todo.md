
# changes to quintus:

Make sure the Scenes module doesn't render Sprites that are in a container.

Finish switch for Sprites from frame to step

Switch scenees from step to Update(dt)

Make sure containers are invoked correctly with their children (set collision points and frame)

Add in stage.locate which takes in just a x,y and optional collision mask

Use the dot product to figure out the magnitude of the collision in the direction of -normal based on vx and vy of the two colliding objects.

JSON level loading support for stage

Use the hit detection grid in scenes to only render the sprites that are potentially visible (so draw doesn't get called with thousands of sprites)

