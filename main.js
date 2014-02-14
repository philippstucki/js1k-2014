// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

a = document.getElementById('c');
c = a.getContext('2d');
c.fillStyle = 'black';

// declare global vars to enable shortening by google closure compiler
var pixelSize = 10,
    PI = Math.PI,
    w=a.width,
    h=a.height,
    fps,
    t,
    st,
    run=1;

t = fps = 0;
st = new Date().getTime();

function pp(x, y) {
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

render = function(t, fps) {
    for (y = 0; y < h/pixelSize|0; y++) {
        for (x = 0; x < w/pixelSize|0; x++) {
            var b = t%255;
            c.fillStyle = 'rgb('+0+','+b+','+0+')';
            pp(x, 20+Math.sin(t/5+PI*x/20)*20);
        }
    }
}

// add event listener to bind function keys
document.addEventListener('keydown', function(e) {
    run = e.keyCode==32 ? run*-1 : run*1;
});

(function loop() {
    requestAnimFrame(loop);
    // only render when running
    if (run==1) {
        render(t++, fps);
        fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
    }
})();
