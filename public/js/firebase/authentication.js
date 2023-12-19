// Import firebase libraries
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLnHiHdYJxmOQ2OmDYKgizntH233TL2PY",
    authDomain: "projectmanager-e9cc1.firebaseapp.com",
    databaseURL: "https://projectmanager-e9cc1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "projectmanager-e9cc1",
    storageBucket: "projectmanager-e9cc1.appspot.com",
    messagingSenderId: "408832268919",
    appId: "1:408832268919:web:c1baceb4053faddf938472",
    measurementId: "G-KG6C559XLC"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in user
export function SignIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Upon signing in
        window.location.replace("./ongoing_projects_dashboard.min.html");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}
// Sign out user
export function SignOut() {
    
}


// Create new user

// Delete existing user