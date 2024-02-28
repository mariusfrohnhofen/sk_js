// v1.0.20

//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

const admin_data_table = document.getElementById("admin_data_table");
const staff_data_table = document.getElementById("staff_data_table");

const alle_projekte_tables = document.getElementById("alle_projekte_tables");
const alle_aufgaben_tables = document.getElementById("alle_aufgaben_tables");

const heading = document.getElementById("heading");
const create_new_project_button = document.getElementById("create_new_project_button");

const to_prio_planer_button = document.getElementById("to_prio_planer_button");

const projects_section_container = document.getElementById("projects_section_container");
const aufgaben_section_container = document.getElementById("aufgaben_section_container");

const project_rows = document.getElementById("project_rows");
const aufgaben_rows = document.getElementById("aufgaben_rows");

const currentPath = window.location.pathname;

var information = {
    "user": {},
    "company": {},
    "projekte": {},
    "aufgaben": {},
    "mitarbeiter": {}
};

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
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=`${information.projekte[projekt_id].wahrscheinlichkeit}%`));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=information.projekte[projekt_id].auftraggeber, {justifySelf: "start"}));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=information.projekte[projekt_id].produktinfo));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=`${get_tage_differenz(get_today_string(), information.projekte[projekt_id].deadline)} Tage`));
    projekt_table_data_row.appendChild(create_div(klassen=["text-100", "medium"], inner_text=format_euro(information.projekte[projekt_id].dealvolumen)));

    projekt_table_data_row.addEventListener("click", (event) => {
        location.href = "/projekt?id=" + projekt_id;
    });
    
    return projekt_table_data_row
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

function set_card_to_message(card_id, message) {
    const message_div = create_div(["text-100", "medium"], message, {textAlign: "center"});
    const card = document.getElementById(card_id);
    
    card.parentElement.appendChild(message_div);
    card.remove();
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
        });
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

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];
}

async function buildPage_admin(user) {

    aufgaben_section_container.remove();
    heading.innerText = "Alle Projekte";
    
    for (projekt_id in information.projekte) {

        const status = get_projekt_status(information, projekt_id);
        project_rows.appendChild(create_projekt_table_row(projekt_id, status));
    }

    if (Object.keys(information.projekte).length === 0) {
        set_card_to_message("project_card", "Es wurde noch kein Projekt erstellt");
    }
}

async function buildPage_staff(user) {

    projects_section_container.remove();
    create_new_project_button.remove();
    to_prio_planer_button.remove();
    heading.innerText = "Alle Aufgaben";

    var count_aufgaben = 0;

    for (aufgabe_id in information.aufgaben) {

        if (information.aufgaben[aufgabe_id]["verantwortlicher"] != information.user["id"]) {
            continue
        }

        const status = get_aufgabe_status(aufgabe_id);
        aufgaben_rows.appendChild(create_aufgabe_table_row(aufgabe_id, status));

        count_aufgaben++;
    }

    if (count_aufgaben === 0) {
        set_card_to_message("aufgaben_card", "Ihnen wurden noch keine Aufgaben zugeteilt");
    }
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