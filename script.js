const video=document.getElementById("video");

const glove=document.getElementById("glove");

const scanner=document.getElementById("scanner");

const blast=document.getElementById("blast");

const energy=document.getElementById("energy");



let sx=0;
let sy=0;

let smoothSize=1;

let oldSize=0;

let power=0;



const hands =
new Hands({

locateFile:f=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:1,

minDetectionConfidence:.8,

minTrackingConfidence:.8

});



hands.onResults(data=>{


if(data.multiHandLandmarks &&
data.multiHandLandmarks.length){



let h=data.multiHandLandmarks[0];


let palm=h[9];

let wrist=h[0];



let x=
(1-palm.x)*innerWidth;


let y=
palm.y*innerHeight;



// smooth tracking

sx+=(x-sx)*0.15;

sy+=(y-sy)*0.15;



let size=
Math.abs(wrist.y-h[12].y)*750;


smoothSize +=
(size-smoothSize)*0.15;



glove.style.display="block";

scanner.style.display="block";



glove.style.left=
sx-smoothSize/2+"px";


glove.style.top=
sy-smoothSize/1.6+"px";



glove.style.transform=

`scale(${smoothSize/230})`;



scanner.style.left=
sx-150+"px";


scanner.style.top=
sy-150+"px";



// energy

power++;

if(power>100)
power=100;


energy.innerHTML=
"ENERGY "+power+"%";



// blast when hand moves forward


if(size-oldSize>12){


blast.style.display="block";

blast.style.left=sx+"px";

blast.style.top=sy+"px";

blast.style.width=
innerWidth+"px";


}

else{


blast.style.display="none";


}


oldSize=size;


}


else{


glove.style.display="none";

scanner.style.display="none";

blast.style.display="none";


power=0;

energy.innerHTML=
"ENERGY 0%";


}


});



const camera =
new Camera(video,{

onFrame:async()=>{

await hands.send({

image:video

});

},

width:1280,

height:720


});


camera.start();
