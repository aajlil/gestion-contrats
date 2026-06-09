document.getElementById("btnUpload").addEventListener("click", uploadDocument);
document.getElementById("btnAfficher").addEventListener("click", chargerDocuments);
const urlParams = new URLSearchParams(window.location.search);
const contratId = urlParams.get("id");

async function verifierAdmin() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}


async function uploadDocument() {
    const fichier = document.getElementById("document").files[0];
    if (!fichier) {
        document.getElementById("message").textContent = "Choisis un fichier";
    } else {
        const formData = new FormData();
        formData.append("contrat_id", contratId);
        formData.append("document", fichier);
        const res = await fetch("/documents", {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        document.getElementById("message").textContent = data.message;
        chargerDocuments();
    }
}

async function chargerNomContrat() {
    const res = await fetch("/contrats");
    const contrats = await res.json();
    const contrat = contrats.find(c => c.id_contrat == contratId);
    if (contrat) {
        document.getElementById("contratTitre").textContent = "Contrat : " + contrat.nom;
    }
}


async function chargerDocuments() {
    const res = await fetch("/documents/" + contratId);
    const documents = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";
    if (contratId) {
        documents.forEach(function(d) {
            const ligne = document.createElement("div");
            const texte = document.createElement("span");
            texte.textContent = d.nom_fichier + " ";
            const btnTelecharger = document.createElement("button");
            btnTelecharger.textContent = "Télécharger";
            btnTelecharger.addEventListener("click", function() {
                window.location.href = "/documents/telecharger/" + d.id_document;
            });

            const btnSupprimer = document.createElement("button");
            btnSupprimer.textContent = "Supprimer";
            btnSupprimer.addEventListener("click", async function() {
                const res = await fetch("/documents/" + d.id_document, {
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
        });
    }
}

verifierAdmin();
chargerNomContrat();
