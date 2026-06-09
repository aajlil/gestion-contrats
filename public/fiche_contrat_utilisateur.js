var contratId = null;

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
    if (!date) {
        return "Non renseignée";
    }
    return new Date(date).toLocaleDateString("fr-FR");
}

function afficherFiche(c) {
    document.getElementById("titreContrat").textContent = c.nom;
    document.getElementById("ficheNom").textContent = c.nom;
    document.getElementById("ficheFournisseur").textContent = c.fournisseur || "Non renseigné";
    document.getElementById("ficheType").textContent = c.type_contrat || "Non renseigné";
    var statutSpan = document.getElementById("ficheStatut");
    statutSpan.textContent = afficherStatut(c.statut);
    statutSpan.className = "fiche-valeur fiche-statut statut-" + c.statut;

    document.getElementById("ficheMontant").textContent = c.montant + " EUR";
    document.getElementById("ficheDateDebut").textContent = formaterDate(c.date_debut);
    document.getElementById("ficheDateFin").textContent = formaterDate(c.date_fin);
    document.getElementById("ficheDescription").textContent = c.description || "Aucune description";
}

async function chargerFiche() {
    const params = new URLSearchParams(window.location.search);
    contratId = params.get("id");
    if (!contratId) {
        document.getElementById("message").textContent = "Aucun contrat sélectionné.";
    } else {
        const res = await fetch("/mes-contrats");
        const contrats = await res.json();
        var contratTrouve = null;
        contrats.forEach(function(contrat) {
            if (String(contrat.id_contrat) === String(contratId)) {
                contratTrouve = contrat;
            }
        });
        if (contratTrouve) {
            afficherFiche(contratTrouve);
        } else {
            document.getElementById("message").textContent = "Contrat introuvable.";
        }
    }
}

async function verifierConnexion() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    }
}

document.getElementById("btnDocuments").addEventListener("click", function() {
    window.location.href = "/mes_document.html?id=" + contratId;
});

document.getElementById("btnExportExcel").addEventListener("click", async function() {
    const res = await fetch("/export/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [contratId] })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrat.xlsx";
    a.click();
});

document.getElementById("btnExportPdf").addEventListener("click", async function() {
    const res = await fetch("/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [contratId] })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrat.pdf";
    a.click();
});

verifierConnexion();
chargerFiche();