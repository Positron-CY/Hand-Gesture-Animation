const video =
document.getElementById("video");

const rep =
document.getElementById("repulsor");

const beam =
document.getElementById("beam");


let lastSize = 0;


const hands = new Hands({

locateFile:(file)=>{

return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

}

});


hands.setOptions({

maxNumHands:1,
modelComplexity:1,
minDetectionConfidence:.7,
minTrackingConfidence:.7

});



hands.onResults((results)=>{


if(results.multiHandLandmarks &&
results.multiHandLandmarks.length>0){


let h =
results.multiHandLandmarks[0];


let palm = h[9];


let x =
(1-palm.x)*innerWidth;

let y =
palm.y*innerHeight;


rep.style.display="block";

rep.style.left=(x-60)+"px";
rep.style.top=(y-60)+"px";


// hand size detector

let size =
Math.abs(h[0].y-h[12].y);


// hand coming closer = fire

if(size-lastSize>0.03){


beam.style.display="block";

beam.style.left=x+"px";

beam.style.top=y+"px";

beam.style.width=
innerWidth+"px";


// shock ring

let shock =
document.createElement("div");

shock.className="shock";

shock.style.left=
(x-100)+"px";

shock.style.top=
(y-100)+"px";


document.body.appendChild(shock);


setTimeout(()=>{

shock.remove();

},500);


}

else{

beam.style.display="none";

}


lastSize=size;


}

else{

rep.style.display="none";

beam.style.display="none";

}


});



const camera =
new Camera(video,{

onFrame:async()=>{

await hands.send({image:video});

},

width:1280,
height:720

});


camera.start();
