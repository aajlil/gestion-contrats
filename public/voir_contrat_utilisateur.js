async function verifierConnexion() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();

    if (!user) {
        window.location.href = "/connexion.html";
    }
}

async function chargerMesContrats() {
    const res = await fetch("http://localhost:3000/mes-contrats");
    const contrats = await res.json();

    const div = document.getElementById("liste");
    div.innerHTML = "";

    contrats.forEach(function(c) {
        const ligne = document.createElement("div");

        ligne.textContent =
            c.nom + " | " +
            c.fournisseur + " | " +
            c.type_contrat + " | " +
            c.date_debut.split("T")[0] + " | " +
            c.date_fin.split("T")[0] + " | " +
            c.montant + " EUR | " +
            c.statut;

        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

verifierConnexion();
chargerMesContrats();
