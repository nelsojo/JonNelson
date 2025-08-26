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
  return input?.trim() === deobfuscate(XOR_KEY);
}

// === Submit new signature ===
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  try {
    await db.collection('signatures').add({
      name,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    nameInput.value = '';
  } catch (err) {
    console.error('Error adding signature:', err);
    alert("Failed to add signature. Check console.");
  }
});

// === Live wall (skip soft-deleted) ===
db.collection('signatures').orderBy('timestamp', 'desc')
  .onSnapshot(snapshot => {
    console.log("Snapshot received:", snapshot.docs.map(d => d.data()));

    signaturesList.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();

      // Skip soft-deleted
      if (data.deleted) return;

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
        if (!checkPassword(entered)) {
          alert("Wrong password!");
          return;
        }

        try {
          await db.collection('signatures').doc(doc.id).update({
            deleted: true,
            _pw: deobfuscate(XOR_KEY)
          });
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Delete failed. Check console.");
        }
      });

      li.appendChild(deleteBtn);
      signaturesList.appendChild(li);
    });
  }, err => {
    console.error("Snapshot error:", err);
  });

  
