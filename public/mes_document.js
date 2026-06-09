let contratId = null;

async function verifierConnexion() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role === 1) {
        window.location.href = "/dashboard_admin.html";
    }
}


async function chargerDocuments() {
    const urlParams = new URLSearchParams(window.location.search);
    contratId = urlParams.get("id");
    await chargerNomContrat();
    const res = await fetch("/documents/" + contratId);
    const documents = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";
    documents.forEach(function(d) {
        const ligne = document.createElement("div");
        ligne.className = "ligne-document";
        const texte = document.createElement("span");
        texte.textContent = d.nom_fichier;

        const btnTelecharger = document.createElement("button");
        btnTelecharger.textContent = "Télécharger";
        btnTelecharger.addEventListener("click", function() {
            window.location.href = "/documents/telecharger/" + d.id_document;
        });

        ligne.appendChild(texte);
        ligne.appendChild(btnTelecharger);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

async function chargerNomContrat() {
    const res = await fetch("/mes-contrats");
    const contrats = await res.json();
    const contrat = contrats.find(function(c) {
        return c.id_contrat == contratId;
    });
    if (contrat) {
        document.getElementById("contratTitre").textContent = "Contrat : " + contrat.nom;
    }
}

verifierConnexion();
chargerDocuments();
