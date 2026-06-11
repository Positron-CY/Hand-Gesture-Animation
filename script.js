const video=document.getElementById("video");
const glove=document.getElementById("glove");
const beam=document.getElementById("beam");
const scanner=document.getElementById("scanner");
const power=document.getElementById("power");


let sx=0, sy=0;
let oldSize=0;
let charge=0;


const hands=new Hands({

locateFile:f=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`

});


hands.setOptions({

maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:.7,
minTrackingConfidence:.7

});



hands.onResults(r=>{


if(r.multiHandLandmarks &&
r.multiHandLandmarks.length){


let h=r.multiHandLandmarks[0];


let palm=h[9];
let wrist=h[0];


let x=(1-palm.x)*innerWidth;
let y=palm.y*innerHeight;


sx+=(x-sx)*.25;
sy+=(y-sy)*.25;


let size=
Math.abs(wrist.y-h[12].y)*700;



glove.style.display="block";
scanner.style.display="block";


glove.style.left=
sx-size/2+"px";

glove.style.top=
sy-size/1.8+"px";


glove.style.transform=
`scale(${size/220})`;



scanner.style.left=
sx-125+"px";

scanner.style.top=
sy-125+"px";



charge++;

if(charge>100)
charge=100;


power.innerHTML=
charge+"%";



// blast

if(size-oldSize>15){


beam.style.display="block";

beam.style.left=sx+"px";

beam.style.top=sy+"px";

beam.style.width=
innerWidth+"px";

createParticle();

}

else{

beam.style.display="none";

}


oldSize=size;

}

else{

glove.style.display="none";
scanner.style.display="none";
beam.style.display="none";

charge=0;

power.innerHTML="0%";

}


});



function createParticle(){

let p=document.createElement("div");

p.className="particle";

p.style.left=sx+"px";

p.style.top=sy+"px";

document.body.appendChild(p);


setTimeout(()=>{

p.remove();

},1000);

}




const camera=new Camera(video,{

onFrame:async()=>{

await hands.send({image:video});

},

width:1280,
height:720

});


camera.start();
