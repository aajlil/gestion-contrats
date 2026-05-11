document.getElementById("btnRecherche").addEventListener("click", rechercherContrats);
document.getElementById("btnReset").addEventListener("click", chargerContrats);

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
    contrats.forEach(function(c) {
        const ligne = document.createElement("div");
        ligne.textContent =
            c.nom + " | " + c.fournisseur + " | " + c.type_contrat + " | " +
            (c.description || "Sans description") + " | " +
            formaterDate(c.date_debut) + " | " + formaterDate(c.date_fin) + " | " +
            c.montant + " EUR | " + c.responsable_nom + " " + c.responsable_prenom + " | " +
            afficherStatut(c.statut);

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

verifierAdmin();
chargerContrats();
