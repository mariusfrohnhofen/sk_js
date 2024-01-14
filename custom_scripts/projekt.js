//  Reference to Webflow UI ements
const heading = document.getElementById("heading");

async function buildPage(user) {
    const projekt_id = new URLSearchParams(window.location.search).get("id");

    heading.innerText = "Projekt: " + projekt_id;

}

const auth = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        buildPage(user);
    } else {
        location.href = "/";
    }
});