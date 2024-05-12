import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
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
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", function () {
  const submit = document.getElementById('submit');
  const errorMessage1 = document.getElementById('error-message');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  submit.addEventListener("click", function (event) {
    event.preventDefault();


    if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
      errorMessage1.innerHTML = '<i class="fas fa-times-circle"></i> Email & Password are required';
      errorMessage1.style.display = "block";
      errorMessage1.style.color = "red";
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const username = await getUsername(email);
        errorMessage1.innerHTML = '<i class="fas fa-check-circle"></i> Login Successful';
        errorMessage1.style.color = "green";
        errorMessage1.style.display = "block";
        if (username) {
          console.log('User:', user);
          console.log('Username:', username);
          window.location.href = `dashboard.html?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`;
        } else {
          console.log('Failed to get username');
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        errorMessage1.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect Email & Password';
        errorMessage1.style.display = "block";
        errorMessage1.style.color = "red";
      });
  });
});

async function getUsername(email) {
  try {
    const adminsCollectionRef = collection(firestore, 'admins');
    const querySnapshot = await getDocs(query(adminsCollectionRef, where("email", "==", email)));   
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const username = userData.username;
      return username;
    } else {
      console.log('User with email', email, 'not found in "admins" collection');
      return null;
    }
  } catch (error) {
    console.error('Error getting admin document:', error);
    return null;
  }
}
const loginEmail = document.getElementById('email').value;

getUsername(loginEmail)
  .then(username => {
    if (username) {
      console.log('Username:', username);
    } else {
      console.log('Username not found for email:', loginEmail);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById('submit1');
  const errorMessage2 = document.getElementById('error-message1');
  const emailInput = document.getElementById('email1');
  const forgotPassword = () => {
    if (emailInput.value.trim() === '') {
      errorMessage2.innerHTML = '<i class="fas fa-times-circle"></i> Please enter your email address';
      errorMessage2.style.color = "red";
      errorMessage2.style.display = "block";
      return;
    }
    const email = emailInput.value;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        errorMessage2.innerHTML = '<i class="fas fa-check-circle"></i> Password reset link has been sent to your email';
        errorMessage2.style.color = "green";
        errorMessage2.style.display = "block";
      })
      .catch((error) => {
        console.error("❌ Error sending password reset email:", error);
        errorMessage2.innerHTML = '<i class="fas fa-times-circle"></i> An error occurred while sending the password reset email.';
        errorMessage2.style.color = "red";
        errorMessage2.style.display = "block";
      });
  };
  submitButton.addEventListener('click', forgotPassword);
});

const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', function () {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  this.querySelector('i').classList.toggle('fa-eye-slash');
});

const forgotPasswordLabel = document.getElementById('forgotPassword');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');
const errorMessage1 = document.getElementById('error-message');
forgotPasswordLabel.addEventListener('click', function () {
  emailInput.value = '';
  passwordInput.value = '';
  errorMessage1.textContent = '';
  errorMessage1.style.display = 'none';
  passwordInput.setAttribute('type', 'password');
  togglePasswordButton.querySelector('i').classList.remove('fa-eye-slash');
});

const loginNowLabel = document.getElementById('loginNow');
const emailInput1 = document.getElementById('email1');
const errorMessage2 = document.getElementById('error-message1');
loginNowLabel.addEventListener('click', function () {
  emailInput1.value = '';
  errorMessage2.textContent = '';
  errorMessage2.style.display = 'none';
});

const emailInput2 = document.getElementById('email');
const passwordInput2 = document.getElementById('password');
const errorMessage3 = document.getElementById('error-message');
function toggleLabelVisibility(input1, input2, label) {
  if (input1.value === '' && input2.value === '') {
    label.style.display = 'none';
  } else {
    label.style.display = 'block';
  }
}
emailInput2.addEventListener('input', function () {
  toggleLabelVisibility(emailInput2, passwordInput2, errorMessage3);
});

passwordInput2.addEventListener('input', function () {
  toggleLabelVisibility(emailInput2, passwordInput2, errorMessage3);
});


const emailInput3 = document.getElementById('email1');
const errorMessage4 = document.getElementById('error-message1');
const button = document.getElementById('submit1');
button.addEventListener('click', function () {
  if (emailInput3.value.trim() !== '') {
    errorMessage4.style.display = 'block';
  }
});
emailInput3.addEventListener('input', function () {
  if (emailInput3.value.trim() === '') {
    errorMessage4.style.display = 'none';
  }
});
