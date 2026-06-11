const video = document.getElementById("video");

const glove = document.getElementById("glove");
const scanner = document.getElementById("scanner");
const blast = document.getElementById("blast");

const energy = document.getElementById("energy");
const target = document.getElementById("target");
const mode = document.getElementById("mode");


let sx = 0;
let sy = 0;

let smoothSize = 1;

let oldSize = 0;

let power = 0;



const hands = new Hands({

locateFile: (file) =>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands: 1,

modelComplexity: 1,

minDetectionConfidence: 0.8,

minTrackingConfidence: 0.8

});



hands.onResults((data)=>{


if(data.multiHandLandmarks &&
data.multiHandLandmarks.length){


let h =
data.multiHandLandmarks[0];


// finger detection

let fingers = 0;


if(h[8].y < h[6].y)
fingers++;


if(h[12].y < h[10].y)
fingers++;


if(h[16].y < h[14].y)
fingers++;


if(h[20].y < h[18].y)
fingers++;


// positions

let palm = h[9];

let wrist = h[0];


let x =
(1-palm.x) * innerWidth;


let y =
palm.y * innerHeight;


// smooth movement

sx += (x-sx)*0.15;

sy += (y-sy)*0.15;



let size =
Math.abs(wrist.y-h[12].y)
*750;



smoothSize +=
(size-smoothSize)*0.15;



// glove

glove.style.display =
"block";


scanner.style.display =
"block";



glove.style.left =
sx-smoothSize/2+"px";


glove.style.top =
sy-smoothSize/1.6+"px";



glove.style.transform =

`scale(${smoothSize/230})`;



// scanner follow


scanner.style.left =
sx-150+"px";


scanner.style.top =
sy-150+"px";



// energy charge


power++;

if(power>100)
power=100;


energy.innerHTML =
"ENERGY "+power+"%";




// gesture modes


if(fingers >= 4){


mode.innerHTML =
"MODE: REPULSOR ⚡";


glove.className="";


target.style.display =
"none";


}



else if(fingers == 0){


mode.innerHTML =
"MODE: ARMOR LOCK 🦾";


target.style.display =
"block";


target.style.left =
sx-100+"px";


target.style.top =
sy-100+"px";


}



else if(fingers == 2){


mode.innerHTML =
"MODE: HOLOGRAM 🔵";


glove.className =
"holo";


target.style.display =
"none";


}



else{


mode.innerHTML =
"MODE: SCANNING";

target.style.display =
"none";

}



// blast when hand comes closer


if(size-oldSize > 12){


blast.style.display =
"block";


blast.style.left =
sx+"px";


blast.style.top =
sy+"px";


blast.style.width =
innerWidth+"px";


}


else{


blast.style.display =
"none";


}



oldSize=size;



}


else{


glove.style.display =
"none";


scanner.style.display =
"none";


blast.style.display =
"none";


target.style.display =
"none";


power=0;


energy.innerHTML =
"ENERGY 0%";


mode.innerHTML =
"MODE: SEARCHING";


}


});



// start camera


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
