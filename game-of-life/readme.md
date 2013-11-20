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