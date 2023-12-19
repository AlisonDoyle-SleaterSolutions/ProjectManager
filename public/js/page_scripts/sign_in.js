import { SignIn } from "../firebase/authentication.js";

// Event listeners
document.getElementById('sign-in-form').addEventListener('click', SignInUser, false);

export function SignInUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    SignIn(email, password);
}