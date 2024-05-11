import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: 'AIzaSyCOgAUgsl-fy02IVYVMO2cO8UCzJWQLygY',
  authDomain: 'ridemate-7d7f7.firebaseapp.com',
  projectId: 'ridemate-7d7f7',
  storageBucket: 'ridemate-7d7f7.appspot.com',
  messagingSenderId: '701088545317',
  appId: '1:701088545317:android:861041c2d3f6072f799dcc'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const driverCollection = collection(db, 'drivers');
const usersCollection = collection(db, 'googleusers');

// Function to get count of documents in a collection
async function getCount(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  return snapshot.size;
}

// Function to update the HTML with counts
async function updateCounts() {
  try {
    // Get counts of documents in collections
    const driverCount = await getCount(driverCollection);
    const usersCount = await getCount(usersCollection);

    // Update HTML elements with counts
    document.getElementById('driverCount').innerText = driverCount.toString();
    document.getElementById('usersCount').innerText = usersCount.toString();
  } catch (error) {
    console.error('Error getting counts:', error);
  }
}

// Call the function to update counts on page load
updateCounts();

// Function to get data from the "googleusers" collection
async function getUserData() {
  try {
    // Get snapshot of documents in "googleusers" collection
    const snapshot = await getDocs(usersCollection);
    const tableBody = document.getElementById('userTableBody');

    snapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.Email;
      const gender = data.Gender;
      const username = data.Username;
      const role = data.role;

      // Create a new row for each user
      const row = document.createElement('tr');

      // Create and populate cells with user data
      const emailCell = document.createElement('td');
      emailCell.textContent = email;

      const genderCell = document.createElement('td');
      genderCell.textContent = gender;

      const usernameCell = document.createElement('td');
      usernameCell.textContent = username;

      const roleCell = document.createElement('td');
      roleCell.textContent = role;

      // Append cells to the row
      row.appendChild(emailCell);
      row.appendChild(genderCell);
      row.appendChild(usernameCell);
      row.appendChild(roleCell);

      // Append the row to the table body
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Call the function to fetch user data and update HTML on page load
getUserData();
