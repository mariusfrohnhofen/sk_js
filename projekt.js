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

const projekt_loeschen_icon = document.getElementById("projekt_loeschen_icon");
const projekt_loeschen_overlay = document.getElementById("projekt_loeschen_overlay");
const projekt_loeschen_info = document.getElementById("projekt_loeschen_info");
const projekt_loeschen_cancel_button = document.getElementById("projekt_loeschen_cancel_button");
const projekt_loeschen_submit_button = document.getElementById("projekt_loeschen_submit_button");

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

projekt_loeschen_overlay.style.display = "none";

projekt_bearbeiten_overlay.style.display = "none";
aufgabe_erstellen_overlay.style.display = "none";

projekt_loeschen_icon.addEventListener("click", () => {
    projekt_loeschen_overlay.style.display = "block";
});

projekt_loeschen_cancel_button.addEventListener("click", () => {
    projekt_loeschen_overlay.style.display = "none";
});

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

projekt_loeschen_submit_button.addEventListener("click", () => {
    delete_projekt();
});

aufgabe_erstellen_submit_button.type = "button";
var newButton = aufgabe_erstellen_submit_button.cloneNode(true);
aufgabe_erstellen_submit_button.parentNode.replaceChild(newButton, aufgabe_erstellen_submit_button);

aufgabe_erstellen_submit_button = newButton;
aufgabe_erstellen_submit_button.addEventListener("click", function(event) {
    event.preventDefault();
    createAufgabe();
});

function set_card_to_message(card_id, message) {
    const message_div = create_div(["text-100", "medium"], message, {textAlign: "center"});
    const card = document.getElementById(card_id);
    
    card.parentElement.appendChild(message_div);
    card.remove();
}

function delete_projekt() {

    const projektRef = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);

    projektRef.delete()
    .then(() => {
        console.log("Projekt gelöscht");

        location.href = "/home";
    })
    .catch((error) => {
        console.error("Fehler beim Löschen des Projekts:", error);
    });
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
    datei_a.setAttribute("onClick", "javascript: downloadFile('" + datei_id + "');");
    datei_a.style.justifySelf = "start";

    datei_table_data_row.appendChild(datei_a);
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=format_file_size(datei_data.size)));
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=datestring_to_visual_date(datei_data.erstellungsdatum)));
    datei_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=ersteller));

    const close_icon_wrapper = create_div(klassen=["close-icon-wrapper"]);
    close_icon_wrapper.appendChild(create_div(klassen=["close-icon-line-3", "first"]));
    close_icon_wrapper.appendChild(create_div(klassen=["close-icon-line-3", "second"]));

    close_icon_wrapper.setAttribute("onClick", "javascript: deleteFile('" + datei_id + "')");
    
    datei_table_data_row.appendChild(close_icon_wrapper);

    return datei_table_data_row
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

    const directory_id = uuidv4();
    const file_id = `${directory_id}/${normalize_filename(file.name)}`
    const file_path = `${information.company.id}/${information.projekt.id}/${file_id}`;

    if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file_path);

        fileRef.put(file).then((snapshot) => {
            console.log("File uploaded successfully");

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

projekt_bearbeiten_deadline_input.type = "date";
projekt_bearbeiten_deadline_input.min = get_today_string();

function changeProjekt() {
    const new_projektname = projekt_bearbeiten_projektname_input.value;
    const new_auftraggeber = projekt_bearbeiten_auftraggeber_input.value;
    const new_deadline = projekt_bearbeiten_deadline_input.value;
    const new_beschreibung = projekt_bearbeiten_beschreibung_input.value;
    const new_auftragssumme = parseFloat(projekt_bearbeiten_auftragssumme_input.value);

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

function downloadFile(datei_id) {
    const file_path = `${information.company.id}/${information.projekt.id}/${information.dateien[datei_id].file_id}`
    const fileRef = storage.ref().child(file_path);

    fileRef.getDownloadURL().then((downloadURL) => {
        window.open(downloadURL);
    }).catch((error) => {
        console.error("Fehler beim Abrufen der Download-URL:", error);
    });
}

function deleteFile(datei_id) {
    const document_ref = db.collection("companies").doc(information.company.id).collection("projects").doc(information.projekt.id);
    const file_path = `${information.company.id}/${information.projekt.id}/${information.dateien[datei_id].file_id}`

    document_ref.update({
        dateien: firebase.firestore.FieldValue.arrayRemove(datei_id)
    })
    .then(() => {
        console.log("Datei aus Array gelöscht");

        const dateiDocumentRef = db.collection("companies").doc(information.company.id).collection("dateien").doc(datei_id);

        dateiDocumentRef.delete()
        .then(() => {
            console.log("Dokument aus Collection gelöscht:", datei_id);

            const fileRef = storage.ref().child(file_path);

            fileRef.delete()
            .then(() => {
                console.log("Datei aus Storage gelöscht");
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

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];

    heading.innerText = information["projekt"]["titel"];

    days_left_text.innerText = get_tage_differenz(get_today_string(), information.projekt.deadline);

    projektinfos_auftraggeber.innerText = information.projekt.auftraggeber;
    projektinfos_auftragssumme.innerText = format_euro(information["projekt"]["dealvolumen"]);
    projektinfos_deadline.innerText = datestring_to_visual_date(information["projekt"]["deadline"]);
    projektinfos_voraussichtliche_fertigstellung.innerText = get_voraussichtliche_fertigstellung_string();
    projektinfos_beschreibung.innerText = information.projekt.beschreibung;

    for (datei_id in information.dateien) {
        projektdokumente_rows.appendChild(create_datei_table_row(datei_id));
    }

    if (Object.keys(information.dateien).length === 0) {
        set_card_to_message("projektdokumente_card", "Es wurde noch keine Datei hinzugefügt");
    }
    else {
        projekt_loeschen_info.innerText = "Bitte löschen Sie zuerst alle Projektdokumente.";
        projekt_loeschen_submit_button.remove();
    }

    var aufgaben_abgeschlossen = 0;

    for (aufgabe_id in information.aufgaben) {
        if (information.aufgaben[aufgabe_id].finished) {
            aufgaben_abgeschlossen++;
        }

        const status = get_aufgabe_status(information, aufgabe_id);
        aufgaben_rows.appendChild(create_aufgabe_table_row(aufgabe_id, status));
    }

    document.getElementById("aufgaben_counter").innerText = aufgaben_abgeschlossen + " / " + information.projekt.aufgaben.length;

    if (information.projekt.aufgaben.length === 0) {
        aufgaben_progress_bar.style.width = "0%";

        set_card_to_message("aufgaben_card", "Es wurde noch keine Aufgabe erstellt");
    }
    else {
        aufgaben_progress_bar.style.width = ((aufgaben_abgeschlossen / information.projekt.aufgaben.length) * 100) + "%";

        projekt_loeschen_info.innerText = "Bitte löschen Sie zuerst alle zugehörigen Aufgaben.";
        projekt_loeschen_submit_button.remove();
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

    const status = get_projekt_status(information, information.projekt.id);

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

    projekt_loeschen_icon.remove();
    projekt_loeschen_overlay.remove();
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