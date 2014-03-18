// make jslint stop after the first error so we can do all sort of nasty tricks
/*jslint passfail: true*/

/** @define {boolean} */
var DEBUG = true;
var SOUND = true;

/*
 * window:
 *      Ado: AudioContext()
 *      rqt: requestAnimationFramework()
 *
 * AudioContext:
 *      flc: fillRect()
 *      smR: sampleRate
 *      dsa: destination
 *
 * AudioDestinationNode:
 *      ceS: createScriptProcessor()
 *
 * ScriptProcessorNode:
 *      cnt: connect()
 */
function shorten(o) {
    for (e in o) {
        o[e[0]+e[2]+(e[6]||'')] = o[e];
    }
}

shorten(this);
shorten(c);
shorten(a);

// declare global vars to enable shortening by google closure compiler
var pixelSize = 10,
    M=Math,
    PI = M.PI,
    TPI = 2*PI,
    w=a.wd,
    vw=w/pixelSize|0,
    h=a.hi,
    vh=h/pixelSize|0,
    fps,
    t=0,
    theta=0,
    st,
    run=1,
    mr=M.random,
    ms=M.sin,
    mc=M.cos,
    mp=M.pow,
    me=M.exp,
    mM=M.max,
    msq=M.sqrt
    ;


if (DEBUG) {
    st = new Date().getTime();
    fps=0;
}

function pp(x, y, v) {
    c.fillStyle = 'rgb(0,'+v+',0)';
    c.flc(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
}

function mod_xz(v, m) {
    return {
        x: v.x%m-m/2,
        y: v.y%m-m/2,
        z: v.z%m-m/2
    };
}

function DE_sphere(p, r) {
    return mM(0,msq(p.x*p.x+p.y*p.y+p.z*p.z)-r);
}

function DE_displaced_sphere(p, r) {
    var d1,d2;
    d1 = DE_sphere(p, r);
    d2 = ms(1.5*p.x)*ms(1.5*p.y);
    return d1+d2;
}

function rotate_Y(p, t) {
    return {
        x: p.x*mc(t)-p.z*ms(t),
        y: p.y,
        z: p.x*ms(t)+p.z*mc(t)
    };
}

function rotate_Z(p, t) {
    return {
        x: p.x*mc(t)-p.y*ms(t),
        y: p.x*ms(t)+p.y*mc(t),
        z: p.z
    };
}

function translate(p, x, y, z) {
    return {
        x: p.x+x,
        y: p.y+y,
        z: p.z+z
    };
}

var render = function(t) {
    var f=1,imax=20;
    var x,y,d,b,distance,dd,p,i,origin=13+t/40;
    var o={};
    o.x=origin;o.y=o.z=10;
    theta+=(ms(t/30)+1)/80;

    y=vh;while(y--) {
        x=vw;while(x--) {
            d={x:x/vw-0.5,y:y/vh-0.5};

            distance = 0;
            for (i=0; i<imax; i++) {
                p = {
                    x:o.x+distance*d.x,
                    y:o.y+distance*d.y,
                    z:o.z+distance
                };
                p=translate(p,-o.x,-o.y,-o.z);
                p=rotate_Z(p,theta);
                p=rotate_Y(p,theta);
                p=translate(p,o.x,o.y,o.z);
                dd = DE_sphere(mod_xz(p,1), 0.2);
                distance+=dd;
                if (dd < 0.005) break;
            }
            b=(1-i/imax)*250|0;

            pp(x,vh-y,b);
        }
    }
}

// add event listener to bind fun2tion keys
if (DEBUG) {
    onkeydown=function(e) {
        run = e.keyCode==32 ? run*-1 : run*1;
        SOUND && (e.keyCode==32 && a_jsnode.disconnect());
    };
}

function loop() {
    rqt(loop);

    if (DEBUG) {
        if (run==1) {
            render(t++);
            fps = Math.round(10*(t*1E3/(new Date().getTime() - st)))/10;
            t%10==0 && console.log(fps);
        }
    } else {
        render(t++);
    }
};
loop();

if (SOUND) {

/*
    key table

    Notation | nr
    ---------+--
    c        | 1
    c#       | 2
    d        | 3
    d#       | 4
    e        | 5
    f        | 6
    f#       | 7
    g        | 8
    g#       | 9
    a        | 10
    a#       | 11
    b        | 12

    octave: +12

*/

    function osc_sin(w) {
        return ms(w);
    }
    function osc_square(w) {
        return w>PI?1:-1;
    }
    function osc_pulse(w, pw) {
        return w>(pw+1)/2*TPI?1:-1;
    }
    function osc_saw(w) {
        return w/PI-1;
    }

    function keyfrequency(n) {
        return mp(2,(n-34)/12)*440;
    }


    var a_ctx,a_jsnode,a_delta,
    osc1 = {p:0, w:0, r: 0.05, v:0.35, t:14, a:0},
    osc2 = {p:0, w:0, r: 0.1, v:0.4, t:-5, a:0},
    bt=0,
    pattern1=[7,0,7,0,0,0,0,5],
    pattern2=[1,0,0,2,3,1,1,0];

    a_ctx = new Ado();
    shorten(a_ctx);

    a_jsnode = a_ctx.ceS(1<<12, 0, 1);
    shorten(a_jsnode);
    a_jsnode.cnt(a_ctx.dsa);

    a_jsnode.onaudioprocess = function(e) {
        var y1,n,sr=a_ctx.smR,delta,res=60/(4*140),getVoiceValue,notelength=sr*res;

        getVoiceValue = function(osc, pattern) {
            var note = pattern[(n/(notelength)|0)%pattern.length];

            // modulates pulse width
            osc.w=osc.a*0.2*note/10;

            if ((n)%(notelength)==0 && note !=0) {
                osc.a=1;
                osc.f = keyfrequency(note+osc.t);
            }

            // calculate new phase
            delta = (TPI*osc.f)/sr;
            osc.p = (osc.p+delta)%(TPI);

            // calculate current amplitude based on envelope
            osc.a -= 1/(osc.r*sr);
            osc.a = mM(osc.a,0);

            // calculate current voice value
            return osc.v*osc.a*osc_pulse(osc.p, osc.w);
        }

        shorten(e);
        shorten(e.otB);
        y1 = e.otB.gtn(0);

        for (i=0; i<y1.length; i++) {
            n=bt+i;
            y1[i] = getVoiceValue(osc1, pattern1)
                    +getVoiceValue(osc2, pattern2);
        }
        bt+=y1.length;

    };

}
