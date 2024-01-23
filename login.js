// v1.0.16

//  Reference to Webflow UI ements
const signInButton = document.getElementById('sign_in_button');
const emailInputField = document.getElementById('email_input_field');
const passInputField = document.getElementById('password_input_field');
const loginForm = document.getElementById('login_form');

const currentPath = window.location.pathname;

loginForm.style.display = "none";

const auth = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = "/home";
    }
    else {
        loginForm.style.display = "block";
    }
});

const signup = () => {

    event.preventDefault();
    email = emailInputField.value;
    pass = passInputField.value;

    if (email == "" || pass == "") {
        console.log("returning");
        return
    }

    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
        // Signed in
        console.log("success");
        var user = userCredential.user;
        location.href = "/einschreibung";
        // ...
    })
    .catch((error) => {
        console.log("error");
        var errorCode = error.code;
        var errorMessage = error.message;
    });
};


//  Add event listeners to buttons
signInButton.addEventListener('click', signup);