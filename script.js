const video =
document.getElementById("video");


const glove =
document.getElementById("glove");


const beam =
document.getElementById("beam");



let sx=0;
let sy=0;

let oldSize=0;



const hands =
new Hands({

locateFile:file =>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:1,

minDetectionConfidence:.7,

minTrackingConfidence:.7

});



hands.onResults(result=>{


if(result.multiHandLandmarks &&
result.multiHandLandmarks.length){


let h=result.multiHandLandmarks[0];


let palm=h[9];

let wrist=h[0];



let x=(1-palm.x)*innerWidth;

let y=palm.y*innerHeight;



// smoothing

sx += (x-sx)*0.25;

sy += (y-sy)*0.25;



let size =
Math.abs(wrist.y-h[12].y)*700;



glove.style.display="block";


glove.style.left=
(sx-size/2)+"px";


glove.style.top=
(sy-size/1.8)+"px";


glove.style.transform=

`scale(${size/220})`;




// blast detection


if(size-oldSize>15){


beam.style.display="block";


beam.style.left=sx+"px";

beam.style.top=sy+"px";

beam.style.width=
innerWidth+"px";


}

else{

beam.style.display="none";

}


oldSize=size;


}


else{


glove.style.display="none";

beam.style.display="none";


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
