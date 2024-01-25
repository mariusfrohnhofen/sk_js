// v1.0.16

//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const heading = document.getElementById("heading");
const aufgabeninfos_mitarbeiter = document.getElementById("aufgabeninfos_mitarbeiter");
const aufgabeninfos_voraussichtliche_fertigstellung = document.getElementById("aufgabeninfos_voraussichtliche_fertigstellung");
const aufgabeninfos_beschreibung = document.getElementById("aufgabeninfos_beschreibung");

const zum_projekt_button = document.getElementById("zum_projekt_button");

const file_upload_overlay = document.getElementById("file_upload_overlay");
const file_upload_button = document.getElementById("file_upload_button");
const file_upload_input_field = document.getElementById("file_upload_input_field");
const file_upload_cancel_button = document.getElementById("file_upload_cancel_button");
var file_upload_submit_button = document.getElementById("file_upload_submit_button");

const aufgabe_bearbeiten_overlay = document.getElementById("aufgabe_bearbeiten_overlay");
const aufgabe_bearbeiten_aufgabenname_input = document.getElementById("aufgabe_bearbeiten_aufgabenname_input");
const aufgabe_bearbeiten_mitarbeiter_select = document.getElementById("aufgabe_bearbeiten_mitarbeiter_select");
const aufgabe_bearbeiten_aufgabeninhalt_input = document.getElementById("aufgabe_bearbeiten_aufgabeninhalt_input");
const aufgabe_bearbeiten_button = document.getElementById("aufgabe_bearbeiten_button");
const aufgabe_bearbeiten_cancel_button = document.getElementById("aufgabe_bearbeiten_cancel_button");
const aufgabe_bearbeiten_voraussichtliche_fertigstellung_input = document.getElementById("aufgabe_bearbeiten_voraussichtliche_fertigstellung_input");
var aufgabe_bearbeiten_submit_button = document.getElementById("aufgabe_bearbeiten_submit_button");

const aufgabe_fertigstellen_button = document.getElementById("aufgabe_fertigstellen_button");

const breadcrum_projekt = document.getElementById("breadcrum_projekt");
const breadcrum_aufgabe = document.getElementById("breadcrum_aufgabe");
const breadcrum_home_text = document.getElementById("breadcrum_home_text");

const aufgabe_reminder_container = document.getElementById("aufgabe_reminder_container");
const aufgabe_reminder_speichern_button = document.getElementById("aufgabe_reminder_speichern_button");
const aufgabe_reminder_input_field = document.getElementById("aufgabe_reminder_input_field");

const status_badge = document.getElementById("status_badge");

const days_left_text = document.getElementById("days_left_text");

const currentPath = window.location.pathname;

function get_tage_differenz(von, bis) {
    if (von == "-" || bis == "-" || bis == null) {
        return "-";
    }

    var date1 = new Date(von);
    var date2 = new Date(bis);

    var millis = date2 - date1;

    return millis / (1000 * 60 * 60 * 24);
}

function get_today_string() {
    var heute = new Date();
    var jahr = heute.getFullYear();
    var monat = ('0' + (heute.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, deshalb +1
    var tag = ('0' + heute.getDate()).slice(-2);
    return jahr + '-' + monat + '-' + tag;
}

aufgabe_reminder_input_field.type = "date";
aufgabe_reminder_input_field.min = get_today_string();

aufgabe_bearbeiten_voraussichtliche_fertigstellung_input.type = "date";

var information = {
    "user": {},
    "company": {},
    "projekt": {},
    "aufgabe": {},
    "dateien": {},
    "mitarbeiter": {}
};
file_upload_input_field.type = "file";
file_upload_overlay.style.display = "none";
file_upload_button.addEventListener("click", () => {
    file_upload_overlay.style.display = "block";
});

aufgabe_bearbeiten_button.addEventListener("click", () => {
    aufgabe_bearbeiten_overlay.style.display = "block";
});

aufgabe_bearbeiten_cancel_button.addEventListener("click", () => {
    aufgabe_bearbeiten_overlay.style.display = "none";
});

file_upload_cancel_button.addEventListener("click", () => {
    file_upload_overlay.style.display = "none";
})

aufgabe_bearbeiten_overlay.style.display = "none";

file_upload_submit_button.type = "button";
var newButton = file_upload_submit_button.cloneNode(true);
file_upload_submit_button.parentNode.replaceChild(newButton, file_upload_submit_button);

file_upload_submit_button = newButton;
file_upload_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    uploadFile();
});

aufgabe_fertigstellen_button.addEventListener("click", () => {
    aufgabe_fertigstellen();
});

aufgabe_bearbeiten_submit_button.type = "button";
var newButton = aufgabe_bearbeiten_submit_button.cloneNode(true);
aufgabe_bearbeiten_submit_button.parentNode.replaceChild(newButton, aufgabe_bearbeiten_submit_button);

aufgabe_bearbeiten_submit_button = newButton;
aufgabe_bearbeiten_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    changeAufgabe();
});

aufgabe_reminder_speichern_button.addEventListener("click", function(event) {
    const eingabe_datum = aufgabe_reminder_input_field.value;

    if (eingabe_datum == "") {
        return
    }

    put_aufgabendate_to_db(eingabe_datum);
});

function aufgabe_fertigstellen() {
    const docRef = db.collection("companies").doc(information.company.id).collection("aufgaben").doc(information.aufgabe.id);

    docRef.update({
        finished: true
    })
    .then(() => {
        console.log("Aufgabe erfolgreich abgeschlossen");
        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim abschließen der Aufgabe:", error);
    });
}

function get_aufgabe_status() {
    if (information.aufgabe.finished) {
        return {
            label: "Abgeschlossen",
            color: "green"
        }
    }

    if (information.aufgabe.prognostiziertes_abschlussdatum == null) {
        return {
            label: "Handlungsbedarf",
            color: "red"
        }
    }

    if (get_today_string() > information.aufgabe.prognostiziertes_abschlussdatum) {
        return {
            label: "Überzogen",
            color: "red"
        }
    }

    return {
        label: "Offen",
        color: "orange"
    }
}

function put_aufgabendate_to_db(aufgabendate) {
    const documentRef = db.collection("companies").doc(information.company.id).collection("aufgaben").doc(information.aufgabe.id);

    documentRef.update({
        prognostiziertes_abschlussdatum: aufgabendate
    })
    .then(() => {
        console.log("Prognostiziertes Aufgabendate in DB eingetragen");

        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim schreiben in DB:", error);
    });
}

function changeAufgabe() {
    const new_aufgabenname = aufgabe_bearbeiten_aufgabenname_input.value;
    const new_zustaendiger = aufgabe_bearbeiten_mitarbeiter_select.value;
    const new_aufgabeninhalt = aufgabe_bearbeiten_aufgabeninhalt_input.value;
    var new_voraussichtliche_fertigstellung = aufgabe_bearbeiten_voraussichtliche_fertigstellung_input.value;

    if (new_voraussichtliche_fertigstellung == "") {
        new_voraussichtliche_fertigstellung = null;
    }

    const docRef = db.collection("companies").doc(information.company.id).collection("aufgaben").doc(information.aufgabe.id);

    docRef.update({
        titel: new_aufgabenname,
        verantwortlicher: new_zustaendiger,
        beschreibung: new_aufgabeninhalt,
        prognostiziertes_abschlussdatum: new_voraussichtliche_fertigstellung
    })
    .then(() => {
        console.log("Aufgabe bearbeitet");
        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim Bearbeiten der Aufgabe:", error);
    });
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

                    const documentRef = db.collection("companies").doc(information.company.id).collection("aufgaben").doc(information.aufgabe.id);

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

        }).catch((error) => {
            console.error("Error uploading file");
        });
    } else {
        console.error("No file selected.");
    }
}

function deleteFile(file_id) {
    for (const datei_id in information.dateien) {
        if (information.dateien[datei_id].file_id !== file_id) {
            continue
        }

        const documentRef = db.collection("companies").doc(information.company.id).collection("aufgaben").doc(information.aufgabe.id);

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

function downloadFile(filePath, fileName) {
    // Referenz auf die Datei erstellen
    const fileRef = storage.ref().child(filePath);

    // Download-URL für die Datei abrufen
    fileRef.getDownloadURL().then((downloadURL) => {
        // Erstellen eines unsichtbaren <a>-Elements zum Herunterladen
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = fileName;

        // An das Dokument anhängen
        document.body.appendChild(link);

        // Klick auf das unsichtbare <a>-Element, um den Download zu starten
        link.click();

        // Das <a>-Element entfernen, da es nicht mehr benötigt wird
        document.body.removeChild(link);
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Download-URL:", error);
    });
}

function get_aufgabenergebnis_data_row(file_id, file_name, erstellungsdatum, ersteller) {
    const table_row_div = document.createElement("div");
    table_row_div.classList.add("data-table-row-3", "ergebnisse");

    const aufgabenergebnis_dateiname_a = document.createElement("a");
    aufgabenergebnis_dateiname_a.classList.add("doc-link");
    aufgabenergebnis_dateiname_a.innerText = file_name;
    aufgabenergebnis_dateiname_a.href = "#";
    aufgabenergebnis_dateiname_a.setAttribute("onClick", "javascript: downloadFile('" + file_id + "', '" + file_name + "');");
    aufgabenergebnis_dateiname_a.setAttribute("file_id", file_id);
    table_row_div.appendChild(aufgabenergebnis_dateiname_a);

    const aufgabenergebnis_datum_div = document.createElement("div");
    aufgabenergebnis_datum_div.classList.add("text-612", "medium");
    aufgabenergebnis_datum_div.innerText = datestring_to_visual_date(erstellungsdatum);
    table_row_div.appendChild(aufgabenergebnis_datum_div);

    const aufgabenergebnis_mitarbeiter_div = document.createElement("div");
    aufgabenergebnis_mitarbeiter_div.classList.add("text-612", "medium");
    aufgabenergebnis_mitarbeiter_div.innerText = information.mitarbeiter[ersteller].vorname + " " + information.mitarbeiter[ersteller].nachname;
    table_row_div.appendChild(aufgabenergebnis_mitarbeiter_div);

    const aufgabenergebnis_close_icon_wrapper_div = document.createElement("div");
    aufgabenergebnis_close_icon_wrapper_div.classList.add("close-icon-wrapper", "dateien");
    const close_icon_first = document.createElement("div");
    close_icon_first.classList.add("close-icon-line-4", "first");
    const close_icon_second = document.createElement("div");
    close_icon_second.classList.add("close-icon-line-4", "second");
    aufgabenergebnis_close_icon_wrapper_div.appendChild(close_icon_first);
    aufgabenergebnis_close_icon_wrapper_div.appendChild(close_icon_second);
    aufgabenergebnis_close_icon_wrapper_div.setAttribute("onClick", "javascript: deleteFile('" + file_id + "')");
    table_row_div.appendChild(aufgabenergebnis_close_icon_wrapper_div);

    return table_row_div;
}

async function getInformation(user) {
    const usermatching_info = await db.collection("usermatching").doc("WJobxOFznceM4Cw1hRZd").get();

    const aufgaben_id = new URLSearchParams(window.location.search).get("id");

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
    
    // Aufgabe abrufen
    const aufgaben_doc = company_ref.collection("aufgaben").doc(aufgaben_id);
    const aufgaben_snapshot = await aufgaben_doc.get();

    information["aufgabe"] = aufgaben_snapshot.data();
    information["aufgabe"]["id"] = aufgaben_id;


    // Projekte der Firma abrufen
    const projekte_ref = company_ref.collection("projects");
    const projekte_snapshot = await projekte_ref.get();

    projekte_snapshot.forEach((projekte_doc) => {

        // Aufgaben von Projekt abrufen
        projekte_doc.data()["aufgaben"].forEach(async (id) => {
            if (id == aufgaben_id) {

                information["projekt"] = projekte_doc.data();
            }
        })
    })

    // Dateien von Aufgabe abrufen
    aufgaben_snapshot.data()["dateien"].forEach(async (datei_id) => {
        const datei_doc = company_ref.collection("dateien").doc(datei_id);
        const datei_snapshot = await datei_doc.get();

        information["dateien"][datei_id] = datei_snapshot.data();
    });


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

    heading.innerText = information["aufgabe"]["titel"];

    aufgabeninfos_mitarbeiter.innerText = information.mitarbeiter[information["aufgabe"]["verantwortlicher"]].vorname + " " + information.mitarbeiter[information["aufgabe"]["verantwortlicher"]].nachname;
    aufgabeninfos_voraussichtliche_fertigstellung.innerText = datestring_to_visual_date(information.aufgabe.prognostiziertes_abschlussdatum);
    aufgabeninfos_beschreibung.innerText = information.aufgabe.beschreibung;

    zum_projekt_button.href = "/projekt?id=" + information.projekt.id;

    information.aufgabe.dateien.forEach((datei_id) => {

        const aufgabenergebnis_table_row = get_aufgabenergebnis_data_row(
            information.dateien[datei_id].file_id,
            information.dateien[datei_id].titel,
            information.dateien[datei_id].erstellungsdatum,
            information.dateien[datei_id].ersteller
        )

        document.getElementById("aufgabenergebnisse_rows").appendChild(aufgabenergebnis_table_row);
    });

    if (information.aufgabe.prognostiziertes_abschlussdatum != null) {
        aufgabe_reminder_container.style.display = "none";
    }

    days_left_text.innerText = get_tage_differenz(get_today_string(), information.aufgabe.prognostiziertes_abschlussdatum);

    aufgabe_bearbeiten_aufgabenname_input.value = information.aufgabe.titel;
    aufgabe_bearbeiten_aufgabeninhalt_input.value = information.aufgabe.beschreibung;
    aufgabe_bearbeiten_voraussichtliche_fertigstellung_input.value = information.aufgabe.prognostiziertes_abschlussdatum;
    
    for (mitarbeiter_id in information.mitarbeiter) {
        const mitarbeiter_option = document.createElement("option");
        mitarbeiter_option.value = mitarbeiter_id;
        mitarbeiter_option.innerText = information.mitarbeiter[mitarbeiter_id].vorname + " " + information.mitarbeiter[mitarbeiter_id].nachname;
        aufgabe_bearbeiten_mitarbeiter_select.appendChild(mitarbeiter_option);
    }

    aufgabe_bearbeiten_mitarbeiter_select.value = information.aufgabe.verantwortlicher;

    breadcrum_projekt.href = "/projekt?id=" + information.projekt.id;
    breadcrum_projekt.getElementsByTagName("div")[0].innerText = information.projekt.titel;
    breadcrum_aufgabe.innerText = information.aufgabe.titel;

    const status = get_aufgabe_status();

    status_badge.classList.add(status.color);
    status_badge.innerText = status.label;
}

async function buildPage_admin(user) {
    breadcrum_home_text.innerText = "Meine Projektübersicht";
}

async function buildPage_staff(user) {
    breadcrum_home_text.innerText = "Meine Aufgabenübersicht";

    if (information.aufgabe.verantwortlicher != information.user.id) {
        aufgabe_bearbeiten_button.remove();
        aufgabe_bearbeiten_overlay.remove();
        aufgabe_fertigstellen_button.remove();
        aufgabe_reminder_container.remove();
    }
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