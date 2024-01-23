//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const heading = document.getElementById("heading");
const projektinfos_auftraggeber = document.getElementById("projektinfos_auftraggeber");
const projektinfos_auftragssumme = document.getElementById("projektinfos_auftragssumme");
const projektinfos_deadline = document.getElementById("projektinfos_deadline");
const projektinfos_voraussichtliche_fertigstellung = document.getElementById("projektinfos_voraussichtliche_fertigstellung");
const projektinfos_beschreibung = document.getElementById("projektinfos_beschreibung");

const breadcrum_projekt = document.getElementById("breadcrum_projekt");
const breadcrum_home_text = document.getElementById("breadcrum_home_text");

const aufgaben_counter = document.getElementById("aufgaben_counter");

const days_left_text = document.getElementById("days_left_text");

const projekt_bearbeiten_button = document.getElementById("projekt_bearbeiten_button");
const projekt_bearbeiten_overlay = document.getElementById("projekt_bearbeiten_overlay");
const projekt_bearbeiten_projektname_input = document.getElementById("projekt_bearbeiten_projektname_input");
const projekt_bearbeiten_auftraggeber_input = document.getElementById("projekt_bearbeiten_auftraggeber_input");
const projekt_bearbeiten_deadline_input = document.getElementById("projekt_bearbeiten_deadline_input");
const projekt_bearbeiten_cancel_button = document.getElementById("projekt_bearbeiten_cancel_button");
const projekt_bearbeiten_beschreibung_input = document.getElementById("projekt_bearbeiten_beschreibung_input");
const projekt_bearbeiten_auftragssumme_input = document.getElementById("projekt_bearbeiten_auftragssumme_input");
var projekt_bearbeiten_submit_button = document.getElementById("projekt_bearbeiten_submit_button");

const aufgabe_erstellen_button = document.getElementById("aufgabe_erstellen_button");
const aufgabe_erstellen_overlay = document.getElementById("aufgabe_erstellen_overlay");
const aufgabe_erstellen_aufgabenname_input = document.getElementById("aufgabe_erstellen_aufgabenname_input");
const aufgabe_erstellen_mitarbeiter_select = document.getElementById("aufgabe_erstellen_mitarbeiter_select");
const aufgabe_erstellen_aufgabeninhalt_input = document.getElementById("aufgabe_erstellen_aufgabeninhalt_input");
const aufgabe_erstellen_cancel_button = document.getElementById("aufgabe_erstellen_cancel_button");
var aufgabe_erstellen_submit_button = document.getElementById("aufgabe_erstellen_submit_button");

const file_upload_overlay = document.getElementById("file_upload_overlay");
const file_upload_button = document.getElementById("file_upload_button");
const file_upload_input_field = document.getElementById("file_upload_input_field");
const file_upload_cancel_button = document.getElementById("file_upload_cancel_button");
var file_upload_submit_button = document.getElementById("file_upload_submit_button");

const aufgaben_progress_bar = document.getElementById("aufgaben_progress_bar");

file_upload_input_field.type = "file";
file_upload_overlay.style.display = "none";
file_upload_button.addEventListener("click", () => {
    file_upload_overlay.style.display = "block";
});

file_upload_submit_button.type = "button";
var newButton = file_upload_submit_button.cloneNode(true);
file_upload_submit_button.parentNode.replaceChild(newButton, file_upload_submit_button);

file_upload_submit_button = newButton;
file_upload_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    uploadFile();
});

projekt_bearbeiten_overlay.style.display = "none";
aufgabe_erstellen_overlay.style.display = "none";

aufgabe_erstellen_cancel_button.addEventListener("click", () => {
    aufgabe_erstellen_overlay.style.display = "none";
});

file_upload_cancel_button.addEventListener("click", () => {
    file_upload_overlay.style.display = "none";
});

aufgabe_erstellen_button.addEventListener("click", () => {
    aufgabe_erstellen_overlay.style.display = "block";
});

projekt_bearbeiten_cancel_button.addEventListener("click", () => {
    projekt_bearbeiten_overlay.style.display = "none";
});

projekt_bearbeiten_button.addEventListener("click", () => {
    projekt_bearbeiten_overlay.style.display = "block";
});

projekt_bearbeiten_submit_button.type = "button";
var newButton = projekt_bearbeiten_submit_button.cloneNode(true);
projekt_bearbeiten_submit_button.parentNode.replaceChild(newButton, projekt_bearbeiten_submit_button);

projekt_bearbeiten_submit_button = newButton;
projekt_bearbeiten_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    changeProjekt();
});

aufgabe_erstellen_submit_button.type = "button";
var newButton = aufgabe_erstellen_submit_button.cloneNode(true);
aufgabe_erstellen_submit_button.parentNode.replaceChild(newButton, aufgabe_erstellen_submit_button);

aufgabe_erstellen_submit_button = newButton;
aufgabe_erstellen_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    createAufgabe();
});

function get_tage_differenz(von, bis) {
    if (von == "-" || bis == "-" || bis == null) {
        return "-";
    }

    var date1 = new Date(von);
    var date2 = new Date(bis);

    var millis = date2 - date1;

    return millis / (1000 * 60 * 60 * 24);
}

function uploadFile() {
    file_upload_submit_button.value = "Bitte warten...";
    file_upload_submit_button.disabled = true;
    const file = file_upload_input_field.files[0];

    const file_id = uuidv4();

    if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file_id);

        fileRef.put(file).then((snapshot) => {
            console.log("File uploaded successfully");

            const document_id = uuidv4();
            const document_data = {
                ersteller: information.user.id,
                erstellungsdatum: get_today_string(),
                file_id: file_id,
                titel: file.name
            }

            const collectionRef = db.collection("companies").doc(information.company.id).collection("dateien");

            collectionRef.add(document_data)
            .then((docRef) => {
                console.log("Dokument erfolgreich hinzugefügt. ID:", docRef.id);

                const documentRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

                documentRef.update({
                    dateien: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
                .then(() => {
                    console.log("Datei zum Array hinzugefügt");
                    location.reload();
                })
                .catch((error) => {
                    console.error("Fehler beim Hinzufügen der Datei zum Array:", error);
                });
            })
            .catch((error) => {
                console.error("Fehler beim Hinzufügen des Dokuments:", error);
            });

        })
        .catch((error) => {
            console.error("Error uploading file:", error);
        });
    } else {
        console.error("No file selected.");
    }
}

function get_today_string() {
    var heute = new Date();
    var jahr = heute.getFullYear();
    var monat = ('0' + (heute.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, deshalb +1
    var tag = ('0' + heute.getDate()).slice(-2);
    return jahr + '-' + monat + '-' + tag;
}

projekt_bearbeiten_deadline_input.type = "date";
projekt_bearbeiten_deadline_input.min = get_today_string();

function changeProjekt() {
    const new_projektname = projekt_bearbeiten_projektname_input.value;
    const new_auftraggeber = projekt_bearbeiten_auftraggeber_input.value;
    const new_deadline = projekt_bearbeiten_deadline_input.value;
    const new_beschreibung = projekt_bearbeiten_beschreibung_input.value;
    const new_auftragssumme = projekt_bearbeiten_auftragssumme_input.value;

    const docRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

    docRef.update({
        titel: new_projektname,
        auftraggeber: new_auftraggeber,
        deadline: new_deadline,
        beschreibung: new_beschreibung,
        dealvolumen: new_auftragssumme
    })
    .then(() => {
        console.log("Projekt bearbeitet");
        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim Bearbeiten des Projekts:", error);
    });
}

function createAufgabe() {
    const new_aufgabenname = aufgabe_erstellen_aufgabenname_input.value;
    const new_zustaendiger = aufgabe_erstellen_mitarbeiter_select.value;
    const new_aufgabeninhalt = aufgabe_erstellen_aufgabeninhalt_input.value;

    const new_aufgaben_data = {
        beschreibung: new_aufgabeninhalt,
        dateien: [],
        finished: false,
        prognostiziertes_abschlussdatum: null,
        titel: new_aufgabenname,
        verantwortlicher: new_zustaendiger
    }

    const collectionRef = db.collection("companies").doc(information.company.id).collection("aufgaben");

    collectionRef.add(new_aufgaben_data)
    .then((docRef) => {
        console.log("Dokument erfolgreich hinzugefügt. ID:", docRef.id);

        const documentRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

        documentRef.update({
            aufgaben: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        })
        .then(() => {
            console.log("Aufgabe zum Array hinzugefügt");
            location.reload();
        })
        .catch((error) => {
            console.error("Fehler beim Hinzufügen der Aufgabe zum Array:", error);
        });
    })
    .catch((error) => {
        console.error("Fehler beim Hinzufügen des Dokuments:", error);
    });
}

const currentPath = window.location.pathname;

var information = {
    "user": {},
    "company": {},
    "projekt": {},
    "aufgaben": {},
    "dateien": {},
    "mitarbeiter": {}
};

function formatEuro(number) {
    // Die 'de-DE' Locale wird verwendet, um das Euro-Format zu erzwingen
    const formattedEuro = number.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
  
    return formattedEuro;
}

function datestring_to_visual_date(datestring) {
    if (datestring == null) {
        return "-";
    }

    var date_parts = datestring.split("-");

    return `${date_parts[2]}.${date_parts[1]}.${date_parts[0]}`;
}

function downloadFile(filePath) {
    // Referenz auf die Datei erstellen
    const fileRef = storage.ref().child(filePath);

    // Download-URL für die Datei abrufen
    fileRef.getDownloadURL().then((downloadURL) => {
        window.open(downloadURL);
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Download-URL:", error);
    });
}

function deleteFile(file_id) {
    for (const datei_id in information.dateien) {
        if (information.dateien[datei_id].file_id !== file_id) {
            continue
        }

        const documentRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

        documentRef.update({
            dateien: firebase.firestore.FieldValue.arrayRemove(datei_id)
        })
        .then(() => {
            console.log("Datei aus Array gelöscht");
            console.log("Datei ID", datei_id)
            const dateiDocumentRef = db.collection("companies").doc(information.company.id).collection("dateien").doc(datei_id);

            console.log(dateiDocumentRef);

            dateiDocumentRef.delete()
            .then(() => {
                console.log("Dokument aus Collection gelöscht:", datei_id);

                const fileRef = storage.ref().child(file_id);

                fileRef.delete()
                .then(() => {
                    console.log("Datei aus Storage gelöscht:", file_id);
                    location.reload();
                })
                .catch((error) => {
                    console.error("Fehler beim Löschen der Datei aus Storage:", error);
                });
            })
            .catch((error) => {
                console.error("Fehler beim Löschen des Dokuments aus der Collection:", error);
            });
        })
        .catch((error) => {
            console.error("Fehler beim Löschen der Datei aus dem Array:", error);
        });
    }
}

function get_projektdokument_table_row(file_id, titel) {
    const table_row_div = document.createElement("div");
    table_row_div.classList.add("data-table-row-2", "doc");

    const projektdokument_a = document.createElement("a");
    projektdokument_a.classList.add("doc-link");
    projektdokument_a.innerText = titel;
    projektdokument_a.href = "#";
    projektdokument_a.setAttribute("onClick", "javascript: downloadFile('" + file_id + "');")

    table_row_div.appendChild(projektdokument_a);

    const aufgabenergebnis_close_icon_wrapper_div = document.createElement("div");
    aufgabenergebnis_close_icon_wrapper_div.classList.add("close-icon-wrapper", "dateien");
    const close_icon_first = document.createElement("div");
    close_icon_first.classList.add("close-icon-line-3", "first");
    const close_icon_second = document.createElement("div");
    close_icon_second.classList.add("close-icon-line-3", "second");
    aufgabenergebnis_close_icon_wrapper_div.appendChild(close_icon_first);
    aufgabenergebnis_close_icon_wrapper_div.appendChild(close_icon_second);
    aufgabenergebnis_close_icon_wrapper_div.setAttribute("onClick", "javascript: deleteFile('" + file_id + "')");
    table_row_div.appendChild(aufgabenergebnis_close_icon_wrapper_div);

    return table_row_div;
}

function get_aufgaben_table_row(aufgabe_id, aufgabe_name, status, status_color, mitarbeiter_id, voraussichtliche_fertigstellung) {
    const aufgabe_table_row = document.createElement("div");
    aufgabe_table_row.classList.add("data-table-row-2");

    const aufgabe_name_div = document.createElement("div");
    aufgabe_name_div.classList.add("text-606", "bold", "color-neutral-800");
    aufgabe_name_div.innerText = aufgabe_name;
    aufgabe_table_row.appendChild(aufgabe_name_div);

    const aufgabe_status_div = document.createElement("div");
    aufgabe_status_div.classList.add("color-badge", status_color);
    aufgabe_status_div.innerText = status;
    aufgabe_table_row.appendChild(aufgabe_status_div);
    
    const aufgabe_mitarbeiter_div = document.createElement("div");
    aufgabe_mitarbeiter_div.classList.add("text-606", "medium");
    aufgabe_mitarbeiter_div.innerText = information.mitarbeiter[mitarbeiter_id].vorname + " " + information.mitarbeiter[mitarbeiter_id].nachname;
    aufgabe_table_row.appendChild(aufgabe_mitarbeiter_div);
    
    const aufgabe_voraussichtlicher_abschluss_div = document.createElement("div");
    aufgabe_voraussichtlicher_abschluss_div.classList.add("text-606", "medium");
    aufgabe_voraussichtlicher_abschluss_div.innerText = voraussichtliche_fertigstellung;
    aufgabe_table_row.appendChild(aufgabe_voraussichtlicher_abschluss_div);

    aufgabe_table_row.addEventListener("click", (event) => {
        location.href = "/aufgabe?id=" + aufgabe_id;
    });

    return aufgabe_table_row;
    
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

    // Projekt abrufen
    const projekt_ref = company_ref.collection("projects").doc(projekt_id);
    const projekt_snapshot = await projekt_ref.get();

    information.projekt = projekt_snapshot.data();
    information.projekt["id"] = projekt_id;

    // Aufgaben von Projekt abrufen
    projekt_snapshot.data()["aufgaben"].forEach(async (aufgaben_id) => {
        const aufgaben_doc = company_ref.collection("aufgaben").doc(aufgaben_id);
        const aufgaben_snapshot = await aufgaben_doc.get();

        information["aufgaben"][aufgaben_id] = aufgaben_snapshot.data();
    });

    // Dateien von Projekt abrufen
    projekt_snapshot.data()["dateien"].forEach(async (datei_id) => {
        const datei_doc = company_ref.collection("dateien").doc(datei_id);
        const datei_snapshot = await datei_doc.get();

        information["dateien"][datei_id] = datei_snapshot.data();
    });

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

function get_voraussichtliche_fertigstellung_string() {
    var highest_datum = "1970-01-01";

    for (aufgabe_id in information.aufgaben) {
        if (information.aufgaben[aufgabe_id].finished) {
            continue
        }

        if (information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum > highest_datum) {
            highest_datum = information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum;
        }
    }

    if (highest_datum == "1970-01-01") {
        return "Alle Aufgaben abgeschlossen";
    }

    return datestring_to_visual_date(highest_datum)
}

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];

    heading.innerText = information["projekt"]["titel"];

    days_left_text.innerText = get_tage_differenz(get_today_string(), information.projekt.deadline);

    projektinfos_auftraggeber.innerText = information.projekt.auftraggeber;
    projektinfos_auftragssumme.innerText = formatEuro(information["projekt"]["dealvolumen"]);
    projektinfos_deadline.innerText = datestring_to_visual_date(information["projekt"]["deadline"]);
    projektinfos_voraussichtliche_fertigstellung.innerText = get_voraussichtliche_fertigstellung_string();
    projektinfos_beschreibung.innerText = information.projekt.beschreibung;

    for (datei_id in information.dateien) {
        const projektdatei_table_row = get_projektdokument_table_row(
            information.dateien[datei_id].file_id,
            information.dateien[datei_id].titel
        )

        document.getElementById("projektdokumente_rows").appendChild(projektdatei_table_row);
    }

    var aufgaben_abgeschlossen = 0;

    for (aufgaben_id in information.aufgaben) {
        if (information.aufgaben[aufgaben_id].finished) {
            aufgaben_abgeschlossen++;
        }

        const aufgabe_table_row = get_aufgaben_table_row(
            aufgaben_id,
            information.aufgaben[aufgaben_id].titel,
            "Offen",
            "green",
            information.aufgaben[aufgaben_id].verantwortlicher,
            datestring_to_visual_date(information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum)
        );

        document.getElementById("aufgaben_rows").appendChild(aufgabe_table_row);
    }

    document.getElementById("aufgaben_counter").innerText = aufgaben_abgeschlossen + " / " + information.projekt.aufgaben.length;

    aufgaben_progress_bar.width = ((aufgaben_abgeschlossen / information.projekt.aufgaben.length) * 100) + "%";

    breadcrum_projekt.innerText = information.projekt.titel;

    projekt_bearbeiten_projektname_input.value = information.projekt.titel;
    projekt_bearbeiten_auftraggeber_input.value = information.projekt.auftraggeber;
    projekt_bearbeiten_deadline_input.value = information.projekt.deadline;
    projekt_bearbeiten_beschreibung_input.value = information.projekt.beschreibung;
    projekt_bearbeiten_auftragssumme_input.value = information.projekt.dealvolumen;
    
    for (mitarbeiter_id in information.mitarbeiter) {
        const mitarbeiter_option = document.createElement("option");
        mitarbeiter_option.value = mitarbeiter_id;
        mitarbeiter_option.innerText = information.mitarbeiter[mitarbeiter_id].vorname + " " + information.mitarbeiter[mitarbeiter_id].nachname;
        aufgabe_erstellen_mitarbeiter_select.appendChild(mitarbeiter_option);
    }
}

async function buildPage_admin(user) {
    breadcrum_home_text.innerText = "Meine Projektübersicht";
}

async function buildPage_staff(user) {
    breadcrum_home_text.innerText = "Meine Aufgabenübersicht";

    projekt_bearbeiten_button.remove();
    projekt_bearbeiten_overlay.remove();
    file_upload_button.remove();
    file_upload_overlay.remove();
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

        if (information["user"]["rolle"] == "admin") {
            await buildPage_admin(user);
        }
        else if (information["user"]["rolle"] == "staff") {
            await buildPage_staff(user);
        }

        remove_overlay();

    } else {
        location.href = "/";
    }
});