function get_today_string() {
    var heute = new Date();
    var jahr = heute.getFullYear();
    var monat = ('0' + (heute.getMonth() + 1)).slice(-2); // Monate sind 0-basiert, deshalb +1
    var tag = ('0' + heute.getDate()).slice(-2);
    return jahr + '-' + monat + '-' + tag;
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

function format_file_size(bytes) {
    if (bytes === 0 || bytes === undefined) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));

    return Math.round(10 * (bytes / Math.pow(k, i))) / 10 + ' ' + sizes[i];
}

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

function format_euro(number) {
    const formattedEuro = number.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
  
    return formattedEuro;
}

function datestring_to_visual_date(datestring) {
    if (datestring == null || datestring == "-") {
        return "-";
    }

    var date_parts = datestring.split("-");

    return `${date_parts[2]}.${date_parts[1]}.${date_parts[0]}`;
}

function get_aufgabe_status(info, aufgabe_id) {
    var aufgabe_data = null;

    if ("aufgaben" in info) {
        aufgabe_data = info.aufgabe;
    }
    else {
        aufgabe_data = info.aufgaben[aufgabe_id];
    }

    if (aufgabe_data.finished) {
        return {
            label: "Abgeschlossen",
            color: "green"
        }
    }

    if (aufgabe_data.prognostiziertes_abschlussdatum == null) {
        return {
            label: "Handlungsbedarf",
            color: "red"
        }
    }

    if (get_today_string() > aufgabe_data.prognostiziertes_abschlussdatum) {
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

function get_projekt_status(info, projekt_id) {
    var projekt_data = null;

    if ("projekte" in info) {
        projekt_data = info.projekte[projekt_id];
    }
    else {
        projekt_data = info.projekt;
    }

    var condition_found = false;
    var status = null;
    var alle_aufgaben_abgeschlossen = true;

    projekt_data.aufgaben.forEach((aufgabe_id) => {
        const aufgabe_data = info.aufgaben[aufgabe_id];

        if (condition_found) {
            return
        }

        if (!aufgabe_data.finished) {
            alle_aufgaben_abgeschlossen = false;
        }

        if (aufgabe_data.prognostiziertes_abschlussdatum == null) {
            status = {
                label: "Handlungsbedarf",
                color: "red"
            }
            condition_found = true;
            return
        }

        if (get_today_string() > aufgabe_data.prognostiziertes_abschlussdatum) {
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

    if (get_today_string() > projekt_data.deadline) {
        status = {
            label: "Überzogen",
            color: "red"
        }
        condition_found = true;
    }

    if (projekt_data.finished) {
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

function remove_overlay() {
    const overlay = document.getElementById("site_overlay");
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = 0;

    setTimeout(function() {
        overlay.remove();
    }, 1000);
}