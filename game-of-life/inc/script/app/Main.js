var Main = (function () {
    function Main() {
        var _this = this;
        var a = Draw.i();
        this.init();
        a.run(function () {
            _this.next();
        });
    }
    Main.prototype.init = function () {
        var a = Draw.i();
        var alive;
        for(var y = 0; y < Draw.HEIGHT; y++) {
            for(var x = 0; x < Draw.WIDTH; x++) {
                if(a.isCellAlive(x, y)) {
                    Draw.i().drawPixel(x, y);
                }
            }
        }
    };
    Main.prototype.next = function () {
        for(var y = 0; y < Draw.HEIGHT; y++) {
            for(var x = 0; x < Draw.WIDTH; x++) {
                if(Math.random() > 0.9) {
                    if(Math.random() > 0.5) {
                        Draw.i().drawPixel(x, y);
                    } else {
                        Draw.i().clearPixel(x, y);
                    }
                }
            }
        }
    };
    return Main;
})();
var Draw = (function () {
    function Draw() {
        this._currentIteration = 0;
        this._summedDuration = 0;
        this._durations = [];
        this._min = Number.MAX_VALUE;
        this._max = 0;
        if(Draw._instance) {
            throw new Error("Error: Instantiation failed: Use Draw.i() instead of new.");
        }
        Draw._instance = this;
        if(this.getQueryParam('test')) {
            Draw.TEST = parseInt(this.getQueryParam('test'), 10);
        }
        if(this.getQueryParam('log')) {
            Draw.LOG = this.getQueryParam('log') == '1' || this.getQueryParam('log') == 'true' || this.getQueryParam('log') == 'on';
        }
        this.init();
    }
    Draw._instance = null;
    Draw.WIDTH = 1200;
    Draw.HEIGHT = 600;
    Draw.TEST = 1;
    Draw.LOG = false;
    Draw.prototype.getQueryParam = function (key) {
        return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [
            , 
            ""
        ])[1].replace(/\+/g, '%20')) || null;
    };
    Draw.prototype.init = function () {
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
        if(Draw.TEST == 1) {
            Math.seedrandom('97f32a5bb3fea3a2f78112b96a1e831d845d3bac');
            this._numIterations = 1500;
        } else if(Draw.TEST == 2) {
            Math.seedrandom('12b96a1e831d845d3bac97f32a5bb3fea3a2f781');
            this._numIterations = 1104;
        } else if(Draw.TEST == 3) {
            Math.seedrandom('97f32a5b831d845d3bacb3fea3a2f78112b96a1e');
            this._numIterations = 400;
        }
    };
    Draw.i = function i() {
        if(Draw._instance === null) {
            Draw._instance = new Draw();
        }
        return Draw._instance;
    };
    Draw.prototype.isCellAlive = function (x, y) {
        var alive = false;
        if(Draw.TEST == 1 || Draw.TEST == 3) {
            alive = Math.random() > 0.5;
        }
        if(Draw.TEST == 2) {
            alive = ((x == this._centerX && y == this._centerY - 1) || (x == this._centerX + 1 && y == this._centerY - 1) || (x == this._centerX - 1 && y == this._centerY) || (x == this._centerX && y == this._centerY) || (x == this._centerX && y == this._centerY + 1));
        }
        return alive;
    };
    Draw.prototype.drawPixel = function (x, y) {
        var n = ((y * Draw.WIDTH) + x);
        this.imageData.data[n * 4 + 0] = this.imageData.data[n * 4 + 1] = this.imageData.data[n * 4 + 2] = Color.WHITE;
    };
    Draw.prototype.clearPixel = function (x, y) {
        var n = ((y * Draw.WIDTH) + x);
        this.imageData.data[n * 4 + 0] = this.imageData.data[n * 4 + 1] = this.imageData.data[n * 4 + 2] = Color.BLACK;
    };
    Draw.prototype.run = function (t) {
        this.tick = t;
        this.update();
    };
    Draw.prototype.update = function () {
        var _this = this;
        if(this.tick) {
            var s = performance.now();
            this.tick();
            var d = performance.now() - s;
            this._durations.push(d);
            this._summedDuration += d;
            this._min = Math.min(this._min, d);
            this._max = Math.max(this._max, d);
            if(Draw.LOG) {
                console.log(d);
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
        if(++this._currentIteration < this._numIterations) {
            window['requestAnimationFrame'](function () {
                return _this.update();
            });
        } else {
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
    };
    return Draw;
})();
var Color = (function () {
    function Color() { }
    Color.WHITE = 0xFF;
    Color.BLACK = 0x00;
    return Color;
})();
Zepto(function () {
    var main = window['main'] = new Main();
});
