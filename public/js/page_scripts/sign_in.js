import { SignInUser } from "../firebase/authentication.js";

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

(function () {
    // Event listeners
    document.getElementById('sign-in-button').addEventListener('click', SignIn, false);
}())

async function SignIn() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if ((email !== "") || (password !== "")) {
        // let signInResult = await SignInUser(email, password);
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                window.location.replace("./ongoing_projects_dashboard.html");
                console.log(cred.user);
            })
            .catch((err) => {
                let errorMessage;

                if (err.code == "auth/user-not-found" || err.code == "auth/invalid-email" || err.code == "auth/wrong-password" || err.code == "auth/missing-password" || err.code == "auth/invalid-login-credentials") {
                    errorMessage = "Please check that your email/password has been entered correctly";
                } else if (err.code == "auth/too-many-requests") {
                    errorMessage = "Your account had been temporarily locked due to too many failed log in attempts"
                } else if (err.code == "auth/network-request-failed") {
                    errorMessage = "Unable to connect to server"
                } else {
                    errorMessage = "Something went wrong: " + err.code;
                }

                ShowToastMessage(errorMessage, "e");
            });

        // if (signInResult != "") {
        //     ShowToastMessage(signInResult, "e")
        // }
    }
    else {
        ShowToastMessage("Make sure you have entered an email and password", "e")
    }

    return false;
}

function ShowToastMessage(toastContent, toastType) {
    // Html elements
    let toast = document.getElementById('toast');
    let toastTypeIndicator = document.getElementById("toastTypeIndicator");
    let toastTypeColor;
    let toastHeaderText = document.getElementById("toast-header");
    let headerText;
    let toastBody = document.getElementById("toast-body");

    // Color variabales
    const ErrorColor = "#FF2E00";
    const InfoColor = "#7C5CFF";

    // Picking appropriate styling
    if (toastType.toUpperCase() === "E") {
        toastTypeColor = ErrorColor;
        headerText = "Error"
    } else {
        toastTypeColor = InfoColor;
        headerText = "Info"
    }

    // Set toast message
    toastHeaderText.innerHTML = headerText;
    toastTypeIndicator.style.background = toastTypeColor;
    toastBody.innerHTML = toastContent;

    // Show toast
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
    toastBootstrap.show();
}