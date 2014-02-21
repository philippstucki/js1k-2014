// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

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
    ts=512,
    ts_2=ts*ts;
    t_persistence=1/3,
    t_octaves=5,
    t_scale=9,
    t_amplify=0.9,
    noise=[],
    hm=[],
    mr=Math.random,
    ms=Math.sin,
    mp=Math.pow
    ;

t = fps = 0;
st = new Date().getTime();

// generate heightmap
function mod_ts_2(n) {
    return ((n%ts_2)+ts_2)%ts_2;
}
function smooth(x,y) {
    var bi=(y%ts)*ts+x%ts;
    return noise[bi] + noise[mod_ts_2(bi-ts)] + noise[mod_ts_2(bi-ts-1)] + noise[(y%ts)*ts+(((x-1)%ts)+ts)%ts];
}
function interpolate(a, b, x) {
    return a*(1-x)+b*x;
}
function interpolated_noise(x,y) {
    var fx=x%1,
        fy=y%1,
        x=~~x,
        y=~~y,
        v1,v2,v3,v4,i1,i2;
    v1=smooth(x,y);
    v2=smooth(x+1,y);
    v3=smooth(x,y+1);
    v4=smooth(x+1,y+1);
    i1=interpolate(v1,v2,fx);
    i2=interpolate(v3,v4,fx);
    return interpolate(i1,i2,fy);
}
function pnoise(x, y) {
    var total=0,
        p = t_persistence, // persistence
        n = t_octaves - 1, // octaves
        f, a;

    for (i=0;i<=n;i++) {
        f=mp(2,i);
        a=mp(p,i);
        total+=interpolated_noise(x*f,y*f)*a;
    }
    return total/t_octaves*t_amplify;
}

for (i=0;i<ts*ts;i++) {
    noise[i]=mr();
}
for (y = 0; y < ts; y+=1) {
    for (x = 0; x < ts; x+=1) {
        hm[y*ts+x]=(2.0-mp(0.3,pnoise(x/t_scale,y/t_scale)-0.99));
        //hm[y*ts+x]=pnoise(x/t_scale,y/t_scale);
    }
}

plotHm();

function plotHm() {
    var ps=Math.max(10-Math.log(ts-1)/Math.LN2|0,1);
    for(y=0;y<ts;y++) {
        for(x=0;x<ts;x++) {
            hmc.fillStyle = 'rgb(0,'+(hm[y*ts+x]*250|0)+',0)';
            hmc.fillRect(x*ps, y*ps, ps, ps);
        }
    }
}

function pp(x, y, h, d) {
    var fg=10;
    b=d>fg?(Math.exp(-(d-fg)*fg*1e-2)*h)|0:h;
    c.fillStyle = 'rgb(0,'+(h==-1?0:b)+',0)';
    c.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

render = function(t, fps) {
    var f=1,imin=1.1;imax=25,di=0.1;
    var x,y,d,b,fy=0;
    var o={
        x:2,
        y:1.0,
        z:10+t*0.1
    }

    for (y = 20; y < vh-20; y+=1) {
        for (x = 0; x < vw; x+=1) {
            d={x:x/vw-0.5,y:y/vh-0.5,z:f};
            b=-1;

            for (i=imin; i<imax; i+=di) {
                var p = {
                    x:o.x+i*d.x,
                    y:o.y+i*d.y,
                    z:o.z+i*d.z,
                }

                fy = hm[((p.z*15)%ts*ts+(p.x*15)%ts)|0];

                if (p.y < fy) {
                    b=fy*300|0;
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
    requestAnimationFrame(loop);
    // only render when running
    if (run==1) {
        render(t++, fps);
        fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
        t%10==0 && console.log(fps);
    }
})();
