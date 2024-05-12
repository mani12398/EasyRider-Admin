import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, query, where, getDocs, collection, setDoc, doc, updateDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
window.addEventListener('popstate', function(event) {
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
window.addEventListener('unload', function() {
  history.replaceState(null, null, window.location.href);
});

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
const username = getUrlParameter('username');
document.getElementById('username-display').textContent = username;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');
  const emailElement = document.getElementById('username-display1');
  emailElement.textContent = email;
});



document.getElementById('file-input').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
      profileImage.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
  const emailDisplay = document.getElementById('username-display1');
  if (emailDisplay) {
    const email = emailDisplay.textContent.trim(); 
    const storageRef = ref(storage, 'profile_images/' + email + '/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', 
      function(snapshot) {
      }, 
      function(error) {
        console.error('Upload error:', error);
      }, 
      function() {
        getDownloadURL(uploadTask.snapshot.ref).then(function(downloadURL) {
          const queryRef = query(collection(db, "admins"), where("email", "==", email));
          getDocs(queryRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              updateDoc(doc.ref, { profileImageUrl: downloadURL })
                .then(() => {
                  console.log("Document successfully updated!");
                  const profileImage = document.getElementById('profile-image');
                  if (profileImage) {
                    profileImage.src = downloadURL;
                  }
                  alert('Profile image updated successfully!');
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
        });
      }
    );
  }
});
document.getElementById('profile-image').addEventListener('click', function() {
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.click(); 
  }
});


/*function displayProfileImage(email) {
  try {
    const adminsRef = collection(db, 'admins');
    console.log("Admins reference:", adminsRef); // Log adminsRef to ensure it's correctly initialized
    const query = where(adminsRef, 'email', '==', email);
    getDocs(query)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Document data:", data);
          const profileImageUrl = data.profileImageUrl;
          if (profileImageUrl) {
            const profileImage = document.getElementById('profile-image');
            if (profileImage) {
              profileImage.src = profileImageUrl;
            }
          } else {
            console.error('Profile image URL not found in Firestore for email:', email);
          }
        });
      })
      .catch((error) => {
        console.error('Error querying admins collection:', error);
      });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Trigger the function to retrieve email from Firestore and display the profile image when the page loads
window.onload = function() {
  const emailDisplay = document.getElementById('username-display1');
  if (emailDisplay) {
    const email = emailDisplay.textContent.trim(); // Assuming textContent contains the email
    displayProfileImage(email);
  }
};*/




/*const docRef = doc(db, "admins", "admin_01");
const getProfilePicUrl = async () => {
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const profilePicUrl = docSnap.data().profileImageUrl;
            console.log("Profile Picture URL:", profilePicUrl); // Log the URL
            return profilePicUrl;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.log("Error getting document:", error);
        return null;
    }
};
const displayProfilePic = async () => {
    const profilePicUrl = await getProfilePicUrl();
    if (profilePicUrl) {
        console.log("Setting profile picture URL:", profilePicUrl);
        const profilePicImg = document.getElementById("profile-image");
        profilePicImg.src = profilePicUrl;
    }
};
displayProfilePic();*/
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    //const username = urlParams.get('username');

const getProfilePicUrl = async (email) => {
  try {
    const queryRef = query(collection(db, "admins"), where("email", "==", email));
    console.log("Query:", queryRef);
    const querySnapshot = await getDocs(queryRef);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        console.log("Document data:", doc.data());
      });
      const docSnap = querySnapshot.docs[0];
      const profilePicUrl = docSnap.data().profileImageUrl;
      console.log("Profile Picture URL:", profilePicUrl); // Log the URL
      return profilePicUrl;
    } else {
      console.log("No such document found for email:", email);
      return null;
    }
  } catch (error) {
    console.log("Error querying admins collection:", error);
    return null;
  }
};
const displayProfilePic = async () => {
  const profilePicUrl = await getProfilePicUrl(email);
  if (profilePicUrl) {
    const profilePicImg = document.getElementById("profile-image");
    profilePicImg.src = profilePicUrl;
  }
};

// Call displayProfilePic when the dashboard.html page loads
window.onload = displayProfilePic;