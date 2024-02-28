//  Reference to Webflow UI elements
const dropdown_company_name = document.getElementById("dropdown_company_name");
const dropdown_user_name = document.getElementById("dropdown_user_name");

var information = {
    "user": {},
    "company": {},
    "projekte": {},
    "aufgaben": {},
    "mitarbeiter": {}
};

function create_prio_span(is_bold, inner_text) {
    const span = document.createElement("span");

    if (is_bold) {
        span.classList.add("text-608", "bold")
    }
    else {
        span.classList.add("text-608");
    }

    span.innerText = inner_text;

    return span
}

function create_projekt_uberzogen_prio_card(projekt_id) {
    const main_section_container = create_div(["main-section-container", "top", "w-container"]);
    const div_block = create_div(["div-block-26"]);
    
    const prio_card = create_div(["card", "priority-card"]);
    const prio_card_div_block = create_div(["div-block-10"]);
    const prio_card_h2 = document.createElement("h2");
    prio_card_h2.classList.add("text-608");

    prio_card_h2.appendChild(create_prio_span(false, "Das Projekt "))
    prio_card_h2.appendChild(create_prio_span(true, information.projekte[projekt_id].titel))
    prio_card_h2.appendChild(create_prio_span(false, " ist um "))
    prio_card_h2.appendChild(create_prio_span(true, `${get_tage_differenz(information.projekte[projekt_id].deadline, get_today_string())} Tage`))
    prio_card_h2.appendChild(create_prio_span(false, " überzogen."));

    prio_card_div_block.appendChild(prio_card_h2);
    prio_card.appendChild(prio_card_div_block);

    const a_tag = document.createElement("a");
    a_tag.href = "/projekt?id=" + information.projekte[projekt_id].id;
    a_tag.classList.add("btn-primary", "w-button");
    a_tag.innerText = "Zum Projekt";

    prio_card.appendChild(a_tag);

    const prio_subcard = create_div(["card", "priority-subcard"]);

    const h1_name = document.createElement("h1");
    h1_name.classList.add("text-200", "bold")
    h1_name.innerText = information.projekte[projekt_id].titel;
    prio_subcard.appendChild(h1_name);

    const h1_wahrscheinlichkeit = document.createElement("h1");
    h1_wahrscheinlichkeit.classList.add("text-200", "bold")
    h1_wahrscheinlichkeit.innerText = `${information.projekte[projekt_id].wahrscheinlichkeit}% Wahrscheinlichkeit`;
    prio_subcard.appendChild(h1_wahrscheinlichkeit);

    const h1_volumen = document.createElement("h1");
    h1_volumen.classList.add("text-200", "bold")
    h1_volumen.innerText = format_euro(information.projekte[projekt_id].dealvolumen);
    prio_subcard.appendChild(h1_volumen);

    div_block.appendChild(prio_card);
    div_block.appendChild(prio_subcard);

    main_section_container.appendChild(div_block);

    return main_section_container
}

function create_projekt_bereit_prio_card(projekt_id) {
    const main_section_container = create_div(["main-section-container", "top", "w-container"]);
    const div_block = create_div(["div-block-26"]);
    
    const prio_card = create_div(["card", "priority-card"]);
    const prio_card_div_block = create_div(["div-block-10"]);
    const prio_card_h2 = document.createElement("h2");
    prio_card_h2.classList.add("text-608");

    prio_card_h2.appendChild(create_prio_span(false, "Das Projekt "))
    prio_card_h2.appendChild(create_prio_span(true, information.projekte[projekt_id].titel))
    prio_card_h2.appendChild(create_prio_span(false, " ist bereit zur Angebotserstellung."));

    prio_card_div_block.appendChild(prio_card_h2);
    prio_card.appendChild(prio_card_div_block);

    const a_tag = document.createElement("a");
    a_tag.href = "/projekt?id=" + information.projekte[projekt_id].id;
    a_tag.classList.add("btn-primary", "w-button");
    a_tag.innerText = "Zum Projekt";

    prio_card.appendChild(a_tag);

    const prio_subcard = create_div(["card", "priority-subcard"]);

    const h1_name = document.createElement("h1");
    h1_name.classList.add("text-200", "bold")
    h1_name.innerText = information.projekte[projekt_id].titel;
    prio_subcard.appendChild(h1_name);

    const h1_wahrscheinlichkeit = document.createElement("h1");
    h1_wahrscheinlichkeit.classList.add("text-200", "bold")
    h1_wahrscheinlichkeit.innerText = `${information.projekte[projekt_id].wahrscheinlichkeit}% Wahrscheinlichkeit`;
    prio_subcard.appendChild(h1_wahrscheinlichkeit);

    const h1_volumen = document.createElement("h1");
    h1_volumen.classList.add("text-200", "bold")
    h1_volumen.innerText = format_euro(information.projekte[projekt_id].dealvolumen);
    prio_subcard.appendChild(h1_volumen);

    div_block.appendChild(prio_card);
    div_block.appendChild(prio_subcard);

    main_section_container.appendChild(div_block);

    return main_section_container
}

function create_aufgabe_gerissen_prio_card(aufgabe_id, projekt_id) {
    const mitarbeiter_id = information.aufgaben[aufgabe_id].verantwortlicher;
    const mitarbeiter_name = information.mitarbeiter[mitarbeiter_id].vorname + " " + information.mitarbeiter[mitarbeiter_id].nachname;

    const main_section_container = create_div(["main-section-container", "top", "w-container"]);
    const div_block = create_div(["div-block-26"]);
    
    const prio_card = create_div(["card", "priority-card"]);
    const prio_card_div_block = create_div(["div-block-10"]);
    const prio_card_h2 = document.createElement("h2");
    prio_card_h2.classList.add("text-608");

    prio_card_h2.appendChild(create_prio_span(true, mitarbeiter_name))
    prio_card_h2.appendChild(create_prio_span(false, " ist mit der Aufgabe "))
    prio_card_h2.appendChild(create_prio_span(true, information.aufgaben[aufgabe_id].titel))
    prio_card_h2.appendChild(create_prio_span(false, " um "))
    prio_card_h2.appendChild(create_prio_span(true, `${get_tage_differenz(information.aufgaben[aufgabe_id].prognostiziertes_abschlussdatum, get_today_string())} Tage`))
    prio_card_h2.appendChild(create_prio_span(false, " im Verzug."));

    prio_card_div_block.appendChild(prio_card_h2);
    prio_card.appendChild(prio_card_div_block);

    const a_tag = document.createElement("a");
    a_tag.href = "/aufgabe?id=" + aufgabe_id;
    a_tag.classList.add("btn-primary", "w-button");
    a_tag.innerText = "Zur Aufgabe";

    prio_card.appendChild(a_tag);

    const prio_subcard = create_div(["card", "priority-subcard"]);

    const h1_name = document.createElement("h1");
    h1_name.classList.add("text-200", "bold")
    h1_name.innerText = information.projekte[projekt_id].titel;
    prio_subcard.appendChild(h1_name);

    const h1_wahrscheinlichkeit = document.createElement("h1");
    h1_wahrscheinlichkeit.classList.add("text-200", "bold")
    h1_wahrscheinlichkeit.innerText = `${information.projekte[projekt_id].wahrscheinlichkeit}% Wahrscheinlichkeit`;
    prio_subcard.appendChild(h1_wahrscheinlichkeit);

    const h1_volumen = document.createElement("h1");
    h1_volumen.classList.add("text-200", "bold")
    h1_volumen.innerText = format_euro(information.projekte[projekt_id].dealvolumen);
    prio_subcard.appendChild(h1_volumen);

    div_block.appendChild(prio_card);
    div_block.appendChild(prio_subcard);

    main_section_container.appendChild(div_block);

    return main_section_container
}

function create_aufgabe_nicht_prognostiziert_prio_card(aufgabe_id, projekt_id) {
    const mitarbeiter_id = information.aufgaben[aufgabe_id].verantwortlicher;
    const mitarbeiter_name = information.mitarbeiter[mitarbeiter_id].vorname + " " + information.mitarbeiter[mitarbeiter_id].nachname;

    const main_section_container = create_div(["main-section-container", "top", "w-container"]);
    const div_block = create_div(["div-block-26"]);
    
    const prio_card = create_div(["card", "priority-card"]);
    const prio_card_div_block = create_div(["div-block-10"]);
    const prio_card_h2 = document.createElement("h2");
    prio_card_h2.classList.add("text-608");

    prio_card_h2.appendChild(create_prio_span(true, mitarbeiter_name));
    prio_card_h2.appendChild(create_prio_span(false, " hat bei der Aufgabe "));
    prio_card_h2.appendChild(create_prio_span(true, information.aufgaben[aufgabe_id].titel));
    prio_card_h2.appendChild(create_prio_span(false, " noch kein prognostiziertes Abschlussdatum eingetragen."));

    prio_card_div_block.appendChild(prio_card_h2);
    prio_card.appendChild(prio_card_div_block);

    const a_tag = document.createElement("a");
    a_tag.href = "/aufgabe?id=" + aufgabe_id;
    a_tag.classList.add("btn-primary", "w-button");
    a_tag.innerText = "Zur Aufgabe";

    prio_card.appendChild(a_tag);

    const prio_subcard = create_div(["card", "priority-subcard"]);

    const h1_name = document.createElement("h1");
    h1_name.classList.add("text-200", "bold")
    h1_name.innerText = information.projekte[projekt_id].titel;
    prio_subcard.appendChild(h1_name);

    const h1_wahrscheinlichkeit = document.createElement("h1");
    h1_wahrscheinlichkeit.classList.add("text-200", "bold")
    h1_wahrscheinlichkeit.innerText = `${information.projekte[projekt_id].wahrscheinlichkeit}% Wahrscheinlichkeit`;
    prio_subcard.appendChild(h1_wahrscheinlichkeit);

    const h1_volumen = document.createElement("h1");
    h1_volumen.classList.add("text-200", "bold")
    h1_volumen.innerText = format_euro(information.projekte[projekt_id].dealvolumen);
    prio_subcard.appendChild(h1_volumen);

    div_block.appendChild(prio_card);
    div_block.appendChild(prio_subcard);

    main_section_container.appendChild(div_block);

    return main_section_container
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

function sort_and_create_prios() {
    var projekte_ueberzogen = [];
    var projekte_bereit_aufgabe_gerissen = [];
    var aufgaben_handlungsbedarf_nicht_eingetragen = [];

    for (projekt_id in information.projekte) {
        const projekt = information.projekte[projekt_id];
        const projekt_status = get_projekt_status(information, projekt_id);

        // Check, ob Projekt überzogen ist
        if (projekt_status.label === "Überzogen") {
            // Wert berechnen
            const projekt_data = {
                id: projekt.id,
                wert: projekt.dealvolumen * projekt.wahrscheinlichkeit * get_tage_differenz(projekt.deadline, get_today_string())
            }

            projekte_ueberzogen.push(projekt_data);
            continue
        }

        // Check, ob Projekt bereit ist
        if (projekt_status.label === "Bereit") {
            const projekt_data = {
                type: "PROJEKT",
                id: projekt.id,
                wert: get_tage_differenz(get_today_string(), projekt.deadline) !== 0 ? projekt.dealvolumen * projekt.wahrscheinlichkeit * (1 / get_tage_differenz(get_today_string(), projekt.deadline)) : projekt.dealvolumen * projekt.wahrscheinlichkeit
            }

            projekte_bereit_aufgabe_gerissen.push(projekt_data);
            continue
        }

        projekt.aufgaben.forEach((aufgabe_id) => {
            const aufgabe = information.aufgaben[aufgabe_id];
            const aufgabe_status = get_aufgabe_status(information, aufgabe_id);

            // Check, ob Aufgabe überzogen ist
            if (aufgabe_status.label === "Überzogen") {
                const aufgabe_data = {
                    type: "AUFGABE",
                    id: aufgabe_id,
                    projekt_id: projekt.id,
                    wert: get_tage_differenz(get_today_string(), projekt.deadline) !== 0 ? projekt.dealvolumen * projekt.wahrscheinlichkeit * (1 / get_tage_differenz(get_today_string(), projekt.deadline)) : projekt.dealvolumen * projekt.wahrscheinlichkeit
                }

                projekte_bereit_aufgabe_gerissen.push(aufgabe_data);
            }

            // Check, ob Aufgabe nicht eingetragen
            if (aufgabe_status.label === "Handlungsbedarf") {
                const aufgabe_data = {
                    id: aufgabe.id,
                    projekt_id: projekt.id,
                    wert: get_tage_differenz(get_today_string(), projekt.deadline) !== 0 ? projekt.dealvolumen * projekt.wahrscheinlichkeit * (1 / get_tage_differenz(get_today_string(), projekt.deadline)) : projekt.dealvolumen * projekt.wahrscheinlichkeit
                }

                aufgaben_handlungsbedarf_nicht_eingetragen.push(aufgabe_data);
            }
        })


    }

    // Überzogene Projekte
    projekte_ueberzogen.sort(function(a, b) {
        return b.wert - a.wert;
    });

    projekte_ueberzogen.forEach((data) => {
        console.log("PROJEKT ÜBERZOGEN", data.wert);
        const elem = create_projekt_uberzogen_prio_card(data.id);
        document.getElementsByClassName("main-section")[0].appendChild(elem);
    })

    // Projekt bereit, Aufgabe gerissen
    projekte_bereit_aufgabe_gerissen.sort(function(a, b) {
        return b.wert - a.wert;
    });
    console.log(projekte_bereit_aufgabe_gerissen);
    projekte_bereit_aufgabe_gerissen.forEach((data) => {
        console.log("PROJEKT BEREIT, AUFGABE GERISSEN", data.wert)
        if (data.type === "PROJEKT") {
            const elem = create_projekt_bereit_prio_card(data.id);
            document.getElementsByClassName("main-section")[0].appendChild(elem);
        }
        if (data.type === "AUFGABE") {
            const elem = create_aufgabe_gerissen_prio_card(data.id, data.projekt_id);
            document.getElementsByClassName("main-section")[0].appendChild(elem);
        }
    })

    // Aufgabe nicht eingetragen
    aufgaben_handlungsbedarf_nicht_eingetragen.sort(function(a, b) {
        return b.wert - a.wert;
    });
    aufgaben_handlungsbedarf_nicht_eingetragen.forEach((data) => {
        console.log("AUFGABE NICHT EINGETRAGEN", data.wert);
        const elem = create_aufgabe_nicht_prognostiziert_prio_card(data.id, data.projekt_id);
        document.getElementsByClassName("main-section")[0].appendChild(elem);
    })
}

async function buildPage_all(user) {
    dropdown_company_name.innerText = information["company"]["name"];
    dropdown_user_name.innerText = information["user"]["vorname"] + " " + information["user"]["nachname"];
}

const auth = firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        await getInformation(user);

        if (information["user"]["rolle"] == "staff") {
            location.href = "/";
        }

        await build_page(user);

        sort_and_create_prios();

        remove_overlay();
    } else {
        location.href = "/";
    }
});