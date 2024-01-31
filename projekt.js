// v1.0.20

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

const projekt_fertigstellen_button = document.getElementById("projekt_fertigstellen_button");

const status_badge = document.getElementById("status_badge");

const projektdokumente_rows = document.getElementById("projektdokumente_rows");
const aufgaben_rows = document.getElementById("aufgaben_rows");

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

projekt_fertigstellen_button.addEventListener("click", () => {
    projekt_fertigstellen();
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

function create_div(klassen=[], inner_text="", styles={}) {
    const new_div = document.createElement("div");
    
    klassen.forEach((klasse) => {
        new_div.classList.add(klasse);
    });

    new_div.innerText = inner_text;

    for (s in styles) {
        new_div.style[s] = styles[s];
    }

    return new_div
}

function set_card_to_message(card_id, message) {
    const message_div = create_div(["text-100", "medium"], message, {textAlign: "center"});
    const card = document.getElementById(card_id);
    
    card.parentElement.appendChild(message_div);
    card.remove();
}

function create_aufgabe_table_row(aufgabe_id, status) {

    const aufgabe_data = information.aufgaben[aufgabe_id];
    const verantwortlicher = information.mitarbeiter[aufgabe_data.verantwortlicher].vorname + " " + information.mitarbeiter[aufgabe_data.verantwortlicher].nachname;

    const aufgabe_table_data_row = document.createElement("div");
    aufgabe_table_data_row.classList.add("aufgabe-table-data-row");

    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "bold"], inner_text=aufgabe_data.titel, {justifySelf: "start"}));
    aufgabe_table_data_row.appendChild(create_div(klassen=["badge", status.color], inner_text=status.label));
    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=verantwortlicher));
    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=datestring_to_visual_date(aufgabe_data.prognostiziertes_abschlussdatum)));

    aufgabe_table_data_row.addEventListener("click", () => {
        location.href = "/aufgabe?id=" + aufgabe_id;
    });

    return aufgabe_table_data_row
}

function create_datei_table_row(datei_id) {

    const datei_table_data_row = create_div(klassen=["datei-table-data-row"]);

    const datei_data = information.dateien[datei_id];
    const ersteller = information.mitarbeiter[datei_data.ersteller].vorname + " " + information.mitarbeiter[datei_data.ersteller].nachname;

    const datei_a = document.createElement("a");
    datei_a.classList.add("text-100", "bold");
    datei_a.innerText = datei_data.titel;
    datei_a.href = "#";
    datei_a.setAttribute("onClick", "javascript: downloadFile('" + datei_data.file_id + "');");
    datei_a.style.justifySelf = "start";

    datei_table_data_row.appendChild(datei_a);
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=formatFileSize(datei_data.size)));
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=datestring_to_visual_date(datei_data.erstellungsdatum)));
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=ersteller));

    const close_icon_wrapper = create_div(klassen=["close-icon-wrapper"]);
    close_icon_wrapper.appendChild(create_div(klassen=["close-icon-line-3", "first"]));
    close_icon_wrapper.appendChild(create_div(klassen=["close-icon-line-3", "second"]));

    close_icon_wrapper.setAttribute("onClick", "javascript: deleteFile('" + datei_data.file_id + "')");
    
    datei_table_data_row.appendChild(close_icon_wrapper);

    return datei_table_data_row
}

function get_tage_differenz(von, bis) {
    if (von == "-" || bis == "-" || bis == null) {
        return "-";
    }

    var date1 = new Date(von);
    var date2 = new Date(bis);

    var millis = date2 - date1;

    return millis / (1000 * 60 * 60 * 24);
}

function formatFileSize(bytes) {
    if (bytes === 0 || bytes === undefined) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));

    return Math.round(10 * (bytes / Math.pow(k, i))) / 10 + ' ' + sizes[i];
}

function projekt_fertigstellen() {
    const docRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

    docRef.update({
        finished: true
    })
    .then(() => {
        console.log("Projekt erfolgreich abgeschlossen");
        location.reload();
    })
    .catch((error) => {
        console.error("Fehler beim abschließen des Projekts:", error);
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
                titel: file.name,
                size: file.size
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

function get_projekt_status() {
    var alle_aufgaben_abgeschlossen = true;

    if (information.projekt.finished) {
        return {
            label: "Abgeschlossen",
            color: "green"
        }
    }

    for (aufgaben_id in information.aufgaben) {
        if (!information.aufgaben[aufgaben_id].finished) {
            alle_aufgaben_abgeschlossen = false;
        }

        if (information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum == null) {
            return {
                label: "Handlungsbedarf",
                color: "red"
            }
        }

        if (get_today_string() > information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum) {
            return {
                label: "Handlungsbedarf",
                color: "red"
            }
        }
    }

    if (get_today_string() > information.projekt.deadline) {
        return {
            label: "Überzogen",
            color: "red"
        }
    }

    if (alle_aufgaben_abgeschlossen) {
        return {
            label: "Bereit",
            color: "blue"
        }
    }

    return {
        label: "Offen",
        color: "orange"
    }
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

        if (information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum == null) {
            highest_datum = null;
            continue
        }

        if (information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum > highest_datum) {
            highest_datum = information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum;
        }
    }

    if (highest_datum == "1970-01-01" || highest_datum == null) {
        return "-";
    }

    return datestring_to_visual_date(highest_datum)
}

function get_aufgabe_status(aufgaben_id) {
    if (information.aufgaben[aufgaben_id].finished) {
        return {
            label: "Abgeschlossen",
            color: "green"
        }
    }

    if (information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum == null) {
        return {
            label: "Handlungsbedarf",
            color: "red"
        }
    }

    if (get_today_string() > information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum) {
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
        projektdokumente_rows.appendChild(create_datei_table_row(datei_id));
    }

    if (information.dateien.length == 0) {
        set_card_to_message("projektdokumente_card", "Es wurden noch keine Dokumente hinzugefügt");
    }

    var aufgaben_abgeschlossen = 0;

    for (aufgabe_id in information.aufgaben) {
        if (information.aufgaben[aufgabe_id].finished) {
            aufgaben_abgeschlossen++;
        }

        const status = get_aufgabe_status(aufgabe_id);
        aufgaben_rows.appendChild(create_aufgabe_table_row(aufgabe_id, status));
    }

    document.getElementById("aufgaben_counter").innerText = aufgaben_abgeschlossen + " / " + information.projekt.aufgaben.length;

    if (information.projekt.aufgaben.length == 0) {
        aufgaben_progress_bar.style.width = "0%";

        set_card_to_message("aufgaben_card", "Es wurden noch keine Aufgaben erstellt");
    }
    else {
        aufgaben_progress_bar.style.width = ((aufgaben_abgeschlossen / information.projekt.aufgaben.length) * 100) + "%";
    }

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

    const status = get_projekt_status();

    status_badge.classList.add(status.color);
    status_badge.innerText = status.label;
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
    projekt_fertigstellen_button.remove();
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