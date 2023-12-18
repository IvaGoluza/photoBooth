export function renderPicture(data) {    // render additional stored pictures real time
    const pictures= document.querySelector('.pictures');
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('picture');

    const image = document.createElement('img');
    image.src = data.imageURL;
    image.alt = 'PhotoBooth Image';
    image.classList.add('photobooth-image');

    const notePara = document.createElement('p');
    if(data.note) notePara.textContent = data.note;
    else notePara.textContent = 'No note :(';

    pictureDiv.appendChild(image);
    pictureDiv.appendChild(notePara);
    pictures.appendChild(pictureDiv);
    
}


function displayPartyPhotos(partyKey) {
    
    db.collection('pictures')
        .where('partyKey', '==', partyKey)
        .get()
        .then((queryRes) => {
            const pictures= document.querySelector('.pictures');
            queryRes.forEach((doc) => {
                const imageURL = doc.data().imageURL;
                const note = doc.data().note;

                const pictureDiv = document.createElement('div');
                pictureDiv.classList.add('picture');

                const image = document.createElement('img');
                image.src = imageURL;
                image.alt = 'PhotoBooth Image';
                image.classList.add('photobooth-image');

                const notePara = document.createElement('p');
                if(note) notePara.textContent = note;
                else notePara.textContent = 'No note :(';

                pictureDiv.appendChild(image);
                pictureDiv.appendChild(notePara);
                pictures.appendChild(pictureDiv);
            });
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        });
}

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const partyKey = params.get('pK');
//displayPartyPhotos(partyKey);
