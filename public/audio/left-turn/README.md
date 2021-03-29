# About These Files

These sounds were recorded for this project, see the LICENSE.txt file for terms of use. The patch used is from the
Arturia V Collection, and is a Synthi patch called "Shaker".

Each filename corresponds to the pitch of the note. The individual sounds are meant to be sped up and slowed down to
imulate a fuller range of pitches.

The 16-step sequence of notes used is (0s for unplayed, 1 for played):

1 1 0 1 0 1 1 1 1 1 0 1 0 1 1 0

## Timing

For the purposes of coordinating the timing of sounds and animations, here is a
breakdown of the duration of every file used for this "sampler":

| Filename | Duration     |
| -------- | ------------ |
| C6.wav   | 1.973625 sec |

If you need to regenerate this timing data, on OS X you can use a command like:

```find public/audio/left-turn -name \*.wav -exec afinfo -b {} \;```
