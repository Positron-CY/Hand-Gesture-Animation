const video = document.getElementById("video");
const box = document.getElementById("animation");

function animate(type, text) {
    box.className = type;
    box.innerHTML = text;
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});


hands.onResults((results) => {

    if (results.multiHandLandmarks && 
        results.multiHandLandmarks.length > 0) {

        let hand = results.multiHandLandmarks[0];

        let indexTip = hand[8].y;
        let indexBase = hand[6].y;

        let middleTip = hand[12].y;
        let middleBase = hand[10].y;


        if (indexTip < indexBase && middleTip < middleBase) {

            animate(
            "pulse",
            "🖐️ ENERGY BLAST"
            );

        } 
        
        else if (indexTip < indexBase) {

            animate(
            "spin",
            "✌️ MAGIC SPIN"
            );

        } 
        
        else {

            animate(
            "bounce",
            "✊ SUPER PUNCH"
            );

        }

    } else {

        box.innerHTML = "Show your hand ✋";

    }

});


const camera = new Camera(video, {

    onFrame: async () => {

        await hands.send({
            image: video
        });

    },

    width: 640,
    height: 480

});


camera.start();
