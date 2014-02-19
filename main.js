// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

a = document.getElementById('c');
c = a.getContext('2d');
// declare global vars to enable shortening by google closure compiler
var pixelSize = 6,
    PI = Math.PI,
    w=a.width,
    vw=w/pixelSize|0,
    h=a.height,
    vh=h/pixelSize|0,
    fps,
    t,
    st,
    run=1,
    ts=8,
    hm=[],
    mr=Math.random,
    ms=Math.sin
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

// sine bumps
//for (ty=0;ty<ts;ty++) {
    //for (tx=0;tx<ts;tx++) {
        //hm[ty*ts+tx]=0.5+Math.sin(ty/8)*Math.sin(tx/8)/2;
    //}
//}

// seed corners
hm[0]=hm[ts-1]=hm[ts*ts-ts]=hm[ts*ts-1]=mr();

function terrainstep(x, y, size, i) {
    var bi = y*ts+x,
        lo = i*size,
        tl=bi,
        tr=bi+size-1,
        bl=bi+lo+size*(size-1),
        br=bi+lo+size*size-1,
        t=tl+size/2-1,
        b=bl+size/2-1,
        cl=tl+size*(size-size/2-1),
        cr=cl+size-1,
        cm=cl+size/2-1,
        displ=function(){return (mr()-0.5)/2;}

    hm[t]=hm[t+1]=(hm[tl]+hm[tr])/2+displ(); // top
    hm[b]=hm[b+1]=(hm[bl]+hm[br])/2+displ(); // bottom

    //hm[cl]=hm[cl+8]=(hm[tl]+hm[bl])/2+displ(); //center left
    //hm[cr]=hm[cr+8]=(hm[tr]+hm[br])/2+displ(); //center right
    //hm[cm]=hm[cm+1]=hm[cm+8]=hm[cm+9] //center
        //=(hm[tl]+hm[tr]+hm[bl]+hm[br])/4+displ();

    if (size>4) {
        terrainstep(0,0,size/2,i+1);
        terrainstep(size/2,0,sixe/2,i+1);
        terrainstep(0,size/2,size/2,i+1);
        terrainstep(size/2,size/2,size/2,i+1);
    }
}
terrainstep(0,0,ts,0);



function pp(x, y, h, d) {
    var fg=75;
    b=d>fg?(Math.exp(-(d-fg)*fg*1e-2)*h)|0:h;
    c.fillStyle = 'rgb(0,'+(h==-1?0:b)+',0)';
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

render = function(t, fps) {
    var f=Math.sin(t/30)/2+0.5,f=1,imin=0.1;imax=40,di=0.2;
    var x,y,d,b,fy=0;
    var o={
        x:250,
        y:8,
        z:250
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
