const video=document.getElementById("video");

const glove=document.getElementById("glove");
const scanner=document.getElementById("scanner");

const blast=document.getElementById("blast");
const laser=document.getElementById("laser");
const shield=document.getElementById("shield");

const mode=document.getElementById("mode");
const energy=document.getElementById("energy");


let sx=0, sy=0;
let smoothSize=100;
let smoothAngle=0;

let charge=0;
let frame=0;



const hands=new Hands({

locateFile:f=>
`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`

});


hands.setOptions({

maxNumHands:1,

modelComplexity:0,

minDetectionConfidence:.7,

minTrackingConfidence:.7

});



hands.onResults(res=>{


frame++;

if(frame%2!==0) return;



if(res.multiHandLandmarks &&
res.multiHandLandmarks.length){


let h=res.multiHandLandmarks[0];



// fingers


let fingers=0;


if(h[8].y<h[6].y) fingers++;

if(h[12].y<h[10].y) fingers++;

if(h[16].y<h[14].y) fingers++;

if(h[20].y<h[18].y) fingers++;




// position


let palm=h[9];


let x=(1-palm.x)*innerWidth;

let y=palm.y*innerHeight;



// faster smooth


sx+=(x-sx)*0.35;

sy+=(y-sy)*0.35;




// size


let newSize=
Math.abs(h[0].y-h[12].y)*850;


smoothSize+=
(newSize-smoothSize)*0.25;



// FIXED ROTATION


let rawAngle=

-Math.atan2(

h[5].y-h[17].y,

h[5].x-h[17].x

)*70;



smoothAngle +=
(rawAngle-smoothAngle)*0.25;



// glove


glove.style.display="block";


glove.style.left=
sx-smoothSize/2+"px";


glove.style.top=
sy-smoothSize/1.7+"px";



glove.style.transform=

`scale(${smoothSize/240})
rotate(${smoothAngle}deg)`;




// scanner


scanner.style.display="block";


scanner.style.left=
sx-160+"px";


scanner.style.top=
sy-160+"px";



// reset


blast.style.display="none";

laser.style.display="none";

shield.style.display="none";




// PALM BLAST


if(fingers>=4){


mode.innerHTML=
"REPULSOR READY ⚡";


charge+=5;


if(charge>100)
charge=100;



energy.innerHTML=
"ENERGY "+charge+"%";



if(charge==100){


blast.style.display="block";


blast.style.left=sx+"px";

blast.style.top=sy+"px";

blast.style.width=innerWidth+"px";


// shake

document.body.style.transform=
"translate(5px,5px)";


setTimeout(()=>{

document.body.style.transform="";

},100);


}



}



// FIST SHIELD


else if(fingers==0){


mode.innerHTML=
"VIBRANIUM SHIELD 🛡";


charge=0;


shield.style.display="block";


shield.style.left=sx-125+"px";

shield.style.top=sy-125+"px";


}



// LASER


else if(fingers==1){


mode.innerHTML=
"LASER MODE 🔴";


charge=0;


laser.style.display="block";


laser.style.left=sx+"px";

laser.style.top=sy+"px";

laser.style.width=innerWidth+"px";


}



else{


mode.innerHTML=
"NANO MODE 🦾";

charge=0;


}



}


else{


glove.style.display="none";

scanner.style.display="none";

blast.style.display="none";

laser.style.display="none";

shield.style.display="none";


charge=0;


}


});




const camera=new Camera(video,{

onFrame:async()=>{

await hands.send({image:video});

},

width:960,
height:540

});


camera.start();
