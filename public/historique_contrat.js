let contratId = null;


async function verifierAdmin() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}


function formaterDate(date) {
    return new Date(date).toLocaleString("fr-FR");
}


async function chargerHistorique() {
    const params = new URLSearchParams(window.location.search);
    contratId = params.get("id");
    await chargerNomContrat();
    const res = await fetch("/historique/" + contratId);
    const historique = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";
    historique.forEach(function(h) {
        const ligne = document.createElement("div");
        ligne.innerHTML =
            "<p><strong>Action :</strong> " + h.action + "</p>" +
            "<p><strong>Description :</strong> " + h.description + "</p>" +
            "<p><strong>Date :</strong> " + formaterDate(h.date_action) + "</p>" +
            "<p><strong>Utilisateur :</strong> " + h.nom + " " + h.prenom + "</p>" +
            "<hr>";
        div.appendChild(ligne);
    });
}

async function chargerNomContrat() {
    const res = await fetch("/contrats");
    const contrats = await res.json();
    const contrat = contrats.find(function(c) {
        return c.id_contrat == contratId;
    });
    if (contrat) {
        document.getElementById("contratTitre").textContent = "Contrat : " + contrat.nom;
    }
}

verifierAdmin();
chargerHistorique()
