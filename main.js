// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

a = document.getElementById('c');
c = a.getContext('2d');

hme = document.getElementById('hm');
hmc = hme.getContext('2d');

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
    ts=8+1,
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

// seed corners
hm[0]=hm[ts-1]=hm[ts*ts-ts]=hm[ts*ts-1]=0.5;

function terrainstep(x, y, size, i) {
    var bi = y*ts+x,
        ofs = (Math.pow(2,i)-1)*size,
        tl=bi,
        tr=bi+size-1,
        bl=bi+size*(size-1)+ofs*(size-1),
        br=bl+size-1,
        t=tl+size/2-1,
        b=bl+size/2-1,
        cl=tl+(size+ofs)*(size-size/2-1),
        cr=cl+size-1,
        cm=cl+size/2-1,
        norm=function(v){v+=(mr()-0.5)/(Math.pow(2,i));return v>1?1:v<0?0:v;}

    hm[cm]=hm[cm+1]=hm[cm+ts]=hm[cm+ts+1]=norm((hm[tl]+hm[tr]+hm[bl]+hm[br])/4); // center
    hm[t]=hm[t+1]=norm((hm[tl]+hm[tr])/2); // top
    hm[b]=hm[b+1]=norm((hm[bl]+hm[br])/2); // bottom
    hm[cl]=hm[cl+ts]=norm((hm[tl]+hm[bl])/2); //center left
    hm[cr]=hm[cr+ts]=norm((hm[tr]+hm[br])/2); //center right

    if (size>4) {
        terrainstep(x,y,size/2,i+1);
        terrainstep(x+size/2,y,size/2,i+1);
        terrainstep(x,y+size/2,size/2,i+1);
        terrainstep(x+size/2,y+size/2,size/2,i+1);
    }
}
terrainstep(0,0,ts,0);
plotHm();

function plotHm() {
    var ps=40-Math.log(ts)/Math.LN2;
    for(y=0;y<ts;y++) {
        for(x=0;x<ts;x++) {
            pp(x,y,200,2);
            hmc.fillStyle = 'rgb(0,'+(hm[y*ts+x]*250|0)+',0)';
            hmc.fillRect(x*ps, y*ps, ps, ps);
        }
    }
}


function pp(x, y, h, d) {
    var fg=25;
    b=d>fg?(Math.exp(-(d-fg)*fg*1e-2)*h)|0:h;
    c.fillStyle = 'rgb(0,'+(h==-1?0:b)+',0)';
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

render = function(t, fps) {
    var f=Math.sin(t/30)/2+0.5,f=1,imin=0.1;imax=40,di=0.05;
    var x,y,d,b,fy=0;
    var o={
        x:10+t,
        y:8,
        z:250+t
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
    //requestAnimFrame(loop);
    // only render when running
    if (run==1) {
        render(t++, fps);
        fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
        t%10==0 && console.log(fps);
    }
})();
