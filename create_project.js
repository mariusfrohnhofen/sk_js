const projektname_input = document.getElementById("projektname_input");
const auftraggeber_input = document.getElementById("auftraggeber_input");
const deadline_input = document.getElementById("deadline_input");
const beschreibung_input = document.getElementById("beschreibung_input");
const auftragssumme_input = document.getElementById("auftragssumme_input");
var submit_button = document.getElementById("submit_button");

submit_button.type = "button";
var newButton = submit_button.cloneNode(true);
submit_button.parentNode.replaceChild(newButton, submit_button);

submit_button = newButton;
submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    createProject();
});

function get_today_string() {
    var heute = new Date();
    var jahr = heute.getFullYear();
    var monat = ('0' + (heute.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, deshalb +1
    var tag = ('0' + heute.getDate()).slice(-2);
    return jahr + '-' + monat + '-' + tag;
}

deadline_input.type = "date";
deadline_input.min = get_today_string();

var information = {
    "user": {},
    "company": {},
    "mitarbeiter": {}
};

function createProject() {
    const projektname = projektname_input.value;
    const auftraggeber = auftraggeber_input.value;
    const deadline = deadline_input.value;
    const beschreibung = beschreibung_input.value;
    const auftragssumme = parseFloat(auftragssumme_input.value);

    const collectionRef = db.collection("companies").doc(information.company.id).collection("projects");

    const newDocumentRef = collectionRef.doc();

    const new_document_data = {
        aufgaben: [],
        auftraggeber: auftraggeber,
        beschreibung: beschreibung,
        dateien: [],
        deadline: deadline,
        dealvolumen: auftragssumme,
        id: newDocumentRef.id,
        titel: projektname,
        verantwortlicher: information.user.id
    }

    newDocumentRef.set(new_document_data)
    .then(() => {
        console.log("Dokument erfolgreich hinzugefügt");
        location.href = "/home";
    })
    .catch((error) => {
        console.error("Fehler beim Erstellen des Dokuments:", error);
    });
}

async function getInformation(user) {
    const usermatching_info = await db.collection("usermatching").doc("WJobxOFznceM4Cw1hRZd").get();

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

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];
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