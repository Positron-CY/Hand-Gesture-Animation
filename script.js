const video=document.getElementById("video");

const glove=document.getElementById("glove");
const scanner=document.getElementById("scanner");

const blast=document.getElementById("blast");
const laser=document.getElementById("laser");
const shield=document.getElementById("shield");

const mode=document.getElementById("mode");
const energy=document.getElementById("energy");


let sx=0;
let sy=0;

let smoothSize=1;

let charge=0;



const hands =
new Hands({

locateFile:f =>
`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:1,

minDetectionConfidence:.8,

minTrackingConfidence:.8

});




hands.onResults((res)=>{


if(res.multiHandLandmarks &&
res.multiHandLandmarks.length){


let h=res.multiHandLandmarks[0];


// finger count

let fingers=0;


if(h[8].y<h[6].y)
fingers++;

if(h[12].y<h[10].y)
fingers++;

if(h[16].y<h[14].y)
fingers++;

if(h[20].y<h[18].y)
fingers++;


// positions


let palm=h[9];
let wrist=h[0];


let x=(1-palm.x)*innerWidth;

let y=palm.y*innerHeight;



sx+=(x-sx)*0.18;

sy+=(y-sy)*0.18;



let size=
Math.abs(wrist.y-h[12].y)
*800;



smoothSize +=
(size-smoothSize)*0.15;



// hand angle rotation


let angle =

Math.atan2(

h[5].y-h[17].y,

h[5].x-h[17].x

)*60;



// show glove


glove.style.display="block";

scanner.style.display="block";



glove.style.left=
sx-smoothSize/2+"px";


glove.style.top=
sy-smoothSize/1.6+"px";



glove.style.transform=

`scale(${smoothSize/240})
 rotate(${angle}deg)`;




// scanner


scanner.style.left=
sx-160+"px";


scanner.style.top=
sy-160+"px";



// reset weapons


blast.style.display="none";

laser.style.display="none";

shield.style.display="none";




// 🖐 REPULSOR MODE


if(fingers>=4){


mode.innerHTML=
"MODE: REPULSOR ⚡";


charge+=3;


if(charge>100)
charge=100;


energy.innerHTML=
"ENERGY "+charge+"%";



if(charge>=100){


blast.style.display="block";


blast.style.left=sx+"px";

blast.style.top=sy+"px";


blast.style.width=
innerWidth+"px";


}



}



// ✊ SHIELD MODE


else if(fingers==0){


mode.innerHTML=
"MODE: ENERGY SHIELD 🛡";


charge=0;


energy.innerHTML=
"ENERGY 0%";


shield.style.display="block";


shield.style.left=
sx-125+"px";


shield.style.top=
sy-125+"px";


}



// ☝ LASER MODE


else if(fingers==1){


mode.innerHTML=
"MODE: LASER 🔴";


charge=0;


energy.innerHTML=
"ENERGY 0%";


laser.style.display="block";


laser.style.left=
sx+"px";


laser.style.top=
sy+"px";


laser.style.width=
innerWidth+"px";


}



// ✌ OTHER


else{


mode.innerHTML=
"MODE: SCANNING";

charge=0;

energy.innerHTML=
"ENERGY 0%";


}


}



else{


glove.style.display="none";

scanner.style.display="none";

blast.style.display="none";

laser.style.display="none";

shield.style.display="none";


mode.innerHTML=
"MODE: SEARCHING";


charge=0;

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
