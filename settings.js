const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const mitarbeiter_vorname_input = document.getElementById("mitarbeiter_vorname_input");
const mitarbeiter_nachname_input = document.getElementById("mitarbeiter_nachname_input");
const mitarbeiter_abteilung_input = document.getElementById("mitarbeiter_abteilung_input");
var change_mitarbeiter_data_submit_button = document.getElementById("change_mitarbeiter_data_submit_button");

change_mitarbeiter_data_submit_button.type = "button";
var newButton = change_mitarbeiter_data_submit_button.cloneNode(true);
change_mitarbeiter_data_submit_button.parentNode.replaceChild(newButton, change_mitarbeiter_data_submit_button);

change_mitarbeiter_data_submit_button = newButton;
change_mitarbeiter_data_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    change_mitarbeiter_data();
});

var information = {
    "user": {},
    "company": {},
    "mitarbeiter": {}
};

function change_mitarbeiter_data() {
    const doc_ref = db.collection("companies").doc(information.company.id).collection("users").doc(information.user.id);

    doc_ref.update({
        vorname: mitarbeiter_vorname_input.value,
        nachname: mitarbeiter_nachname_input.value,
        abteilung: mitarbeiter_abteilung_input.value
    })
    .then(() => {
        console.log("Mitarbeiter-Data bearbeitet.");
        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim Bearbeiten des Mitarbeiters:", error);
    });
}

async function getInformation(user) {
    const usermatching_info = await db.collection("usermatching").doc("WJobxOFznceM4Cw1hRZd").get();

    const projekt_id = new URLSearchParams(window.location.search).get("id");

    if (!usermatching_info.exists) {
        console.log("Kein Usermatching zu angemeldetem User gefunden");
        return
    }

    const user_id = usermatching_info.data()[user.uid]["user_id"];

    const company_id = usermatching_info.data()[user.uid]["company_id"];
    const company_ref = db.collection("companies").doc(company_id);

    const company_snapshot = await company_ref.get();
    const company_data = company_snapshot.data();

    information["company"] = {
        "id": company_id,
        "name": company_data["unternehmensname"]
    }

    // Mitarbeiter der Firma abrufen
    const mitarbeiter_ref = company_ref.collection("users");
    const mitarbeiter_snapshot = await mitarbeiter_ref.get();

    console.log("user id", user_id);

    // Mitarbeiter-Daten speichern
    mitarbeiter_snapshot.forEach((mitarbeiter_doc) => {
        information["mitarbeiter"][mitarbeiter_doc.id] = mitarbeiter_doc.data();

        if (mitarbeiter_doc.id == user_id) {
            information["user"] = mitarbeiter_doc.data();
            information["user"]["id"] = user_id;
        } 
    });

    console.log(information);
}

function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];

    mitarbeiter_vorname_input.value = information.user.vorname;
    mitarbeiter_nachname_input.value = information.user.nachname;
    mitarbeiter_abteilung_input.value = information.user.position;
}

function remove_overlay() {
    const overlay = document.getElementById("site_overlay");
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = 0;

    setTimeout(function() {
        overlay.remove();
    }, 1000);
}

const auth = firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        await getInformation(user);

        await buildPage_all(user);

        remove_overlay();

    } else {
        location.href = "/";
    }
});