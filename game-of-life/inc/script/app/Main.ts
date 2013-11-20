///<reference path="../lib/definitions.d.ts" />

/**** GAME OF LIFE
 *
 ** RULES
 * • Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * • Any live cell with two or three live neighbours lives on to the next generation.
 * • Any live cell with more than three live neighbours dies, as if by overcrowding.
 * • Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * The initial pattern constitutes the seed of the system. The first generation is created by applying the above
 * rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment
 * at which this happens is sometimes called a tick (in other words, each generation is a pure function of the
 * preceding one). The rules continue to be applied repeatedly to create further generations.
 *
 ** TECHNICAL REQUIREMENTS
 * Any classes outside Main can not be modified (this includes Draw!)
 * WebWorkers are not allowed
 * Don't use Google for algorithms
 * ~50% of initial cells have to be alive (e.g. Math.random() > 0.5))
 * Have fun!
 *
 ****/

class Main
{
	constructor()
    {
        var a = Draw.i();

	    this.init();

        a.run(() =>
        {
	        // fix scope
	        this.next();
        });
	}

	// initialize your app here
    public init():void
    {
	    var a = Draw.i();

        //example
	    var alive:bool;

	    for (var y = 0; y < Draw.HEIGHT; y++)
	    {
		    for (var x = 0; x < Draw.WIDTH; x++)
		    {
			    if (a.isCellAlive(x, y))
			    {
                    Draw.i().drawPixel(x, y);
			    }
		    }
	    }
    }

	// update your app here
    public next():void
    {
	    for (var y = 0; y < Draw.HEIGHT; y++)
	    {
		    for (var x = 0; x < Draw.WIDTH; x++)
		    {
			    if (Math.random() > 0.9)
			    {
				    if (Math.random() > 0.5)
				    {
					    Draw.i().drawPixel(x, y);
				    }
				    else
				    {
					    Draw.i().clearPixel(x, y);
				    }
			    }
		    }
	    }
    }
}

class Draw {
	private static _instance:Draw = null;
	private el:HTMLCanvasElement;
	private ctx:CanvasRenderingContext2D;

	public static WIDTH:number = 1200;
	public static HEIGHT:number = 600;

	// 1 = Random
	// 2 = R-pentomino
	// 3 = Random with short timespan
	public static TEST:number = 1;

	public static LOG:bool = false;

	public tick:Function;

	private imageData:ImageData;

	private _centerX:number;
	private _centerY:number;
	private _numIterations:number;
	private _currentIteration:number = 0;

	private _summedDuration:number = 0;
	private _durations:number[] = [];
	private _min:number = Number.MAX_VALUE;
	private _max:number = 0;

	constructor() {
		if(Draw._instance){
			throw new Error("Error: Instantiation failed: Use Draw.i() instead of new.");
		}
		Draw._instance = this;

		if (this.getQueryParam('test'))
		{
			Draw.TEST = parseInt(this.getQueryParam('test'), 10);
		}
		if (this.getQueryParam('log'))
		{
			Draw.LOG = this.getQueryParam('log') == '1' || this.getQueryParam('log') == 'true' || this.getQueryParam('log') == 'on';
		}

		this.init();
	}

	private getQueryParam(key:string):string
	{
		return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,""])[1].replace(/\+/g, '%20')) || null;
	}

	private init():void
	{
		this.el = $('canvas')[0];
		this.ctx = this.el.getContext('2d');
		this.el.width = Draw.WIDTH;
		this.el.height = Draw.HEIGHT;
		this.ctx.fillStyle = '#000000';

		this.ctx.fillRect(0, 0, Draw.WIDTH, Draw.HEIGHT);
		this.imageData = this.ctx.getImageData(0, 0, Draw.WIDTH, Draw.HEIGHT);


		this._centerX = Math.floor(Draw.WIDTH / 2);
		this._centerY = Math.floor(Draw.HEIGHT / 2);

		this._numIterations = -1;
		if (Draw.TEST == 1)
		{
			Math.seedrandom('97f32a5bb3fea3a2f78112b96a1e831d845d3bac');
			this._numIterations = 1500;
		}
		else if (Draw.TEST == 2)
		{
			Math.seedrandom('12b96a1e831d845d3bac97f32a5bb3fea3a2f781');
			this._numIterations = 1104;
		}
		else if (Draw.TEST == 3)
		{
			Math.seedrandom('97f32a5b831d845d3bacb3fea3a2f78112b96a1e');
			this._numIterations = 400;
		}
	}

	public static i():Draw
	{
		if(Draw._instance === null) {
			Draw._instance = new Draw();
		}
		return Draw._instance;
	}

	public isCellAlive(x:number, y:number):bool
	{
		var alive:bool = false;

		// test for random implementation
		if (Draw.TEST == 1 || Draw.TEST == 3)
		{
			alive = Math.random() > 0.5;
		}

		// test for evolving R-pentomino
		// http://www.conwaylife.com/wiki/R-pentomino
		//
		//    X X
		//  X X
		//    X
		//
		if (Draw.TEST == 2)
		{
			alive = (
				(x == this._centerX   && y == this._centerY-1) ||
					(x == this._centerX+1 && y == this._centerY-1) ||
					(x == this._centerX-1 && y == this._centerY)   ||
					(x == this._centerX   && y == this._centerY)   ||
					(x == this._centerX   && y == this._centerY+1)
				);
		}

		return alive;
	}

	public drawPixel(x, y):void
	{
		var n = ((y * Draw.WIDTH) + x);
		this.imageData.data[n * 4 + 0] = this.imageData.data[n * 4 + 1] = this.imageData.data[n * 4 + 2] = Color.WHITE;
	}

	public clearPixel(x, y):void
	{
		var n = ((y * Draw.WIDTH) + x);
		this.imageData.data[n * 4 + 0] = this.imageData.data[n * 4 + 1] = this.imageData.data[n * 4 + 2] = Color.BLACK;
	}

	public run(t:Function):void
	{
		this.tick = t;
		this.update();
	}

	private update():void
	{
		if(this.tick)
		{
			// benchmark setup
			var s = performance.now();

			this.tick();

			// benchmark process
			var d = performance.now() - s;

			this._durations.push(d);
			this._summedDuration += d;
			this._min = Math.min(this._min, d);
			this._max = Math.max(this._max, d);

			if (Draw.LOG)
			{
				console.log(d);
			}
		}

		this.ctx.putImageData(this.imageData, 0, 0);

		// UPDATE
		if (++this._currentIteration < this._numIterations)
		{
			window['requestAnimationFrame'](() => this.update());
		}
		// END
		else
		{
			var average = this._summedDuration / this._numIterations;

			console.log('');
			console.log('--------- DONE --------');
			console.log('');
			console.log('total duration : ' + this._summedDuration);
			console.log('average frame  : ' + average);
			console.log('min frame      : ' + this._min);
			console.log('max frame      : ' + this._max);
			console.log('frame log      : ', this._durations);
			console.log('');
			console.log('----------------------');
			console.log('');
		}
	}
}

class Color {
	public static WHITE:number = 0xFF;
	public static BLACK:number = 0x00;
}

interface Console {
	count(countTitle?: string): void;
	groupEnd(): void;
	time(timerName?: string): void;
	timeEnd(timerName?: string): void;
	trace(): void;
	group(groupTitle?: string): void;
	dirxml(value: any): void;
	debug(message?: string, ...optionalParams: any[]): void;
	groupCollapsed(groupTitle?: string): void;
	select(element: Element): void;
}

Zepto(() => {
	var main:Main = window['main'] = new Main();
});