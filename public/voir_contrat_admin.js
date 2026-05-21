document.getElementById("btnRecherche").addEventListener("click", rechercherContrats);
document.getElementById("btnReset").addEventListener("click", chargerContrats);
document.getElementById("btnFiltrer").addEventListener("click", filtrerContrats);
document.getElementById("btnResetFiltres").addEventListener("click", reinitialiserFiltres);
document.getElementById("btnExportExcel").addEventListener("click", exporterExcel);
document.getElementById("btnExportPdf").addEventListener("click", exporterPdf);

async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}

function afficherStatut(statut) {
    if (statut === "actif") {
        return "Actif";
    } else if (statut === "expire") {
        return "Expiré";
    } else if (statut === "bientot_expire") {
        return "Bientôt expiré";
    } else {
        return "Non renseigné";
    }
}

function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR");
}

function afficherListe(contrats) {
    const div = document.getElementById("liste");
    div.innerHTML = "";
    const entete = document.createElement("div");
    entete.textContent =
        "Nom | Fournisseur | Type | Description | Date début | Date fin | Montant | Responsable | Statut";
    div.appendChild(entete);
    div.appendChild(document.createElement("br"));
    contrats.forEach(function(c) {
        const ligne = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = c.id_contrat;

        const texte = document.createElement("span");
        texte.textContent =
            c.nom + " | " + c.fournisseur + " | " + c.type_contrat + " | " + (c.description || "Sans description") + " | " +
            formaterDate(c.date_debut) + " | " + formaterDate(c.date_fin) + " | " +
            c.montant + " EUR | " + c.responsable_nom + " " + c.responsable_prenom + " | " +
            afficherStatut(c.statut);
        ligne.appendChild(checkbox);
        ligne.appendChild(texte);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

async function chargerContrats() {
    document.getElementById("recherche").value = "";
    document.getElementById("message").textContent = "";
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();
    afficherListe(contrats);
}

async function rechercherContrats() {
    const recherche = document.getElementById("recherche").value;
    if (!recherche) {
        document.getElementById("message").textContent = "Saisis un mot de recherche";
    } else {
        document.getElementById("message").textContent = "";
        const res = await fetch("http://localhost:3000/recherche-contrats?recherche=" + encodeURIComponent(recherche));
        const contrats = await res.json();
        if (contrats.length === 0) {
            document.getElementById("liste").innerHTML = "";
            document.getElementById("message").textContent = "Aucun contrat trouvé";
        } else {
            afficherListe(contrats);
        }
    }
}

async function filtrerContrats() {
    const fournisseur = document.getElementById("filtre_fournisseur").value;
    const type = document.getElementById("filtre_type").value;
    const statut = document.getElementById("filtre_statut").value;
    const date_fin = document.getElementById("filtre_date_fin").value;
    const url =
        "http://localhost:3000/filtres-contrats?fournisseur=" + encodeURIComponent(fournisseur) +
        "&type=" + encodeURIComponent(type) + "&statut=" + encodeURIComponent(statut) +
        "&date_fin=" + encodeURIComponent(date_fin);

    const res = await fetch(url);
    const contrats = await res.json();
    if (contrats.length === 0) {
        document.getElementById("liste").innerHTML = "";
        document.getElementById("message").textContent ="Aucun contrat trouvé";
    } else {
        document.getElementById("message").textContent = "";
        afficherListe(contrats);
    }
}

function reinitialiserFiltres() {
    document.getElementById("filtre_fournisseur").value = "";
    document.getElementById("filtre_type").value = "";
    document.getElementById("filtre_statut").value = "";
    document.getElementById("filtre_date_fin").value = "";
    document.getElementById("message").textContent = "";
    chargerContrats();
}

function recupererIdsSelectionnes() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const ids = [];
    checkboxes.forEach(function(cb) {
        if (cb.checked) {
            ids.push(cb.value);
        }
    });
    return ids;
}

async function exporterExcel() {
    const ids = recupererIdsSelectionnes();
    if (ids.length === 0) {
        document.getElementById("message").textContent = "Sélectionne au moins un contrat";
    } else {
        const res = await fetch("http://localhost:3000/export/excel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids: ids})
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contrats.xlsx";
        a.click();
    }
}

async function exporterPdf() {
    const ids = recupererIdsSelectionnes();
    if (ids.length === 0) {
        document.getElementById("message").textContent = "Sélectionne au moins un contrat";
    } else {
        const res = await fetch("http://localhost:3000/export/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids: ids})
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contrats.pdf";
        a.click();
    }
}

verifierAdmin();
chargerContrats();
