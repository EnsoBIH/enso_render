const gameview = new GameView();

let mediaRecorder;
const canvasElement = document.querySelector('canvas');
async function uploadBlob(videoBlob, webhook, trigger) {
    const formData = new FormData();
    formData.append('file', videoBlob, 'video.webm');
    try {
        const response = await fetch(webhook, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Failed to upload video: ${response.status} ${response.statusText}`);
        }
        const responseData = await response.json();

        $.post(`https://${GetParentResourceName()}/trigger`, JSON.stringify({
            url: responseData.attachments[0].url,
            trigger: trigger
        }));
    } catch (error) {
        console.error('Failed to upload video:', error.message);
    }
}

function startRecording(webhook, trigger) {
    const gameView = gameview.createGameView(canvasElement);
    const videoStream = canvasElement.captureStream(30);
    const videoChunks = [];
    window.gameView = gameView;
    mediaRecorder = new MediaRecorder(videoStream, { mimeType: 'video/webm;codecs=vp9' });
    mediaRecorder.start();
    mediaRecorder.ondataavailable = (e) => e.data.size > 0 && videoChunks.push(e.data);
    mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        if (videoBlob.size > 0) {
            uploadBlob(videoBlob, webhook, trigger);
        }
    };

}

$(document).ready(function() {

    window.addEventListener("message", function(event) {
        const data = event.data
        const action = data.action

        if (action == 'start') {
            const { time, webhook, trigger } = data.data

            startRecording(webhook, trigger)

            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, time);
        }

    })
})
