# The Use of Sounds in the Coding Environment

## Tuning Diagram

Sounds like movement and turning are adjusted to match a pitch that corresponds to their position in the coding
environment. This is based loosely on the [Tonnetz](https://en.wikipedia.org/wiki/Tonnetz) system, where each row and
column are offset by a consistent number of pitches.

The following is a diagram of the pitches for both "in bounds" cells (columns A-Q, rows 1-9) and a buffer
zone of "out of bounds" cells bordering those.

|       |  A -3 |  A -2 |  A -1 |     A |     B |     C |     D |     E |     F |     G |     H |     I |     J |     K |     L |     M |     N |     O |     P |     Q |  Q +1 |  Q +2 |  Q +3 |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
|    -2 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |    G5 |    D5 |    A5 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |    G5 |    D5 |    A5 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |
|    -1 |    C5 |    G5 |    D5 |    A5 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |    G5 |    D5 |    A5 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |
|     0 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |    G5 |    D5 |    A5 |    E5 |    B5 |   F#5 |   C#5 |   G#5 |   D#5 |   A#5 |    F5 |    C5 |    G5 |    D5 |    A5 |    E5 |
|     1 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |    G4 |    D4 |    A4 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |    G4 |    D4 |    A4 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |
|     2 |    C4 |    G4 |    D4 |    A4 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |    G4 |    D4 |    A4 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |
|     3 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |    G4 |    D4 |    A4 |    E4 |    B4 |   F#4 |   C#4 |   G#4 |   D#4 |   A#4 |    F4 |    C4 |    G4 |    D4 |    A4 |    E4 |
|     4 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |    G3 |    D3 |    A3 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |    G3 |    D3 |    A3 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |
|     5 |    C3 |    G3 |    D3 |    A3 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |    G3 |    D3 |    A3 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |
|     6 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |    G3 |    D3 |    A3 |    E3 |    B3 |   F#3 |   C#3 |   G#3 |   D#3 |   A#3 |    F3 |    C3 |    G3 |    D3 |    A3 |    E3 |
|     7 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |    G2 |    D2 |    A2 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |    G2 |    D2 |    A2 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |
|     8 |    C2 |    G2 |    D2 |    A2 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |    G2 |    D2 |    A2 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |
|     9 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |    G2 |    D2 |    A2 |    E2 |    B2 |   F#2 |   C#2 |   G#2 |   D#2 |   A#2 |    F2 |    C2 |    G2 |    D2 |    A2 |    E2 |
|    10 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |    G1 |    D1 |    A1 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |    G1 |    D1 |    A1 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |
|    11 |    C1 |    G1 |    D1 |    A1 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |    G1 |    D1 |    A1 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |
|    12 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |    G1 |    D1 |    A1 |    E1 |    B1 |   F#1 |   C#1 |   G#1 |   D#1 |   A#1 |    F1 |    C1 |    G1 |    D1 |    A1 |    E1 |
