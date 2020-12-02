# Outline

Turn based.
Grid Based.

Players plot all actions before they happen simultaneously.
    - Simultaneous movement is preferable for multi player games as it allows all players to move at the same time.
Players move sequentially taking turns.
    - sequential movement like chess is much easier to understand and visualize.


Actions are all planned before they take happen.

An engagement

Three ship resources:

- Speed
- Range
- Offense
- Defense

Speed

Position and movement is powerful.

The fleet with a speed greater than that of another fleet can force an engagement with that fleet. A faster ship can catch a ship of lower speed. If fleets have equal speed than neither fleet can force an engagement, but if both fleets are set for engagement then they can have an engagement.

Certain strategic positions are immobile. Thus an attack on these positions forces the holder of the position to engage.

The fleet with greater speed has the advantage of being able to choose where to engage. The attacker with the same speed can only engage strategic positions.

Range

Range is how far the offense of a fleet can reach. If the range of one fleet is greater than the range of the other it can attack without a response. If an fleet has greater range and speed it can engage without response.

Offense

Defense


## Technical

Calculation and Visualization layers should have a hard separation.

Action -> Animation


Visualization should read a series of actions an display that animation of that sequence.

Actual movement is on an infinite axis, this is then reduced to grid squares for the purpose of display.

### Buttons

States

- normal
- hover
- click

light up when hovered over, or have cross hatch pattern, draw a box around them, use the same design for all game buttons, can keep the same icon can simply adjust the background

### Selector

Same selector on screen around the object selected

### Portraits

Small picture for map
Large picture to make it cool

### Consistency

Consistently order components or divide into groups?


### Sub Screens

Technically everything is a GamePiece including buttons, should game pieces be considered Board Pieces?