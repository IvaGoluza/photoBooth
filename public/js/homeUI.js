import { savePartyName } from './db.js'; 

export function copyText() {
    const partyKeyP = document.querySelector('.partyKey');
    const keyBtn = document.querySelector('.partyKeyBtn');
    const partyNameInput = document.getElementById('partyName');
    const textToCopy = partyKeyP.textContent; 
  
    navigator.clipboard.writeText(textToCopy.split("key: ")[1])
        .then(() => {
          partyKeyP.style.display = 'none'; 
          keyBtn.style.display = 'none'; 
          partyNameInput.value = '';
        })
        .catch((err) => {
          console.error('Error copying text: ', err);
        });  
}

// Get elements from the DOM
const partyNameInput = document.getElementById('partyName');
const getKeyButton = document.getElementById('getKey');

// Event listener for the 'getKey' button click
getKeyButton && getKeyButton.addEventListener('click', async () => {
  const userInput = partyNameInput.value.trim();

  if (userInput !== '') {
    const docID = await savePartyName(userInput);

    if (docID) {
      const partyKeyDisplay = document.createElement('p');
      partyKeyDisplay.textContent = `Invite friends with your party key: ${docID}`;
      partyKeyDisplay.classList.add('partyKey');

      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy party key';
      copyButton.classList.add('partyKeyBtn');
      copyButton.addEventListener('click', copyText);
      partyNameInput.parentNode.appendChild(partyKeyDisplay);
      partyNameInput.parentNode.appendChild(copyButton);
    } else {
      alert('Failed to create party. Please try again.');
    }
  } else {
    alert('Enter a valid party name.');
  }
});

// Event listener for the 'sendKey' button click
const sendKeyButton = document.getElementById('sendKey');
const partyKeyInput = document.getElementById('partyKey');

sendKeyButton && sendKeyButton.addEventListener('click', async () => {
  const partyKey = partyKeyInput.value.trim();
  
  if (partyKey !== '') {
    const partyDoc = await db.collection('party').doc(partyKey).get();
    if (partyDoc.exists) {
      const partyName = partyDoc.data().name;
      window.location.href = `/pages/album.html?pK=${partyKey}`;
    } else {
      alert('Party key does not exist.');
    }
  } else {
    alert('Please enter a party key.');
  }
});