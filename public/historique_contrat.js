async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
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


async function chargerListeContrats() {
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();
    const select = document.getElementById("contrat_select");
    select.innerHTML = "";
    contrats.forEach(function(c) {
        const option = document.createElement("option");
        option.value = c.id_contrat;
        option.textContent = c.nom;
        select.appendChild(option);
    });
}


async function chargerHistorique() {
    const id = document.getElementById("contrat_select").value;
    const res = await fetch("http://localhost:3000/historique/" + id);
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

verifierAdmin();
chargerListeContrats();
