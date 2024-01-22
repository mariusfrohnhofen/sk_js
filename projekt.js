//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const heading = document.getElementById("heading");
const projektinfos_auftraggeber = document.getElementById("projektinfos_auftraggeber");
const projektinfos_auftragssumme = document.getElementById("projektinfos_auftragssumme");
const projektinfos_deadline = document.getElementById("projektinfos_deadline");
const projektinfos_voraussichtliche_fertigstellung = document.getElementById("projektinfos_voraussichtliche_fertigstellung");

const breadcrum_projekt = document.getElementById("breadcrum_projekt");
const breadcrum_home_text = document.getElementById("breadcrum_home_text");

const aufgaben_counter = document.getElementById("aufgaben_counter");

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

function get_projektdokument_table_row(file_id, titel) {
    const table_row_div = document.createElement("div");
    table_row_div.classList.add("data-table-row-2", "doc");

    const projektdokument_a = document.createElement("a");
    projektdokument_a.classList.add("doc-link");
    projektdokument_a.innerText = titel;
    projektdokument_a.href = "#";
    projektdokument_a.setAttribute("onClick", "javascript: downloadFile('" + file_id + "');")

    table_row_div.appendChild(projektdokument_a);

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
}

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];

    heading.innerText = information["projekt"]["titel"];

    projektinfos_auftraggeber.innerText = information["projekt"]["auftraggeber"];
    projektinfos_auftragssumme.innerText = formatEuro(information["projekt"]["dealvolumen"]);
    projektinfos_deadline.innerText = datestring_to_visual_date(information["projekt"]["deadline"]);
    projektinfos_voraussichtliche_fertigstellung.innerText = "VORAUSSICHTLICHE FERTIGSTELLUNG";

    for (datei_id in information.dateien) {
        const projektdatei_table_row = get_projektdokument_table_row(
            information.dateien[datei_id].file_id,
            information.dateien[datei_id].file_id
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

    breadcrum_projekt.innerText = information.projekt.titel;
}

async function buildPage_admin(user) {
    breadcrum_home_text.innerText = "Meine Projektübersicht";
}

async function buildPage_staff(user) {
    breadcrum_home_text.innerText = "Meine Aufgabenübersicht";
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

    } else {
        location.href = "/";
    }
});