with(Math)r=2*PI,w=sin,x=pow,y=max,z=sqrt;
n=a.width/65|0,p=a.height/65|0,A=1,B=100,E=C=D=60,s=0,u=v=O=0;

function F(){
    requestAnimationFrame(F);
    D+=16>v?0.05:0;
    E+=16>v?0:0.08;
    for(b=65;b--;)
        for(m=65; m--;){
            l=m/65-0.5;
            k=b/65-0.5;
            for(t=f=0; 20>t&&!(h=E+f*l,d=C+f*k,g=D+f,h=h%1-0.5,d=d%1-0.5,g=g%1-0.5,g=y(0,z(h*h+d*d+g*g)-0.2),f+=g,5E-4>g); t++);
            l=1-t/20;
            k=m;
            f=65-b;
            c.fillStyle="hsla("+[A,80*l+"%",l*B+"%",0.4];
            c.fillRect(k*n,f*p,n,p)
        }
}
F();

I={d:0,b:0,g:0,a:0,e:1,f:1/11},J={d:0,b:0,g:0,a:0,e:1,f:1/11},K={d:0,b:0,g:0,a:0,e:1,f:1/11},L={d:0,b:0,g:0,a:0,e:1,f:1/11},M=[1,0,0,0],N=[1,4,7];
I.f=1/3;
I.e=1/6;
I.c=-9;

G=new AudioContext;
H=G.createScriptProcessor(4096,0,1);
H.connect(G.destination);

H.onaudioprocess=function(h){
    j=G.sampleRate,W=1/8*j|0;
    $=function(b,f,d){f=f[u%f.length];
        b.g=(1*w(s/20)/3+1/3)*b.a;
        d&&0!=f&&(b.a=1,b.d=440*x(2,(f+b.c-34)/12),A+=4*f);
        l=r*b.d/j;
        b.b=(b.b+l)%r;
        b.a-=1/(b.e*j);
        b.a=y(b.a,0);
        return b.f*b.a*(b.b>(b.g+1)/2*r?1:-1)};
    h=h.outputBuffer.getChannelData(0);
    for(i=0; i<h.length;i++)d=O+i,u=d/W|0,d=0==d%W?1:0,s+=0.0025,v=u%32,J.c=16<v?8:5,K.c=J.c+7,L.c=K.c+20,h[i]=$(I,M,d)+$(J,N,d)+(w(s/300-r/3)/3+1/3)*($(K,N,d)+$(L,N,d));
    O+=h.length
};

