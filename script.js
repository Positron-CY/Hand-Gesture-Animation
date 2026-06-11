const video = document.getElementById("video");
const box = document.getElementById("animation");


function animate(type, text){

    box.className = "";

    setTimeout(()=>{

        box.className = type;
        box.innerHTML = text;

    },50);
}



const hands = new Hands({

locateFile:(file)=>{
return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}

});


hands.setOptions({

maxNumHands:1,
minDetectionConfidence:0.7,
minTrackingConfidence:0.7

});



hands.onResults((results)=>{

if(results.multiHandLandmarks.length>0){

let points = results.multiHandLandmarks[0];

let thumb = points[4].y;
let index = points[8].y;
let middle = points[12].y;


// Open palm
if(index < points[6].y && middle < points[10].y){

animate("pulse","🖐️ ENERGY POWER");

}


// Peace sign
else if(index < points[6].y){

animate("spin","✌️ MAGIC SPIN");

}


// Fist
else{

animate("bounce","✊ POWER HIT");

}

}

});



const camera = new Camera(video, {

onFrame: async()=>{

await hands.send({image:video});

},

width:640,
height:480

});


camera.start();