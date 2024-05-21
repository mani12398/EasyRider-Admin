/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: 'AIzaSyCOgAUgsl-fy02IVYVMO2cO8UCzJWQLygY',
    authDomain: 'ridemate-7d7f7.firebaseapp.com',
    projectId: 'ridemate-7d7f7',
    storageBucket: 'ridemate-7d7f7.appspot.com',
    messagingSenderId: '701088545317',
    appId: '1:701088545317:android:861041c2d3f6072f799dcc',

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getStorage(app);





let chartData = {
    labels: ['Google Users', 'Drivers', 'Mobile Users'],
    datasets: [{
        data: [],
        backgroundColor: ['#be2490', '#7868e6', '#ffc107'],
        hoverBorderWidth: 2,
        hoverBorderColor: '#000',
        fontWeight: 'bold'
    }]
};

// Function to update chart with new data
function updateChart(googleUsersCount, driversCount, mobileUsersCount) {
    chartData.datasets[0].data = [googleUsersCount, driversCount, mobileUsersCount];
    chart.update();
}

// Function to fetch data from Firebase
function fetchDataFromFirebase() {
    const googleUsersRef = collection(firestore, 'googleUsers');
    const driversRef = collection(firestore, 'drivers');
    const mobileUsersRef = collection(firestore, 'mobileUsers');
  
    // Get counts for each collection
    const googleUsersCountPromise = getDocs(googleUsersRef).then(querySnapshot => querySnapshot.size);
    const driversCountPromise = getDocs(driversRef).then(querySnapshot => querySnapshot.size);
    const mobileUsersCountPromise = getDocs(mobileUsersRef).then(querySnapshot => querySnapshot.size);
  
    // Wait for all promises to resolve
    Promise.all([googleUsersCountPromise, driversCountPromise, mobileUsersCountPromise])
      .then(counts => {
        const [googleUsersCount, driversCount, mobileUsersCount] = counts;
        // Update the chart with fetched data
        updateChart(googleUsersCount, driversCount, mobileUsersCount);
      })
      .catch(error => {
        console.error("Error getting document counts:", error);
      });
}

// Execute when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get the reference to your chart canvas
    let ctx = document.getElementById('myChart').getContext('2d');
    
    // Create new chart
    let chart = new Chart(ctx, {
        type: 'pie',
        data: chartData
    });
    
    // Call the function to initially fetch and update data
    fetchDataFromFirebase();
});*/