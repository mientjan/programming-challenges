# GAME OF LIFE
## RULES

• Any live cell with fewer than two live neighbours dies, as if caused by under-population.
• Any live cell with two or three live neighbours lives on to the next generation.
• Any live cell with more than three live neighbours dies, as if by overcrowding.
• Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


The initial pattern constitutes the seed of the system. The first generation is created by applying the above
rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment
at which this happens is sometimes called a tick (in other words, each generation is a pure function of the
preceding one). The rules continue to be applied repeatedly to create further generations.

TECHNICAL REQUIREMENTS
Any classes outside Main can not be modified (this includes Draw!)
WebWorkers are not allowed
Don't use Google for algorithms
~50% of initial cells have to be alive (e.g. Math.random() > 0.5))
Have fun!


## CHANGES
VERSION 5:

changed:
- added test 3 with 400 iterations
- collect and log all frame-timings at the end
- added ?test=x
- added ?log=true

VERSION 4:

changed:
- WIDTH/HEIGHT uppercase
- scope fix
- init fix

added:
- benchmark (with frame-logging flag)
- 2 tests (random from seed, and R-pentomino)

update:
index.html
/lib/ folder (for random seed)
Main.ts, the Draw class and all below

check/change:
Main.ts, Main class for current implementation:

if (a.isCellAlive(x, y))
{
    Draw.i().drawPixel(x, y);
}

remove your own console.time calls