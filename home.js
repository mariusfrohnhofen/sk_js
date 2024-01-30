// v1.0.19

//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const admin_data_table = document.getElementById("admin_data_table");
const staff_data_table = document.getElementById("staff_data_table");

const alle_projekte_tables = document.getElementById("alle_projekte_tables");
const alle_aufgaben_tables = document.getElementById("alle_aufgaben_tables");

const heading = document.getElementById("heading");
const create_new_project_button = document.getElementById("create_new_project_button");

const projects_section_container = document.getElementById("projects_section_container");
const aufgaben_section_container = document.getElementById("aufgaben_section_container");

const currentPath = window.location.pathname;

var information = {
    "user": {},
    "company": {},
    "projekte": {},
    "aufgaben": {},
    "mitarbeiter": {}
};

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

function create_aufgabe_table_row(aufgabe_id, status) {
    const projekt_id = get_projekt_id_from_aufgaben_id(aufgabe_id);

    const aufgabe_table_data_row = document.createElement("div");
    aufgabe_table_data_row.classList.add("aufgabe-table-data-row");

    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "bold"], inner_text=information.aufgaben[aufgabe_id].titel, {justifySelf: "start"}));
    aufgabe_table_data_row.appendChild(create_div(klassen=["badge", status.color], inner_text=status.label));
    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=information.projekte[projekt_id].titel, {justifySelf: "start"}));
    aufgabe_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=datestring_to_visual_date(information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum)));

    aufgabe_table_data_row.addEventListener("click", (event) => {
        location.href = "/aufgabe?id=" + aufgabe_id;
    });

    return aufgabe_table_data_row
}

function create_projekt_table_row(projekt_id, status) {
    const projekt_table_data_row = document.createElement("projekt-table-data-row");
    projekt_table_data_row.classList.add("projekt-table-data-row");


    var aufgaben_abgeschlossen = 0;

    information["projekte"][projekt_id]["aufgaben"].forEach((aufgaben_id) => { 
        if (information["aufgaben"][aufgaben_id]["finished"]) {
            aufgaben_abgeschlossen++;
        }
    });

    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "bold"], inner_text=information.projekte[projekt_id].titel, {justifySelf: "start"}));
    projekt_table_data_row.appendChild(create_div(klassen=["badge", status.color], inner_text=status.label));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=`${aufgaben_abgeschlossen}/${information['projekte'][projekt_id]['aufgaben'].length}`));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=information.projekte[projekt_id].auftraggeber, {justifySelf: "start"}));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=datestring_to_visual_date(get_fertigstellung_datum(projekt_id))));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=`${get_tage_differenz(get_today_string(), information.projekte[projekt_id].deadline)} Tage`));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=formatEuro(information.projekte[projekt_id].dealvolumen)));

    projekt_table_data_row.addEventListener("click", (event) => {
        location.href = "/projekt?id=" + projekt_id;
    });
    
    return projekt_table_data_row
}

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
    if (datestring == null || datestring == "-") {
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

function get_projekt_status(projekt_id) {
    var condition_found = false;
    var status = null;
    var alle_aufgaben_abgeschlossen = true;

    information.projekte[projekt_id].aufgaben.forEach((aufgaben_id) => {
        if (condition_found) {
            return
        }

        if (!information.aufgaben[aufgaben_id].finished) {
            alle_aufgaben_abgeschlossen = false;
        }

        if (information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum == null) {
            status = {
                label: "Handlungsbedarf",
                color: "red"
            }
            condition_found = true;
            return
        }

        if (get_today_string() > information.aufgaben[aufgaben_id].prognostiziertes_abschlussdatum) {
            status = {
                label: "Handlungsbedarf",
                color: "red"
            }
            condition_found = true;
            return
        }
    });

    if (alle_aufgaben_abgeschlossen) {
        status = {
            label: "Bereit",
            color: "blue"
        }
        condition_found = true;
    }

    if (get_today_string() > information.projekte[projekt_id].deadline) {
        status = {
            label: "Überzogen",
            color: "red"
        }
        condition_found = true;
    }

    if (information.projekte[projekt_id].finished) {
        status = {
            label: "Abgeschlossen",
            color: "green"
        }
        condition_found = true;
    }

    if (condition_found) {
        return status;
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

    aufgaben_section_container.remove();
    heading.innerText = "Alle Projekte";
    
    for (projekt_id in information.projekte) {

        const status = get_projekt_status(projekt_id);
        const projekt_table_row = create_projekt_table_row(projekt_id, status);

        document.getElementById("project_rows_div").appendChild(projekt_table_row);
    }
}

async function buildPage_staff(user) {

    projects_section_container.remove();
    create_new_project_button.remove();
    heading.innerText = "Alle Aufgaben";

    for (aufgabe_id in information.aufgaben) {

        if (information.aufgaben[aufgabe_id]["verantwortlicher"] != information.user["id"]) {
            continue
        }

        const status = get_aufgabe_status(aufgabe_id);
        const aufgabe_table_row = create_aufgabe_table_row(aufgabe_id, status);

        document.getElementById("aufgabe_rows_div").appendChild(aufgabe_table_row);
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