// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

a = document.getElementById('c');
c = a.getContext('2d');
// declare global vars to enable shortening by google closure compiler
var pixelSize = 8,
    PI = Math.PI,
    w=a.width,
    vw=w/pixelSize|0,
    h=a.height,
    vh=h/pixelSize|0,
    fps,
    t,
    st,
    run=1,
    hm=[],
    ts=3000,
    pxmax=0,
    pymax=0,
    pzmax=0
    ;

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

c.fillStyle = 'black';


t = fps = 0;
st = new Date().getTime();

for (ty=0;ty<ts;ty++) {
    for (tx=0;tx<ts;tx++) {
        hm[ty*ts+tx]=0.5+Math.sin(ty/8)*Math.sin(tx/8)/2;
    }
}

function pp(x, y, h, d) {
    var fg=25;
    b=d>fg?(Math.exp(-(d-fg)*fg*1e-2)*h)|0:h;
    c.fillStyle = 'rgb(0,'+(h==-1?0:b)+',0)';
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

render = function(t, fps) {
    var f=Math.sin(t/30)/2+0.5,f=1,imin=0.1;imax=40,di=0.2;
    var x,y,d,b,fy=0;
    var o={
        x:150,
        y:8,
        z:250+t/2
    }

    for (y = 0; y < vh; y+=1) {
        for (x = 0; x < vw; x+=1) {
            d={x:x/vw-0.5,y:y/vh-0.8,z:f};
            b=-1;


            for (i=imin; i<imax; i+=di) {
                var p = {
                    x:o.x+i*d.x,
                    y:o.y+i*d.y,
                    z:o.z+i*d.z,
                }

                pxmax=Math.max(pxmax,p.x);
                pymax=Math.max(pymax,p.y);
                pzmax=Math.max(pzmax,p.z);

                fy = hm[((p.z*10)%ts*ts+(p.x*10)%ts)|0];

                if (p.y < fy) {
                    b=fy*250|0;
                    break;
                }
            }

            pp(x,vh-y,b,p.z-o.z);
        }
    }
}

// add event listener to bind fun2tion keys
document.addEventListener('keydown', function(e) {
    run = e.keyCode==32 ? run*-1 : run*1;
});

(function loop() {
    requestAnimFrame(loop);
    // only render when running
    if (run==1) {
        render(t++, fps);
        fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
        t%10==0 && console.log(fps);
    }
})();
