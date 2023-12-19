// Import firebase libraries
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
export function SignInUser(email, password) {
    let signInErrorMessage = "";

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            window.location.replace("./ongoing_projects_dashboard.html");
        })
        .catch((err) => {
            let errorMessage;

            if (err.code == "auth/user-not-found" || err.code == "auth/invalid-email" || err.code == "auth/wrong-password" || err.code=="auth/missing-password" || err.code == "auth/invalid-login-credentials") {
                errorMessage = "Please check that your email/password has been entered correctly";
            } else if (err.code == "auth/too-many-requests") {
                errorMessage = "Your account had been temporarily locked due to too many failed log in attempts"
            } else if (err.code == "auth/network-request-failed") {
                errorMessage = "Unable to connect to server"
            } else {
                errorMessage = "Something went wrong: " + err.code;
            }

            
        })

    return signInErrorMessage;
}

// Sign out user

// Create new user

// Delete existing user