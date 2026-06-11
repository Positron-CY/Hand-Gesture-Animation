const video =
document.getElementById("video");

const rep =
document.getElementById("repulsor");


const hands =
new Hands({

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


let hand =
results.multiHandLandmarks[0];


// palm position
let palm = hand[9];


rep.style.display="block";


let x =
(1-palm.x)*window.innerWidth;

let y =
palm.y*window.innerHeight;


rep.style.left =
(x-60)+"px";

rep.style.top =
(y-60)+"px";


}

else{

rep.style.display="none";

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
