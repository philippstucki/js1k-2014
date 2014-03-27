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
var pixelSize = 6,
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
    msq=M.sqrt,
    hue=1,
    light=100,
    o={}
    ;

o.x=o.y=o.z=6;


if (DEBUG) {
    st = new Date().getTime();
    fps=0;
}

function pp(x, y, v) {
    c.fillStyle = 'hsla('+[hue,v*80+'%',v*light+'%',0.8];
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

var render = function() {
    var f=1,imax=20;
    var x,y,d,b,distance,dd,p,i,walk=0.02;

    o.z=t/5;
    o.x=t/5;

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
                p=rotate_Z(p,t/300);
                //p=rotate_Y(p,t/400);
                p=translate(p,o.x,o.y,o.z);
                dd = DE_sphere(mod_xz(p,1), 0.2);
                distance+=dd;
                if (dd < 5e-4) break;
            }
            b=(1-i/imax);

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
            render();
        }
    } else {
        render();
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
    osc1 = {f:0, p:0, w:0, a:0, r: 1/6, v:1/3, t:-10, n:0},
    osc2 = {f:0, p:0, w:0, a:0, r: 1/9, v:1/3, t:0, n:1},
    osc3 = {f:0, p:0, w:0, a:0, r: 1, v:1/11, n:0},
    osc4 = {f:0, p:0, w:0, a:0, r: 1, v:1/11, n:0},
    osc5 = {f:0, p:0, w:0, a:0, r: 1, v:1/11, n:0},
    pattern1=[1,0,0,0],
    pattern2=[1,0,0],
    pattern3=[1,4,7],
    bt=0;

    a_ctx = new Ado();
    shorten(a_ctx);

    a_jsnode = a_ctx.ceS(1<<12, 0, 1);
    shorten(a_jsnode);
    a_jsnode.cnt(a_ctx.dsa);

    a_jsnode.onaudioprocess = function(e) {
        var y1,n,sr=a_ctx.smR,delta,res=60/(4*140),getVoiceValue,beatlength=sr*res|0;
        var beat,starta,vtranspose;

        getVoiceValue = function(osc, pattern, start) {
            var note = pattern[beat%pattern.length];

            // modulates pulse width
            osc.w=(ms(mc(t/20))*1/3+1/3)*osc.a;

            if (start && note !=0) {
                osc.a=1;
                osc.f = keyfrequency(note+osc.t);
                hue+=note*4;
            }

            // calculate new phase
            delta = (TPI*osc.f)/sr;
            osc.p = (osc.p+delta)%(TPI);

            // calculate current amplitude based on envelope
            osc.a -= 1/(osc.r*sr);
            osc.a = mM(osc.a,0);

            // calculate current voice value
            return osc.v*osc.a*(osc.n?mr():osc_pulse(osc.p, osc.w));
            return osc.v*osc.a*(osc.n*mr()+(1-osc.n)*osc_pulse(osc.p, osc.w));
        }

        shorten(e);
        shorten(e.otB);
        y1 = e.otB.gtn(0);

        for (i=0; i<y1.length; i++) {
            // current sample, absolute to start
            n=bt+i;

            // current beat, continuous
            beat = (n/(beatlength)|0);

            // indicates start of beat with value<>0
            start=n%beatlength==0?1:0;

            // increase grahpics time on beat start
            t+=1/400;

            // transpose arpeggio voices
            osc3.t = beat%32>16?8:5;
            osc4.t=osc3.t+7;
            osc5.t=osc4.t+8;


            y1[i] = 0
                    + getVoiceValue(osc1, pattern1, start)
                    + getVoiceValue(osc2, pattern2, start)
                    + getVoiceValue(osc3, pattern3, start)
                    + (beat>32?getVoiceValue(osc4, pattern3, start):0)
                    + (beat>96?getVoiceValue(osc5, pattern3, start):0)
                    ;
        }
        bt+=y1.length;

    };

}
