const form = document.getElementById('signature-form');
const nameInput = document.getElementById('name-input');
const signaturesList = document.getElementById('signatures-list');


const obfuscated = [89, 75, 65, 95, 64, 69]; 
const XOR_KEY = 42;

function deobfuscate(key) {
  return String.fromCharCode(...obfuscated.map(c => c ^ key));
}

console.log("Decoded password:", deobfuscate(XOR_KEY)); // Should log: sakujo

function checkPassword(input) {
  if (!input) return false;
  return input.trim() === deobfuscate(XOR_KEY);
}


// Submit signature to Firestore
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  db.collection('signatures').add({
    name: name,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    nameInput.value = '';
  }).catch(err => {
    console.error('Error adding signature:', err);
  });
});

// Real-time listener for signatures collection
db.collection('signatures').orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => {
    signaturesList.innerHTML = ''; // Clear current list
    snapshot.forEach(doc => {
      const li = document.createElement('li');
      li.classList.add('signature-item');
      li.textContent = doc.data().name;

      // Add delete button (hidden until hover)
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.title = "Delete";

      deleteBtn.addEventListener('click', () => {
        const entered = prompt("Enter admin password (can you find it?) to delete:");
        //alert(`You entered: "${entered}"\nExpected: "${deobfuscate(XOR_KEY)}"`);
        if (checkPassword(entered)) {
          db.collection('signatures').doc(doc.id).delete();
        } else {
          alert("Wrong password!");
        }
      });

      li.appendChild(deleteBtn);
      signaturesList.appendChild(li);
    });
  });
