async function verifierConnexion() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role === 1) {
        window.location.href = "/dashboard_admin.html";
    }
}


async function chargerDocuments() {
    const res = await fetch("http://localhost:3000/mes-documents");
    const documents = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";
    documents.forEach(function(d) {
        const ligne = document.createElement("div");
        const texte = document.createElement("span");
        texte.textContent = d.nom_fichier + " | "  + d.contrat_nom + " ";
        const btnTelecharger = document.createElement("button");
        btnTelecharger.textContent = "Télécharger";
        btnTelecharger.addEventListener("click", function() {
            window.location.href = "http://localhost:3000/mes-documents/telecharger/" + d.id_document;
        });

        ligne.appendChild(texte);
        ligne.appendChild(btnTelecharger);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

verifierConnexion();
chargerDocuments();
