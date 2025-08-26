const form = document.getElementById('signature-form');
const nameInput = document.getElementById('name-input');
const signaturesList = document.getElementById('signatures-list');

// === Secret puzzle ===
const obfuscated = [89, 75, 65, 95, 64, 69]; 
const XOR_KEY = 42;
function deobfuscate(key) {
  return String.fromCharCode(...obfuscated.map(c => c ^ key));
}
function checkPassword(input) {
  if (!input) return false;
  return input.trim() === deobfuscate(XOR_KEY);
}
// console.log("Decoded password:", deobfuscate(XOR_KEY)); // (leave or remove)

// === Create signature ===
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

// === Live list (skip soft-deleted) ===
db.collection('signatures').orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => {
    signaturesList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();

      // Skip soft-deleted docs
      if (data.deleted === true) return;

      const li = document.createElement('li');
      li.classList.add('signature-item');
      li.textContent = data.name;

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.title = "Delete";

      deleteBtn.addEventListener('click', async () => {
        const entered = prompt("Enter admin password (can you find it?) to delete:");
        if (checkPassword(entered)) {
          try {
            // SOFT DELETE: requires password per Firestore rules
            await db.collection('signatures').doc(doc.id).update({
              deleted: true,
              _pw: deobfuscate(XOR_KEY)
            });
            // Optional UX: toast or silent
            // alert("Deleted.");
          } catch (err) {
            console.error("Delete (soft) failed:", err);
            alert("Delete failed. Check console.");
          }
        } else {
          alert("Wrong password!");
        }
      });

      li.appendChild(deleteBtn);
      signaturesList.appendChild(li);
    });
  });
