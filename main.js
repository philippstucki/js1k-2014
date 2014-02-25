// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

// declare global vars to enable shortening by google closure compiler
var pixelSize = 12,
    PI = Math.PI,
    w=a.width,
    vw=w/pixelSize|0,
    h=a.height,
    vh=h/pixelSize|0,
    fps,
    t,
    st,
    run=1,
    M=Math,
    mr=M.random,
    ms=M.sin,
    mp=M.pow
    mM=M.max
    msq=M.sqrt
    ;

t = fps = 0;
st = new Date().getTime();

function pp(x, y, h, d) {
    var br,fg=8,r,g,b;
    br=d>fg?(Math.exp(-(d-fg)*fg*2e-2)*h)|0:h;
    r = 0;
    g=h==-1?0:br;
    b=h==-1?210:0;
    c.fillStyle = 'rgb(0,'+g+','+b+')';
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

function mod_xz(v, m) {
    return {
        x: v.x%m-m/2,
        y: v.y%m-m/2,
        z: v.z%m-m/2
    };
}

function DE_sphere(p,r) {
    return mM(0,msq(p.x*p.x+p.y*p.y+p.z*p.z)-r);
}

render = function(t) {
    var f=1.0,imax=25;
    var x,y,d,b,distance,dd,p,i;
    var o={
        x:10+1/32,
        y:10,
        z:0+t/32
    }

    for (y = 0; y < vh-0; y+=1) {
        for (x = 0; x < vw; x+=1) {
            d={x:x/vw-0.5,y:y/vh-0.8,z:f};
            b=-1;

            distance = 0;
            for (i=0; i<imax; i++) {
                p = {
                    x:o.x+distance*d.x,
                    y:o.y+distance*d.y,
                    z:o.z+distance*d.z
                }
                dd = DE_sphere(mod_xz(p,1), 0.2+ms(t/16)*0.10);
                distance+=dd;
                if (dd < 0.005) break;
            }
            b=(1-i/imax)*250|0;

            pp(x,vh-y,b,p.z-o.z);
        }
    }
}

// add event listener to bind fun2tion keys
document.addEventListener('keydown', function(e) {
    run = e.keyCode==32 ? run*-1 : run*1;
});

function loop() {
    requestAnimationFrame(loop);
    // only render when running
    if (run==1) {
        render(t++);
        fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
        t%10==0 && console.log(fps);
    }
};
loop();

