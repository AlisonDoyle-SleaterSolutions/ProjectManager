import { SignInUser } from "../firebase/authentication.js";

(function(){
    // Event listeners
    document.getElementById('sign-in-form').addEventListener('submit', SignIn, false);
}())

function SignIn() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let result = SignInUser(email, password);

    if (result != "") {
        console.log(result);
    }
    
    return false;
}