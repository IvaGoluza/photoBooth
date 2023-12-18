import { renderPicture } from "./albumDisplay.js";

// ACCESS DATA OFFLINE 
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'unimplemented') {
      console.log('persistance not available for this browser');
    }else{console.log(err)}
});



// real-time listener for album photos
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const partyKey = params.get('pK');


partyKey && db.collection('pictures').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type === 'added' && change.doc.data().partyKey === partyKey){
        renderPicture(change.doc.data());
      }
    });
});



// function to save party name to Firestore
export const savePartyName = async (partyName) => {
  try {
    const partyCollection = db.collection('party');
    const docRef = await partyCollection.add({ name: partyName });
    return docRef.id;
  } catch (error) {
    console.error('Error saving party name:', error);
    return null;
  }
};



// function to save a party picture (image, note, partyKey)
export const savePartyImage = async (imageDataURL, note, partyKey) => {
    const blobPromise = fetch(imageDataURL).then(res => res.blob());  // a blob from the data URL to save

    // filename 
    const timestamp = Date.now();
    const randomID = Math.random().toString(36).substring(2, 8); 
    const filename = `photo-${timestamp}-${randomID}.jpg`; 

    // upload Blob to Firebase Storage
    blobPromise.then(blob => {
        const uploadTask = storageRef.child('images/' + filename).put(blob);

        // getting downloadURL after the image is uploaded
        uploadTask.then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
            db.collection('pictures').add({    // save document to Firestore with image URL, note and partyKey
                imageURL: downloadURL,
                note: note,
                partyKey: partyKey,
            }).then(() => {
                console.log('Data saved to Firestore');
            }).catch(error => {
                console.error('Error saving data:', error);
            });
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
    }).catch(error => {
        console.error('Error creating Blob:', error);
    });
};




