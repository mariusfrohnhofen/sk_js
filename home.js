//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const admin_data_table = document.getElementById("admin_data_table");
const staff_data_table = document.getElementById("staff_data_table");

const alle_projekte_tables = document.getElementById("alle_projekte_tables");
const alle_aufgaben_tables = document.getElementById("alle_aufgaben_tables");
const handlungsbedarf_tables = document.getElementById("handlungsbedarf_tables");

// Tabellen ausblenden
alle_projekte_tables.style.display = "none";
alle_aufgaben_tables.style.display = "none";
handlungsbedarf_tables.style.display = "none";

const currentPath = window.location.pathname;

var information = {
    "user": {},
    "company": {},
    "projekte": {},
    "aufgaben": {},
    "mitarbeiter": {}
};

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);

        fileRef.put(file).then((snapshot) => {
            console.log('File Uploaded Successfully!');
            // Hier könntest du weitere Aktionen ausführen, z.B. die URL der hochgeladenen Datei verwenden.
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    } else {
        console.error('No file selected.');
    }
}

function datestring_to_visual_date(datestring) {
    if (datestring == null) {
        return "-";
    }

    var date_parts = datestring.split("-");

    return `${date_parts[2]}.${date_parts[1]}.${date_parts[0]}`;
}

function formatEuro(number) {
    // Die 'de-DE' Locale wird verwendet, um das Euro-Format zu erzwingen
    const formattedEuro = number.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
  
    return formattedEuro;
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

function get_today_string() {
    var heute = new Date();
    var jahr = heute.getFullYear();
    var monat = ('0' + (heute.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, deshalb +1
    var tag = ('0' + heute.getDate()).slice(-2);
    return jahr + '-' + monat + '-' + tag;
}

function get_data_table_row(projekt_id, titel, status, status_color, aufgaben_abgeschlossen, aufgaben_gesamt, auftraggeber, prognostizierte_fertigstellung, deadline, dealvolumen) {
    const data_table_row = document.createElement("div");
    data_table_row.classList.add("data-table-row");

    const titel_div = document.createElement("div");
    titel_div.classList.add("text-100", "bold", "color-neutral-800");
    titel_div.innerText = titel;
    data_table_row.appendChild(titel_div);

    const status_div = document.createElement("div");
    status_div.classList.add("color-badge", status_color);
    status_div.innerText = status;
    data_table_row.appendChild(status_div);

    const aufgaben_div = document.createElement("div");
    aufgaben_div.classList.add("text-100", "medium");
    aufgaben_div.innerText = aufgaben_abgeschlossen + " / " + aufgaben_gesamt;
    data_table_row.appendChild(aufgaben_div);

    const auftraggeber_div = document.createElement("div");
    auftraggeber_div.classList.add("text-100", "medium");
    auftraggeber_div.innerText = auftraggeber;
    data_table_row.appendChild(auftraggeber_div);

    const prognostizierte_fertigstellung_div = document.createElement("div");
    prognostizierte_fertigstellung_div.classList.add("text-100", "medium");
    prognostizierte_fertigstellung_div.innerText = prognostizierte_fertigstellung;
    data_table_row.appendChild(prognostizierte_fertigstellung_div);

    const tage_bis_deadline_div = document.createElement("div");
    tage_bis_deadline_div.classList.add("text-100", "medium");
    tage_bis_deadline_div.innerText = get_tage_differenz(get_today_string(), deadline);
    data_table_row.appendChild(tage_bis_deadline_div);

    const deadline_div = document.createElement("div");
    deadline_div.classList.add("text-100", "medium");
    deadline_div.innerText = deadline;
    data_table_row.appendChild(deadline_div);

    const dealvolumen_div = document.createElement("div");
    dealvolumen_div.classList.add("text-100", "medium");
    dealvolumen_div.innerText = dealvolumen;
    data_table_row.appendChild(dealvolumen_div);

    data_table_row.addEventListener("click", (event) => {
        location.href = "/projekt?id=" + projekt_id;
    });

    return data_table_row;
}

function get_aufgabe_table_row(aufgabe_id, titel, status, status_color, projektname, prognostizierte_fertigstellung) {
    const data_table_row = document.createElement("div");
    data_table_row.classList.add("data-table-row", "custom-data-table-row");

    const titel_div = document.createElement("div");
    titel_div.classList.add("text-100", "bold", "color-neutral-800");
    titel_div.innerText = titel;
    data_table_row.appendChild(titel_div);

    const status_div = document.createElement("div");
    status_div.classList.add("color-badge", status_color);
    status_div.innerText = status;
    data_table_row.appendChild(status_div);

    const projekt_div = document.createElement("div");
    projekt_div.classList.add("text-100", "medium");
    projekt_div.innerText = projektname;
    data_table_row.appendChild(projekt_div);

    const prognostizierte_fertigstellung_div = document.createElement("div");
    prognostizierte_fertigstellung_div.classList.add("text-100", "medium");
    prognostizierte_fertigstellung_div.innerText = prognostizierte_fertigstellung;
    data_table_row.appendChild(prognostizierte_fertigstellung_div);

    data_table_row.addEventListener("click", (event) => {
        location.href = "/aufgabe?id=" + aufgabe_id;
    });

    return data_table_row;
}

function get_fertigstellung_datum(projekt_id) {
    var highest = "1970-01-01";

    information.projekte[projekt_id].aufgaben.forEach((aufgaben_id) => {
        if (information.aufgaben[aufgaben_id].finished) {
            return
        }

        if (information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum == null) {
            highest = null;
            return
        }

        if (information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum > highest) {
            highest = information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum;
        }
    });

    if (highest == "1970-01-01" || highest == null) {
        return "-"
    }

    return highest
}

function get_projekt_id_from_aufgaben_id(aufgaben_id) {
    var found_projekt_id = null;

    for (projekt_id in information.projekte) {
        information.projekte[projekt_id].aufgaben.forEach((a_id) => {
            if (a_id == aufgaben_id) {
                found_projekt_id = projekt_id;
            }
        });
    }

    return found_projekt_id
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

    // Projekte der Firma abrufen
    const projekte_ref = company_ref.collection("projects");
    const projekte_snapshot = await projekte_ref.get();

    projekte_snapshot.forEach((projekte_doc) => {
        information["projekte"][projekte_doc.id] = projekte_doc.data();

        // Aufgaben von Projekt abrufen
        projekte_doc.data()["aufgaben"].forEach(async (aufgaben_id) => {
            const aufgaben_doc = company_ref.collection("aufgaben").doc(aufgaben_id);
            const aufgaben_snapshot = await aufgaben_doc.get();

            information["aufgaben"][aufgaben_id] = aufgaben_snapshot.data();
        })
    })

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

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];
}

async function buildPage_admin(user) {

    alle_projekte_tables.style.display = "block";
    handlungsbedarf_tables.style.display = "none";
    alle_aufgaben_tables.style.display = "none";
    
    for (projekt_id in information.projekte) {

        var aufgaben_abgeschlossen = 0;

        information["projekte"][projekt_id]["aufgaben"].forEach((aufgaben_id) => { 
            if (information["aufgaben"][aufgaben_id]["finished"]) {
                aufgaben_abgeschlossen++;
            }
        });
        
        const data_table_row = get_data_table_row(
            projekt_id,
            information["projekte"][projekt_id]["titel"],
            "Offen",
            "green",
            aufgaben_abgeschlossen,
            information["projekte"][projekt_id]["aufgaben"].length,
            information["projekte"][projekt_id]["auftraggeber"],
            get_fertigstellung_datum(projekt_id),
            datestring_to_visual_date(information.projekte[projekt_id].deadline),
            formatEuro(information["projekte"][projekt_id]["dealvolumen"])
        );

        document.getElementById("project_rows_div").appendChild(data_table_row);
    }
}

async function buildPage_staff(user) {

    alle_projekte_tables.style.display = "none";
    alle_aufgaben_tables.style.display = "block";

    for (aufgabe_id in information.aufgaben) {

        if (information.aufgaben[aufgabe_id]["verantwortlicher"] != information.user["id"]) {
            continue
        }

        const status = get_aufgabe_status(aufgabe_id);

        if (information.aufgaben[aufgabe_id]["prognostiziertes_abschlussdatum"] == null) {
            handlungsbedarf_tables.style.display = "block";

            const aufgabe_table_row = get_aufgabe_table_row(
                aufgabe_id,
                information.aufgaben[aufgabe_id].titel,
                status.label,
                status.color,
                information.projekte[get_projekt_id_from_aufgaben_id(aufgabe_id)].titel,
                datestring_to_visual_date(information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum)
            )

            document.getElementById("handlungsbedarf_rows_div").appendChild(aufgabe_table_row);
        }
        else {
            const aufgabe_table_row = get_aufgabe_table_row(
                aufgabe_id,
                information.aufgaben[aufgabe_id].titel,
                status.label,
                status.color,
                information.projekte[get_projekt_id_from_aufgaben_id(aufgabe_id)].titel,
                datestring_to_visual_date(information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum)
            )

            document.getElementById("aufgaben_rows_div").appendChild(aufgabe_table_row);
        }
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