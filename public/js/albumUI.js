import { savePartyImage } from './db.js'; 

// camera functionality

document.getElementById('takePhotoButton').addEventListener('click', function() {
    const popup = document.getElementById('popup-wrapper');

    if (!("mediaDevices" in navigator)) {   // FALLBACK if there is no mediaDevice

        FileUpload();

    } else {       // USE CAMERA

        popup.style.display = 'flex';
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('capturedCanvas');
        const captureButton = document.getElementById('captureButton');
        const retakeButton = document.getElementById('retakeButton');
        const noteInput = document.getElementById('noteInput');
        const saveButton = document.getElementById('saveButton');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.style.display = 'block';
                video.srcObject = stream;
                captureButton.style.display = 'block';
            })
            .catch(function(err) {   // FALLBACK
                popup.style.display = 'none';
                FileUpload();
            });

        captureButton.addEventListener('click', function() {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            video.style.display = 'none';
            canvas.style.display = 'block';
            retakeButton.style.display = 'block';
            noteInput.style.display = 'block';
            saveButton.style.display = 'block';
            captureButton.style.display = 'none';
        });

        retakeButton.addEventListener('click', function() {
            video.style.display = 'block';
            canvas.style.display = 'none';
            retakeButton.style.display = 'none';
            noteInput.style.display = 'none';
            saveButton.style.display = 'none';
            captureButton.style.display = 'block';
        });

        document.querySelector('.close-btn').addEventListener('click', function() {
            const popup = document.getElementById('popup-wrapper');
            const canvas = document.getElementById('capturedCanvas');
            const retakeButton = document.getElementById('retakeButton');
            const noteInput = document.getElementById('noteInput');
            const saveButton = document.getElementById('saveButton');
            if(canvas && retakeButton && noteInput && saveButton) {
            canvas.style.display = 'none';   // making sure that afterPicture elements are not displayed next time
            retakeButton.style.display = 'none'; 
            noteInput.value = '';
            noteInput.style.display = 'none';
            saveButton.style.display = 'none';
            popup.style.display = 'none';  
            }
            const video = document.getElementById('cameraFeed');
            const stream = video.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        });

        let saveButtonClicked = false;
        saveButton.addEventListener('click', function() {
            if (!saveButtonClicked) {
                saveButtonClicked = true;
                const note = noteInput.value;
                const imageDataURL = canvas.toDataURL('image/png');
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                const partyKey = params.get('pK');

                savePartyImage(imageDataURL, note, partyKey).then(() => {

                    canvas.style.display = 'none';   // making sure that afterPicture elements are not displayed next time
                    retakeButton.style.display = 'none'; 
                    noteInput.value = '';
                    noteInput.style.display = 'none';
                    saveButton.style.display = 'none';
                    popup.style.display = 'none'; 
                    const stream = video.srcObject;
                    if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                    }
                })
            }
        });
    } 
});


function FileUpload() {       // FALLBACK handler
    document.getElementById('popup-wrapper-file').style.display = 'flex';     
    
    document.querySelector('.close-btn-file').addEventListener('click', function() {
        document.getElementById('popup-wrapper-file').style.display = 'none';
    });

    document.getElementById('saveButton-file').addEventListener('click', function() {
        const noteInput = document.getElementById('noteInput-file');
        const note = noteInput.value;
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const partyKey = params.get('pK');
        let imageDataURL; 
        const fileInput = document.getElementById('choose');
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
               imageDataURL = e.target.result;
               savePartyImage(imageDataURL, note, partyKey).then(() => {
                   noteInput.value = '';
                   noteInput.style.display = 'none';
                   document.getElementById('popup-wrapper-file').style.display = 'none'
               }).catch(error => {
                   console.error('Error saving image:', error);
               });
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            console.log('No files choosen.')
        }
    });
}