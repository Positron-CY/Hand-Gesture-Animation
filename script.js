const video = document.getElementById("video");
const box = document.getElementById("animation");

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

    console.log(results);

    if (results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0) {

        box.innerHTML = "🔥 HAND DETECTED 🔥";
        box.style.fontSize = "50px";
        box.style.transform =
        "scale(1.3) rotate(10deg)";

    }

    else {

        box.innerHTML = "Move hand in front ✋";
        box.style.transform = "scale(1)";

    }

});


const camera = new Camera(video, {

    onFrame: async () => {
        await hands.send({image: video});
    },

    width: 640,
    height:480

});


camera.start();
