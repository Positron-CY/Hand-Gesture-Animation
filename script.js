const video = document.getElementById("video");
const box = document.getElementById("animation");

function show(text, effect){
    box.innerHTML = text;
    box.className = effect;
}


const hands = new Hands({
    locateFile:(file)=>{
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});


hands.setOptions({
    maxNumHands:1,
    modelComplexity:1,
    minDetectionConfidence:0.5,
    minTrackingConfidence:0.5
});


hands.onResults((results)=>{

if(results.multiHandLandmarks &&
results.multiHandLandmarks.length>0){

let h = results.multiHandLandmarks[0];

let fingers = 0;


// index
if(h[8].y < h[6].y) fingers++;

// middle
if(h[12].y < h[10].y) fingers++;

// ring
if(h[16].y < h[14].y) fingers++;

// pinky
if(h[20].y < h[18].y) fingers++;


if(fingers >= 4){

show("🖐️ ENERGY BLAST ⚡","pulse");

}

else if(fingers == 2){

show("✌️ MAGIC PORTAL 🌀","spin");

}

else if(fingers == 1){

show("☝️ LASER BEAM 🔥","bounce");

}

else{

show("✊ POWER PUNCH 💥","bounce");

}


}

else{

box.innerHTML="Show hand ✋";

}

});


const camera = new Camera(video,{
    
onFrame:async()=>{
await hands.send({image:video});
},

width:640,
height:480

});


camera.start();
