const video=document.getElementById("video");

const glove=document.getElementById("glove");
const scanner=document.getElementById("scanner");

const blast=document.getElementById("blast");
const laser=document.getElementById("laser");
const shield=document.getElementById("shield");

const mode=document.getElementById("mode");
const energy=document.getElementById("energy");

const index=document.getElementById("index");
const middle=document.getElementById("middle");
const ring=document.getElementById("ring");
const pinky=document.getElementById("pinky");
const thumb=document.getElementById("thumb");


let sx=0;
let sy=0;

let sizeSmooth=120;
let angleSmooth=0;

let charge=0;
let nano=0;



const hands=new Hands({

locateFile:f=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:0,

minDetectionConfidence:.75,

minTrackingConfidence:.75

});




hands.onResults(res=>{


if(res.multiHandLandmarks &&
res.multiHandLandmarks.length){



let h=res.multiHandLandmarks[0];


// position

let palm=h[9];


let x=(1-palm.x)*innerWidth;

let y=palm.y*innerHeight;


sx+=(x-sx)*.3;

sy+=(y-sy)*.3;



// size


let size=

Math.abs(h[0].y-h[12].y)
*850;


sizeSmooth+=
(size-sizeSmooth)*.25;




// rotation


let angle=

-Math.atan2(

h[5].y-h[17].y,

h[5].x-h[17].x

)*70;


angleSmooth+=
(angle-angleSmooth)*.25;




// glove position


glove.style.display="block";


glove.style.left=
sx-sizeSmooth/2+"px";


glove.style.top=
sy-sizeSmooth/1.5+"px";


glove.style.transform=

`scale(${sizeSmooth/260})
rotate(${angleSmooth}deg)`;




// scanner


scanner.style.display="block";


scanner.style.left=
sx-140+"px";


scanner.style.top=
sy-140+"px";





// FINGER BENDING


function bend(finger,tip,base){


if(h[tip].y > h[base].y){


finger.style.transform=
"rotate(55deg)";


}

else{


finger.style.transform=
"rotate(0deg)";


}

}



bend(index,8,6);

bend(middle,12,10);

bend(ring,16,14);

bend(pinky,20,18);



thumb.style.transform=

`rotate(${
(h[4].x-h[2].x)*200-40
}deg)`;





// count fingers


let fingers=0;


if(h[8].y<h[6].y) fingers++;

if(h[12].y<h[10].y) fingers++;

if(h[16].y<h[14].y) fingers++;

if(h[20].y<h[18].y) fingers++;




// nano particles


nano++;


if(nano%6==0){


let p=document.createElement("div");


p.style.position="absolute";

p.style.width="7px";

p.style.height="7px";

p.style.borderRadius="50%";

p.style.background="cyan";

p.style.boxShadow=
"0 0 20px cyan";


p.style.left=
sx+Math.random()*300-150+"px";


p.style.top=
sy+Math.random()*300-150+"px";


p.style.transition=".5s";


document.body.appendChild(p);


setTimeout(()=>{

p.style.left=sx+"px";

p.style.top=sy+"px";

p.style.opacity=0;

},30);



setTimeout(()=>{

p.remove();

},600);


}






// reset weapons


blast.style.display="none";

laser.style.display="none";

shield.style.display="none";





if(fingers>=4){


mode.innerHTML=
"REPULSOR MODE ⚡";


charge+=4;


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



else if(fingers==0){


mode.innerHTML=
"SHIELD MODE 🛡";


charge=0;


shield.style.display="block";


shield.style.left=sx-130+"px";


shield.style.top=sy-130+"px";


}



else if(fingers==1){


mode.innerHTML=
"LASER MODE 🔴";


charge=0;


laser.style.display="block";


laser.style.left=sx+"px";


laser.style.top=sy+"px";


laser.style.width=
innerWidth+"px";


}



else{


mode.innerHTML=
"NANO TRACKING 🦾";


charge=0;


}



}



else{


glove.style.display="none";

scanner.style.display="none";

blast.style.display="none";

laser.style.display="none";

shield.style.display="none";


mode.innerHTML="SEARCHING";

energy.innerHTML="ENERGY 0%";


charge=0;


}



});




const camera=
new Camera(video,{

onFrame:async()=>{


await hands.send({

image:video

});


},


width:960,

height:540


});


camera.start();
