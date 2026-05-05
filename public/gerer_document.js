document.getElementById("btnUpload").addEventListener("click", uploadDocument);
document.getElementById("btnAfficher").addEventListener("click", chargerDocuments);

async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}

async function chargerContrats() {
    const res = await fetch("http://localhost:3000/contrats");
    const contrats = await res.json();
    const select = document.getElementById("contrat_id");
    select.innerHTML = "";

    contrats.forEach(function(c) {
        const option = document.createElement("option");
        option.value = c.id_contrat;
        option.textContent = c.nom;
        select.appendChild(option);
    });
}

async function uploadDocument() {
    const contrat_id = document.getElementById("contrat_id").value;
    const fichier = document.getElementById("document").files[0];
    if (!fichier) {
        document.getElementById("message").textContent = "Choisis un fichier";
    } else {
        const formData = new FormData();
        formData.append("contrat_id", contrat_id);
        formData.append("document", fichier);
        const res = await fetch("http://localhost:3000/documents", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        document.getElementById("message").textContent = data.message;
    }
}


async function chargerDocuments() {
    const contrat_id = document.getElementById("contrat_id").value;
    const res = await fetch("http://localhost:3000/documents/" + contrat_id);
    const documents = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";

    documents.forEach(function(d) {
        const ligne = document.createElement("div");
        const texte = document.createElement("span");
        texte.textContent = d.nom_fichier + " ";
        const btnTelecharger = document.createElement("button");
        btnTelecharger.textContent = "Télécharger";
        btnTelecharger.addEventListener("click", function() {
            window.location.href = "http://localhost:3000/documents/telecharger/" + d.id_document;
        });

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.addEventListener("click", async function() {
            const res = await fetch("http://localhost:3000/documents/" + d.id_document, {
                method: "DELETE"
            });

            const data = await res.json();
            document.getElementById("message").textContent = data.message;
            chargerDocuments();
        });

        ligne.appendChild(texte);
        ligne.appendChild(btnTelecharger);
        ligne.appendChild(btnSupprimer);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

verifierAdmin();
chargerContrats();
