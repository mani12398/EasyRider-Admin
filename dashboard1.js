import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, where, getDocs, collection, setDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
const storage = getStorage(app);


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
function signOutUser() {
  auth.signOut().then(() => {
    console.log("User signed out successfully");
    redirectToSignIn();
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}
function checkAuthAndRedirect() {
  const user = auth.currentUser;
  if (!user) {
    redirectToSignIn();
  }
}
onAuthStateChanged(auth, (user) => {
  if (!user) {
    redirectToSignIn();
  }
});
window.addEventListener('popstate', function (event) {
  checkAuthAndRedirect();
});
document.addEventListener('DOMContentLoaded', function () {
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  } else {
    console.error("Sign out button not found in the document.");
  }
});
window.addEventListener('unload', function () {
  history.replaceState(null, null, window.location.href);
});
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOM fully loaded and parsed');

 
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

 
  function setStoredValue(key, value) {
    localStorage.setItem(key, value);
    console.log(`Stored ${key}:`, value);
  }

  
  function getStoredValue(key) {
    const value = localStorage.getItem(key);
    console.log(`Retrieved ${key}:`, value);
    return value;
  }

  function updateDisplayedUserData(email, username) {
    console.log('Updating displayed user data with:', { email, username });
    document.getElementById('username-display').textContent = username;
    document.getElementById('useremail-display').textContent = email;
  }


  const emailFromUrl = getUrlParameter('email');
  const usernameFromUrl = getUrlParameter('username');

  console.log('Email from URL:', emailFromUrl);
  console.log('Username from URL:', usernameFromUrl);

  
  if (emailFromUrl && usernameFromUrl) {
    setStoredValue('email', emailFromUrl);
    setStoredValue('username', usernameFromUrl);
    updateDisplayedUserData(emailFromUrl, usernameFromUrl);
  } else {
    console.error('Email or username not found in URL parameters.');
  }

 
  const getProfilePicUrl = async (email) => {
    try {
      console.log('Querying Firestore for email:', email);
      const queryRef = query(collection(db, "admins"), where("email", "==", email));
      const querySnapshot = await getDocs(queryRef);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const profilePicUrl = docSnap.data().profileImageUrl;
        console.log("Profile Picture URL:", profilePicUrl);
        return profilePicUrl;
      } else {
        console.log("No document found for email:", email);
        return null;
      }
    } catch (error) {
      console.log("Error querying admins collection:", error);
      return null;
    }
  };

 
  const displayProfilePic = async () => {
    const storedEmail = getStoredValue('email');
    if (storedEmail) {
      const profilePicUrl = await getProfilePicUrl(storedEmail);
      if (profilePicUrl) {
        const profilePicImg = document.getElementById("profile-image");
        profilePicImg.src = profilePicUrl;
        console.log("Profile picture set to:", profilePicUrl);
      } else {
        console.log("No profile picture URL found.");
      }
    }
  };

  
  window.onload = function () {
    console.log('Window loaded');
    const storedUsername = getStoredValue('username');
    const storedEmail = getStoredValue('email');
    if (storedUsername && storedEmail) {
      updateDisplayedUserData(storedEmail, storedUsername);
      displayProfilePic();
    }
  };


  const storedUsername = getStoredValue('username');
  const storedEmail = getStoredValue('email');
  console.log('Stored username:', storedUsername);
  console.log('Stored email:', storedEmail);
});


document.getElementById('file-input').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function (e) {
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
      profileImage.src = e.target.result;
      console.log("Local profile image preview set to:", e.target.result);
    }
  };
  
  reader.readAsDataURL(file);
  
  const emailDisplay = document.getElementById('useremail-display');
  if (emailDisplay) {
    const email = emailDisplay.textContent.trim();
    const storageRef = ref(storage, 'profile_images/' + email + '/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed',
      function (snapshot) {
        
      },
      function (error) {
        console.error('Upload error:', error);
      },
      function () {
        getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
          console.log("Download URL for uploaded image:", downloadURL);
          const queryRef = query(collection(db, "admins"), where("email", "==", email));
          
          getDocs(queryRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              updateDoc(doc.ref, { profileImageUrl: downloadURL })
                .then(() => {
                  console.log("Document successfully updated!");
                  const profileImage = document.getElementById('profile-image');
                  if (profileImage) {
                    profileImage.src = downloadURL;
                    console.log("Profile image updated to URL:", downloadURL);
                  }
                  Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile image updated successfully!',
                    confirmButtonColor: '#edae10', 
                    customClass: {
                      confirmButton: 'swal-confirm-button', 
                    },
                    willOpen: () => {
                      const confirmButton = document.querySelector('.swal-confirm-button');
                      if (confirmButton) {
                        confirmButton.style.borderColor = '#edae10'; 
                        confirmButton.style.backgroundColor = '#edae10'; 
                        confirmButton.style.color = '#000'; 
                      }
                    }
                  });
                  
                })
                .catch((error) => {
                  console.error('Error updating profile image:', error);
                  alert('Error updating profile image: ' + error.message);
                });
            });
          }).catch((error) => {
            console.error('Error querying document:', error);
            alert('Error querying document: ' + error.message);
          });
        }).catch((error) => {
          console.error('Error getting download URL:', error);
        });
      }
    );
  }
});

document.getElementById('profile-image').addEventListener('click', function () {
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.click();
  }
});
