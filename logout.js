import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: 'AIzaSyCOgAUgsl-fy02IVYVMO2cO8UCzJWQLygY',
  authDomain: 'ridemate-7d7f7.firebaseapp.com',
  projectId: 'ridemate-7d7f7',
  storageBucket: 'ridemate-7d7f7.appspot.com',
  messagingSenderId: '701088545317',
  appId: '1:701088545317:android:861041c2d3f6072f799dcc'
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const driverCollection = collection(db, 'drivers');
const usersCollection = collection(db, 'googleusers');
async function getCount(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  return snapshot.size;
}
async function updateCounts() {
  try {
    const driverCount = await getCount(driverCollection);
    const usersCount = await getCount(usersCollection);
    document.getElementById('driverCount').innerText = driverCount.toString();
    document.getElementById('usersCount').innerText = usersCount.toString();
  } catch (error) {
    console.error('Error getting counts:', error);
  }
}
updateCounts();
async function getUserData() {
  try {
    const snapshot = await getDocs(usersCollection);
    const tableBody = document.getElementById('userTableBody');
    snapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.Email;
      const gender = data.Gender;
      const username = data.Username;
      const role = data.role;
      const row = document.createElement('tr');
      const emailCell = document.createElement('td');
      emailCell.textContent = email;
      const genderCell = document.createElement('td');
      genderCell.textContent = gender;
      const usernameCell = document.createElement('td');
      usernameCell.textContent = username;
      const roleCell = document.createElement('td');
      roleCell.textContent = role;
      row.appendChild(emailCell);
      row.appendChild(genderCell);
      row.appendChild(usernameCell);
      row.appendChild(roleCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
getUserData();
function redirectToSignIn() {
  window.location.href = 'index.html';
}
onAuthStateChanged(auth, (user) => {
  if (!user) {

    redirectToSignIn();
  }
});
function signOutUser() {
  auth.signOut().then(() => {
    console.log("User signed out successfully");
    redirectToSignIn();
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}
document.addEventListener('DOMContentLoaded', function () {
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  } else {
    console.error("Sign out button not found in the document.");
  }
});