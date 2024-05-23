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

const usersmobCollection = collection(db, 'mobileusers');
const companyprofit1 = collection(db, 'companyprofit');
const driverCollection = collection(db, 'drivers');
const usersCollection = collection(db, 'googleusers');
const totalearnings = collection(db, 'RideRequest');
async function getCount(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  return snapshot.size;
}
async function getTotalCount(collectionRef1, collectionRef2) {
  const [count1, count2] = await Promise.all([
    getCount(collectionRef1),
    getCount(collectionRef2)
  ]);

  return count1 + count2;
}
getTotalCount(usersmobCollection, usersCollection)
  .then(totalCount => {
    console.log(`Total count of documents: ${totalCount}`);
  })
  .catch(error => {
    console.error("Error getting document counts:", error);
  });
async function getTotalEarnings(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  let totalEarnings = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.driverearnings) {
      const ridefare = parseFloat(data.driverearnings);
      totalEarnings += ridefare;
      console.log(`Adding ridefare: ${ridefare} PKR, Total so far: ${totalEarnings} PKR`);
    }
  });
  console.log(`Final total earnings: ${totalEarnings} PKR`);
  return totalEarnings;
}


/*async function getTotalEarnings1(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  let totalEarnings = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.chargedprofit && Array.isArray(data.chargedprofit)) {
      data.chargedprofit.forEach((profit) => {
        if (profit.companyprofit) {
          const ridefare = parseFloat(profit.companyprofit);
          totalEarnings += ridefare;
          console.log(`Adding ridefare: ${ridefare} PKR, Total so far: ${totalEarnings} PKR`);
        }
      });
    }
  });

  console.log(`Final total earnings: ${totalEarnings} PKR`);
  return totalEarnings;
}*/

async function getTotalEarnings1(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  let totalEarnings = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.chargedprofit && Array.isArray(data.chargedprofit)) {
      data.chargedprofit.forEach((profit) => {
        if (profit.companyprofit && profit.paystatus) {
          if (profit.paystatus === 'paid') {
            const ridefare = parseFloat(profit.companyprofit);
            totalEarnings += ridefare;
            console.log(`Adding ridefare: ${ridefare} PKR, Total so far: ${totalEarnings} PKR`);
          } else if (profit.paystatus === 'unpaid') {
            console.log(`Skipping unpaid ridefare: ${parseFloat(profit.companyprofit)} PKR`);
          }
        }
      });
    }
  });

  console.log(`Final total earnings: ${totalEarnings} PKR`);
  return totalEarnings;
}

async function updateCounts() {
  try {
    const driverCount = await getCount(driverCollection);
    const usersCount = await getCount(usersCollection);
    const totalEarnings = await getTotalEarnings(driverCollection);
    const compprof = await getTotalEarnings1(companyprofit1);
    const totalusercount = await getTotalCount(usersmobCollection, usersCollection)
    document.getElementById('driverCount').innerText = driverCount.toString();
    document.getElementById('usersCount').innerText = totalusercount.toString();
    document.getElementById('totalEarnings').innerText = `${totalEarnings} PKR`;
    document.getElementById('companyprofit').innerText = `${compprof} PKR`;
  } catch (error) {
    console.error('Error getting counts:', error);
  }
}
updateCounts();

async function getUserData() {
  try {
    const snapshot = await getDocs(usersCollection);
    const tableBody = document.getElementById('userTableBody');

    // Clear the table body to avoid duplicate entries if this function is called multiple times
    tableBody.innerHTML = '';

    snapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.Email;
      const gender = data.Gender;
      const username = data.Username;
      let role = data.role;
      const phoneno = data.mobileno;
      const profileImage = data.Profileimage;


      // Log data to check values
      console.log('User Data:', { email, gender, username, role, phoneno, profileImage });

      const row = document.createElement('tr');

      const emailCell = document.createElement('td');
      emailCell.textContent = email;
      row.appendChild(emailCell);

      const genderCell = document.createElement('td');
      genderCell.textContent = gender;
      row.appendChild(genderCell);

      const usernameCell = document.createElement('td');
      usernameCell.textContent = username;
      row.appendChild(usernameCell);

      const roleCell = document.createElement('td');
      roleCell.textContent = role;
      row.appendChild(roleCell);

      const phoneCell = document.createElement('td');
      phoneCell.textContent = phoneno;
      row.appendChild(phoneCell);

      const imageCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = profileImage || 'images/profile.png'; // Use a default image if profileImage is missing
      img.alt = `${email}'s profile image`;
      img.onerror = () => {
        console.error('Image load error for:', profileImage); // Log error if image fails to load
        img.src = 'images/profile.png'; // Fallback image if the image fails to load
      };

      // Add the 'zoomable' class to the image
      img.classList.add('zoomable');

      // Add a click event listener to the image
      img.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.alt = this.alt;

        modal.appendChild(modalImg);

        // Close the modal when clicked outside the image
        modal.addEventListener('click', function (event) {
          if (event.target === modal) {
            modal.remove();
          }
        });

        document.body.appendChild(modal);
      });

      imageCell.appendChild(img);
      row.appendChild(imageCell);

      // Button to update role
      /*const buttonCell = document.createElement('td');
      const updateButton = document.createElement('button');
      updateButton.textContent = role === 'Driver' ? 'Driver' : 'User';
      updateButton.classList.add('button');
      updateButton.classList.add(role === 'Driver' ? 'button-driver' : 'button-user');
      updateButton.addEventListener('click', async () => {
        try {
          // Toggle between "driver" and "user"
          role = role === 'User' ? 'Driver' : 'User';
          await updateDoc(doc.ref, { role });

          // Update the displayed role in the table
          roleCell.textContent = role;

          // Update button text and style based on role
          updateButton.textContent = role === 'Driver' ? 'Driver' : 'User';
          updateButton.classList.remove('button-driver', 'button-user');
          updateButton.classList.add(role === 'Driver' ? 'button-driver' : 'button-user');
        } catch (error) {
          console.error('Error updating role:', error);
        }
      });
      buttonCell.appendChild(updateButton);
      row.appendChild(buttonCell);*/

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

document.addEventListener('DOMContentLoaded', function () {
  const img = document.querySelector('.zoomable');

  img.addEventListener('click', function () {
    const container = document.createElement('div');
    container.classList.add('image-container');
    container.appendChild(img.cloneNode(true)); // Clone the clicked image
    document.body.appendChild(container);

    // Add event listener to remove the zoomed image on click outside
    container.addEventListener('click', function (event) {
      if (event.target === container) {
        container.remove();
      }
    });

    // Add class to zoom in the image
    container.querySelector('img').classList.add('zoomed');
  });
});



async function getUserDatamob() {
  try {
    const snapshot = await getDocs(usersmobCollection);
    const tableBody = document.getElementById('userTableBody1');

    // Clear the table body to avoid duplicate entries if this function is called multiple times
    tableBody.innerHTML = '';

    snapshot.forEach((doc) => {
      const data = doc.data();
      const phoneNumber1 = data.phoneNumber;
      const gender = data.Gender;
      const username = data.Username;
      let role = data.role;
      const email = data.email;
      const profileImage = data.Profileimage;


      // Log data to check values
      console.log('User Data:', { phoneNumber1, gender, username, role, profileImage });

      const row = document.createElement('tr');

      const emailCell = document.createElement('td');
      emailCell.textContent = phoneNumber1;
      row.appendChild(emailCell);

      const genderCell = document.createElement('td');
      genderCell.textContent = gender;
      row.appendChild(genderCell);

      const usernameCell = document.createElement('td');
      usernameCell.textContent = username;
      row.appendChild(usernameCell);

      const roleCell = document.createElement('td');
      roleCell.textContent = role;
      row.appendChild(roleCell);

      const email1Cell = document.createElement('td');
      email1Cell.textContent = email;
      row.appendChild(email1Cell);

      const imageCell = document.createElement('td');
      const img = document.createElement('img');
      img.src = profileImage || 'images/profile.png'; // Use a default image if profileImage is missing
      img.alt = `${phoneNumber1}'s profile image`;
      img.onerror = () => {
        console.error('Image load error for:', profileImage); // Log error if image fails to load
        img.src = 'images/profile.png'; // Fallback image if the image fails to load
      };

      // Add the 'zoomable' class to the image
      img.classList.add('zoomable');

      // Add a click event listener to the image
      img.addEventListener('click', function () {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.alt = this.alt;

        modal.appendChild(modalImg);

        // Close the modal when clicked outside the image
        modal.addEventListener('click', function (event) {
          if (event.target === modal) {
            modal.remove();
          }
        });

        document.body.appendChild(modal);
      });

      imageCell.appendChild(img);
      row.appendChild(imageCell);

      // Button to update role
      /*const buttonCell = document.createElement('td');
      const updateButton = document.createElement('button');
      updateButton.textContent = role === 'Driver' ? 'Driver' : 'User';
      updateButton.classList.add('button');
      updateButton.classList.add(role === 'Driver' ? 'button-driver' : 'button-user');
      updateButton.addEventListener('click', async () => {
        try {
          // Toggle between "driver" and "user"
          role = role === 'User' ? 'Driver' : 'User';
          await updateDoc(doc.ref, { role });

          // Update the displayed role in the table
          roleCell.textContent = role;

          // Update button text and style based on role
          updateButton.textContent = role === 'Driver' ? 'Driver' : 'User';
          updateButton.classList.remove('button-driver', 'button-user');
          updateButton.classList.add(role === 'Driver' ? 'button-driver' : 'button-user');
        } catch (error) {
          console.error('Error updating role:', error);
        }
      });
      buttonCell.appendChild(updateButton);
      row.appendChild(buttonCell);*/

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

getUserDatamob();




async function getUserDatadriver() {
  try {
    const snapshot = await getDocs(driverCollection);
    const tableBody = document.getElementById('userTableBody2');


    tableBody.innerHTML = '';

    snapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.Name;
      const email = data.email;
      const phoneno = data.phone;
      const gender = data.Gender;
      const profileImage = data['Basic Info'];
      const cnic = data.Cnicno;
      const cnicfs = data['CNIC Frontside'];
      const cnicbs = data['CNIC Backside'];
      const userImageID = data['Selfie with ID'];
      const vehicleName = data.Transportname;
      const vehicleNumber = data.Vehicle_Number;
      const vehiclePhoto = data['Photo of Vehicle'];
      const vehicleCardFS = data['Vehicle Registration Frontside'];
      const vehicleCardBS = data['Vehicle Registration Backside'];
      const driverLicenseFS = data['Driver Licence Frontside'];
      const driverLicenseBS = data['Driver Licence Backside'];
      //const ratings = data.driverating;
      //const docRef = firestore.collection('your_collection').doc('your_document_id');
      let driverstatus = data.Status;
      //let driverstatus = "InReview";

      console.log('Driver Data:', {
        name, email, phoneno, gender,
        profileImage, cnic, cnicfs, cnicbs, userImageID,
        vehicleName, vehiclePhoto, vehicleCardFS, vehicleCardBS,
        driverLicenseFS, driverLicenseBS, driverstatus
      });

      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = name;
      row.appendChild(nameCell);

      const emailCell = document.createElement('td');
      emailCell.textContent = email;
      row.appendChild(emailCell);

      const phoneCell = document.createElement('td');
      phoneCell.textContent = phoneno;
      row.appendChild(phoneCell);

      const genderCell = document.createElement('td');
      genderCell.textContent = gender;
      row.appendChild(genderCell);

      const createImageCell = (imageUrl, altText, fallbackImage = 'images/profile.png') => {
        const cell = document.createElement('td');
        const img = document.createElement('img');
        img.src = imageUrl || fallbackImage;
        img.alt = altText;
        img.onerror = () => {
          console.error('Image load error for:', imageUrl);
          img.src = fallbackImage;
        };
        img.classList.add('zoomable');
        img.addEventListener('click', function () {
          const modal = document.createElement('div');
          modal.classList.add('modal');
          const modalImg = document.createElement('img');
          modalImg.src = this.src;
          modalImg.alt = this.alt;
          modal.appendChild(modalImg);
          modal.addEventListener('click', function (event) {
            if (event.target === modal) {
              modal.remove();
            }
          });
          document.body.appendChild(modal);
        });
        cell.appendChild(img);
        return cell;
      };

      row.appendChild(createImageCell(profileImage, `${email}'s profile image`));

      const cnicCell = document.createElement('td');
      cnicCell.textContent = cnic;
      row.appendChild(cnicCell);

      row.appendChild(createImageCell(cnicfs, `${email}'s CNIC Frontside`));
      row.appendChild(createImageCell(cnicbs, `${email}'s CNIC Backside`));
      row.appendChild(createImageCell(userImageID, `${email}'s Selfie with ID`));

      const vehCell = document.createElement('td');
      vehCell.textContent = vehicleName;
      row.appendChild(vehCell);

      const vehnumCell = document.createElement('td');
      vehnumCell.textContent = vehicleNumber;
      row.appendChild(vehnumCell);

      row.appendChild(createImageCell(vehiclePhoto, `${email}'s Vehicle Photo`));
      row.appendChild(createImageCell(vehicleCardFS, `${email}'s Vehicle Registration Frontside`));
      row.appendChild(createImageCell(vehicleCardBS, `${email}'s Vehicle Registration Backside`));
      row.appendChild(createImageCell(driverLicenseFS, `${email}'s Driver Licence Frontside`));
      row.appendChild(createImageCell(driverLicenseBS, `${email}'s Driver Licence Backside`));


      //const ratings = data.driverating;
      //const ratings = parseFloat(data.driverating);
      const ratings = parseFloat(data.driverating);
      const fullStars = Math.floor(ratings);
      const halfStar = ratings % 1 !== 0;

      const ratCell = document.createElement('td');

      // Set the text content before appending the icons, and add a space after the text
      ratCell.textContent = ratings + ' ';

      // Add a class to the rating cell for styling
      ratCell.classList.add('rating-cell');

      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        const starIcon = document.createElement('i');
        starIcon.classList.add('uil', 'uil-star', 'gold-star'); // Adding 'gold-star' class for styling
        ratCell.appendChild(starIcon);
      }

      // Add half star if applicable
      if (halfStar) {
        const halfStarIcon = document.createElement('i');
        halfStarIcon.classList.add('uil', 'uil-star-half-alt', 'gold-star'); // Adding 'gold-star' class for styling
        ratCell.appendChild(halfStarIcon);
      }

      row.appendChild(ratCell);










      const statusCell = document.createElement('td');
      statusCell.textContent = driverstatus;
      row.appendChild(statusCell);




      const buttonCell = document.createElement('td');
      const updateButton = document.createElement('button');
      updateButton.textContent = driverstatus === 'Approved' ? 'Approved' : 'InReview';
      updateButton.classList.add('button');
      updateButton.classList.add(driverstatus === 'Approved' ? 'button-approved' : 'button-review');
      /*updateButton.addEventListener('click', async () => {
        try {
          console.log('Before update - driverstatus:', driverstatus); // Add this line
          
          driverstatus = driverstatus === 'InReview' ? 'Approved' : 'InReview';
          await updateDoc(doc.ref, { Status: driverstatus });
          statusCell.textContent = driverstatus;
         
          updateButton.textContent = driverstatus === 'Approved' ? 'Approved' : 'InReview';
          updateButton.classList.remove('button-approved', 'button-review');
          updateButton.classList.add(driverstatus === 'Approved' ? 'button-approved' : 'button-review');

          console.log('After update - driverstatus:', driverstatus); // Add this line
        } catch (error) {
          console.error('Error updating status:', error);
        }
      });*/
      updateButton.addEventListener('click', async () => {
        try {
          console.log('Before update - driverstatus:', driverstatus); // Add this line

          // Save the previous status to determine whether to clear the message field
          const previousStatus = driverstatus;

          driverstatus = driverstatus === 'InReview' ? 'Approved' : 'InReview';
          const updateData = { Status: driverstatus };

          // Clear the 'message' field in Firestore if status changes to 'Approved'
          if (previousStatus === 'InReview' && driverstatus === 'Approved') {
            updateData.message = ''; // Assuming 'message' is the field you want to clear
          }

          await updateDoc(doc.ref, updateData);
          statusCell.textContent = driverstatus;

          updateButton.textContent = driverstatus === 'Approved' ? 'Approved' : 'InReview';
          updateButton.classList.remove('button-approved', 'button-review');
          updateButton.classList.add(driverstatus === 'Approved' ? 'button-approved' : 'button-review');

          console.log('After update - driverstatus:', driverstatus); // Add this line
        } catch (error) {
          console.error('Error updating status:', error);
        }
      });

      buttonCell.appendChild(updateButton);
      row.appendChild(buttonCell);



      /*const messageInputCell = document.createElement('td');
      const messageInput = document.createElement('input');
      messageInput.type = 'text';
      messageInput.placeholder = 'Enter message';
      messageInput.style.transition = 'width 0.3s ease'; // Add transition for smooth animation

      // Function to enlarge the input field
      function enlargeInput() {
        messageInput.style.width = '300px';
        messageInput.style.borderColor = '#007bff'; // Change the width to a larger value
      }

      // Function to shrink the input field
      function shrinkInput() {
        messageInput.style.width = '';
        messageInput.style.borderColor = '#007bff'; // Reset the width to its default value
      }

      // Add event listeners
      messageInput.addEventListener('focus', enlargeInput); // Enlarge when clicked
      document.body.addEventListener('click', function (event) {
        if (!messageInputCell.contains(event.target)) {
          shrinkInput(); // Shrink when clicked outside of the input field
        }
      });

      messageInputCell.appendChild(messageInput);
      row.appendChild(messageInputCell);*/

      const messageInputCell = document.createElement('td');
      const messageInput = document.createElement('input');
      messageInput.type = 'text';
      messageInput.placeholder = 'Enter message';
      messageInput.style.transition = 'width 0.3s ease'; // Add transition for smooth animation

      // Function to enlarge the input field and change border color on focus
      function enlargeInput() {
        messageInput.style.width = '300px'; // Change the width to a larger value
        //messageInput.style.borderColor = '#007bff'; // Change border color when focused
      }

      // Function to shrink the input field and reset border color
      function shrinkInput() {
        messageInput.style.width = ''; // Reset the width to its default value
        //messageInput.style.borderColor = '#EDAE10'; // Reset border color
      }

      // Add event listeners
      messageInput.addEventListener('focus', enlargeInput); // Enlarge when clicked
      messageInput.addEventListener('blur', shrinkInput); // Shrink when focus is lost

      messageInputCell.appendChild(messageInput);
      row.appendChild(messageInputCell);




      /*const saveButtonCell = document.createElement('td');
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Sent Message';
      saveButton.classList.add('save-message-button');
      saveButton.addEventListener('click', async () => {
        const message = messageInput.value;
        if (message) {
          try {
            await updateDoc(doc.ref, { message: message });
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Message sent successfully!',
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
          } catch (error) {
            console.error('Error saving message:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error sending message. Please try again.',
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
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a message.',
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
        }
      });
      saveButtonCell.appendChild(saveButton);
      row.appendChild(saveButtonCell);*/
      const saveButtonCell = document.createElement('td');
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Send Message';
      saveButton.classList.add('save-message-button');
      saveButton.addEventListener('click', async () => {
        const message = messageInput.value;
        if (message) {
          try {
            // Fetch the current status from Firestore
            const docSnapshot = await getDoc(doc.ref);
            const currentStatus = docSnapshot.data().Status;

            // Check if the current status is 'Approved'
            if (currentStatus === 'InReview') {
              await updateDoc(doc.ref, { message: message });
              messageInput.value = '';
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Message sent successfully!',
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
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Message can only be sent when status is InReview.',
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
            }
          } catch (error) {
            console.error('Error saving message:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error sending message. Please try again.',
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
          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a message.',
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
        }
      });
      saveButtonCell.appendChild(saveButton);
      row.appendChild(saveButtonCell);


      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

getUserDatadriver();








// Define the chart data and update function
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
  console.log("Data updated:", chartData.datasets[0].data);
  chart.update();
}

// Function to fetch data from Firebase
function fetchDataFromFirebase() {
  console.log("Fetching data from Firebase...");
  const googleUsersRef = collection(db, 'googleUsers');
  const driversRef = collection(db, 'drivers');
  const mobileUsersRef = collection(db, 'mobileUsers');

  // Get counts for each collection
  const googleUsersCountPromise = getDocs(googleUsersRef).then(querySnapshot => querySnapshot.size);
  const driversCountPromise = getDocs(driversRef).then(querySnapshot => querySnapshot.size);
  const mobileUsersCountPromise = getDocs(mobileUsersRef).then(querySnapshot => querySnapshot.size);

  // Wait for all promises to resolve
  Promise.all([googleUsersCountPromise, driversCountPromise, mobileUsersCountPromise])
    .then(counts => {
      const [googleUsersCount, driversCount, mobileUsersCount] = counts;
      console.log("Data fetched:", googleUsersCount, driversCount, mobileUsersCount);
      // Update the chart with fetched data
      updateChart(googleUsersCount, driversCount, mobileUsersCount);
    })
    .catch(error => {
      console.error("Error getting document counts:", error);
    });
}

// Execute when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");

  // Check if the chart canvas element exists
  let ctx = document.getElementById('myChart');
  if (!ctx) {
    console.error("Chart canvas element not found!");
    return;
  }

  // Get the 2d context of the canvas
  ctx = ctx.getContext('2d');

  // Check if the context is obtained successfully
  if (!ctx) {
    console.error("Failed to obtain 2d context for chart canvas!");
    return;
  }

  // Create new chart
  let chart = new Chart(ctx, {
    type: 'pie',
    data: chartData
  });

  // Check if the chart is created successfully
  if (!chart) {
    console.error("Failed to create chart instance!");
    return;
  }

  // Call the function to initially fetch and update data
  fetchDataFromFirebase();
});

