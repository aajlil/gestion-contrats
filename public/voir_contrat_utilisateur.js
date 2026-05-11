document.getElementById("btnRecherche").addEventListener("click", rechercherMesContrats);
document.getElementById("btnReset").addEventListener("click", chargerMesContrats);

async function verifierConnexion() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
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
    contrats.forEach(function(c) {
        const ligne = document.createElement("div");
        ligne.textContent =
            c.nom + " | " + c.fournisseur + " | " + c.type_contrat + " | " +
            (c.description || "Sans description") + " | " +
            formaterDate(c.date_debut) + " | " + formaterDate(c.date_fin) + " | " +
            c.montant + " EUR | " + afficherStatut(c.statut);

        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

async function chargerMesContrats() {
    document.getElementById("recherche").value = "";
    document.getElementById("message").textContent = "";
    const res = await fetch("http://localhost:3000/mes-contrats");
    const contrats = await res.json();
    afficherListe(contrats);
}

async function rechercherMesContrats() {
    const recherche = document.getElementById("recherche").value;
    if (!recherche) {
        document.getElementById("message").textContent = "Saisis un mot de recherche";
    } else {
        document.getElementById("message").textContent = "";

        const res = await fetch("http://localhost:3000/recherche-mes-contrats?recherche=" + encodeURIComponent(recherche));
        const contrats = await res.json();
        if (contrats.length === 0) {
            document.getElementById("liste").innerHTML = "";
            document.getElementById("message").textContent = "Aucun contrat trouvé";
        } else {
            afficherListe(contrats);
        }
    }
}

verifierConnexion();
chargerMesContrats();
