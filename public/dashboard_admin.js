const btnLogout = document.getElementById("btnLogout");
let idsExportSelectionnes = [];
let modeSuppression = "";

async function chargerUser() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    } else {
        document.getElementById("welcome").textContent = "Bienvenue " + user.identifiant;
    }
}


function logout() {
    sessionStorage.removeItem("alertes_deja_affichees");
    fetch("/logout")
        .then(() => {
            window.location.href = "/connexion.html";
        });
}

async function chargerDashboard() {
    const res = await fetch("/dashboard-data");
    const data = await res.json();
    document.getElementById("totalContrats").textContent = data.total;
    document.getElementById("contratsActifs").textContent = data.actifs;
    document.getElementById("contratsExpires").textContent = data.expires;
    document.getElementById("contratsEcheance").textContent = data.echeance;
    const ctx = document.getElementById("graphiqueContrats");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total", "Actifs", "Expirés", "Arrivant à échéance"],
            datasets: [{
                label: "Contrats",
                data: [data.total, data.actifs, data.expires, data.echeance]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}


async function chargerStatistiques() {
    const res = await fetch("/statistiques-data");
    const data = await res.json();
    document.getElementById("montantTotal").textContent = data.montantTotal;
    const labelsFournisseurs = [];
    const valeursFournisseurs = [];
    data.contratsParFournisseur.forEach(function(item) {
        labelsFournisseurs.push(item.fournisseur || "Non renseigné");
        valeursFournisseurs.push(Number(item.total));
    });

    const labelsTypes = [];
    const valeursTypes = [];
    data.contratsParType.forEach(function(item) {
        labelsTypes.push(item.type_contrat || "Non renseigné");
        valeursTypes.push(Number(item.total));
    });

    const ctxFournisseurs = document.getElementById("graphiqueFournisseurs");
    const ctxTypes = document.getElementById("graphiqueTypes");
    new Chart(ctxFournisseurs, {
        type: "bar",
        data: {
            labels: labelsFournisseurs,
            datasets: [{
                label: "Contrats par fournisseur",
                data: valeursFournisseurs
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });

    new Chart(ctxTypes, {
        type: "pie",
        data: {
            labels: labelsTypes,
            datasets: [{
                label: "Contrats par type",
                data: valeursTypes
            }]
        }
    });
}

const btnMenu = document.getElementById("btnMenu");
const btnFermerMenu = document.getElementById("btnFermerMenu");
const menuLateral = document.getElementById("menuLateral");
const menuOverlay = document.getElementById("menuOverlay");
const btnLogoutMenu = document.getElementById("btnLogoutMenu");

function ouvrirMenu() {
    menuLateral.classList.add("ouvert");
    menuOverlay.classList.add("ouvert");
}


function fermerMenu() {
    menuLateral.classList.remove("ouvert");
    menuOverlay.classList.remove("ouvert");
}


if (btnMenu) {
    btnMenu.addEventListener("click", ouvrirMenu);
}


if (btnFermerMenu) {
    btnFermerMenu.addEventListener("click", fermerMenu);
}


if (menuOverlay) {
    menuOverlay.addEventListener("click", fermerMenu);
}


if (btnLogoutMenu) {
    btnLogoutMenu.addEventListener("click", logout);
}


if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}

var contratSelectionneId = null;
function afficherStatutContrat(statut) {
    if (statut === "actif") {
        return "Actif";
    } else if (statut === "expire") {
        return "Expiré";
    } else if (statut === "bientot_expire") {
        return "Bientôt expiré";
    } else {
        return "Inconnu";
    }
}

function formaterDateContrat(date) {
    if (!date) {
        return "Non renseignée";
    }
    return new Date(date).toLocaleDateString("fr-FR");
}

function afficherListeContratsActions(contrats) {
    const div = document.getElementById("listeContratsActions");
    div.innerHTML = "";
    if (contrats.length === 0) {
        div.textContent = "Aucun contrat trouvé.";
    } else {
        contrats.forEach(function(c) {
            var ligne = document.createElement("div");
            ligne.className = "contrat-ligne-action";
            ligne.dataset.id = c.id_contrat;
            ligne.dataset.nom = c.nom;

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox-contrat";
            checkbox.value = c.id_contrat;

            checkbox.checked = idsExportSelectionnes.includes(
                Number(c.id_contrat)
            );
            checkbox.addEventListener("change", function(e) {
                e.stopPropagation();
                var id = Number(c.id_contrat);
                if (checkbox.checked) {
                    if (!idsExportSelectionnes.includes(id)) {
                        idsExportSelectionnes.push(id);
                    }
                } else {
                    idsExportSelectionnes =
                        idsExportSelectionnes.filter(function(item) {
                            return item !== id;
                        });
                }
                mettreAJourExportMulti();
            });
            var nom = document.createElement("span");
            nom.className = "contrat-ligne-nom";
            nom.textContent = c.nom;

            var fournisseur = document.createElement("span");
            fournisseur.className = "contrat-ligne-info";
            fournisseur.textContent = c.fournisseur || "Sans fournisseur";

            var datefin = document.createElement("span");
            datefin.className = "contrat-ligne-info";
            datefin.textContent = "Échéance : " + formaterDateContrat(c.date_fin);

            var statut = document.createElement("span");
            statut.className = "contrat-ligne-statut statut-" + c.statut;
            statut.textContent = afficherStatutContrat(c.statut);

            ligne.appendChild(checkbox);
            ligne.appendChild(nom);
            ligne.appendChild(fournisseur);
            ligne.appendChild(datefin);
            ligne.appendChild(statut);

            ligne.addEventListener("click", function(e) {
                if (e.target.type !== "checkbox") {
                    if (document.getElementById("panneau-contrat").style.display === "block") {
                        ouvrirPanneauContrat(this.dataset.id, this.dataset.nom);
                    }
                }
            });
            ligne.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                ouvrirPanneauContrat(this.dataset.id, this.dataset.nom);
            });
            div.appendChild(ligne);
        });
    }
}

function ouvrirPanneauContrat(id, nom) {
    contratSelectionneId = id;
    document.getElementById("panneau-nom-contrat").textContent = nom;
    document.getElementById("panneau-contrat").style.display = "block";
}

function fermerPanneauContrat() {
    document.getElementById("panneau-contrat").style.display = "none";
    contratSelectionneId = null;
}

async function chargerContratsActions() {
    const res = await fetch("/contrats");
    const contrats = await res.json();
    afficherListeContratsActions(contrats);
}

async function filtrerContratsActions() {
    const recherche = document.getElementById("rechercheContrat").value;
    const type = document.getElementById("filtreType").value;
    const statut = document.getElementById("filtreStatut").value;
    const date_fin = document.getElementById("filtreDateFin").value;
    if (recherche) {
        const res = await fetch("/recherche-contrats?recherche=" + encodeURIComponent(recherche));
        const contrats = await res.json();
        afficherListeContratsActions(contrats);
    } else {
        const url = "/filtres-contrats?fournisseur=&type=" + encodeURIComponent(type) +
            "&statut=" + encodeURIComponent(statut) +
            "&date_fin=" + encodeURIComponent(date_fin);
        const res = await fetch(url);
        const contrats = await res.json();
        afficherListeContratsActions(contrats);
    }
}

document.getElementById("btnFermerPanneau").addEventListener("click", fermerPanneauContrat);

document.getElementById("btnFiltrer").addEventListener("click", filtrerContratsActions);

document.getElementById("btnReset").addEventListener("click", function() {
    document.getElementById("rechercheContrat").value = "";
    document.getElementById("filtreType").value = "";
    document.getElementById("filtreStatut").value = "";
    document.getElementById("filtreDateFin").value = "";
    chargerContratsActions();
});

document.getElementById("btnPanneauModifier").addEventListener("click", function() {
    window.location.href = "/modifier_contrat.html?id=" + contratSelectionneId;
});

document.getElementById("btnPanneauSupprimer").addEventListener("click", function() {
    modeSuppression = "unique";
    document.getElementById("confirmationTexte").textContent = "Confirmer la suppression de ce contrat ?";
    document.getElementById("confirmationBox").style.display = "flex";
});

document.getElementById("btnPanneauDocuments").addEventListener("click", function() {
    window.location.href = "/gerer_document.html?id=" + contratSelectionneId;
});

document.getElementById("btnPanneauHistorique").addEventListener("click", function() {
    window.location.href = "/historique_contrat.html?id=" + contratSelectionneId;
});

document.getElementById("btnPanneauExportExcel").addEventListener("click", async function() {
    const res = await fetch("/export/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ids: [contratSelectionneId]})
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrat.xlsx";
    a.click();
});

document.getElementById("btnPanneauExportPdf").addEventListener("click", async function() {
    const res = await fetch("/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ids: [contratSelectionneId]})
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrat.pdf";
    a.click();
});

document.getElementById("btnPanneauVoir").addEventListener("click", function() {
    window.location.href = "/fiche_contrat_admin.html?id=" + contratSelectionneId;
});

function mettreAJourExportMulti() {
    const exportMulti = document.getElementById("export-multi");
    if (idsExportSelectionnes.length > 0) {
        exportMulti.style.display = "flex";
    } else {
        exportMulti.style.display = "none";
    }
}

document.getElementById("btnExportMultiExcel").addEventListener("click", async function() {
    const res = await fetch("/export/excel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ids: idsExportSelectionnes
        })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrats.xlsx";
    a.click();
});

document.getElementById("btnExportMultiPdf").addEventListener("click", async function() {
    const res = await fetch("/export/pdf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ids: idsExportSelectionnes
        })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrats.pdf";
    a.click();
});


document.getElementById("btnSupprimerMulti").addEventListener("click", function() {
    modeSuppression = "multiple";
    document.getElementById("confirmationTexte").textContent = "Confirmer la suppression des contrats sélectionnés ?";
    document.getElementById("confirmationBox").style.display = "flex";
});

document.getElementById("btnNonSuppression").addEventListener("click", function() {
    document.getElementById("confirmationBox").style.display = "none";
});

document.getElementById("btnOuiSuppression").addEventListener("click", async function() {
    if (modeSuppression === "unique") {
        await fetch("/contrats", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids:[contratSelectionneId]})
        });

        fermerPanneauContrat();
    }
    if (modeSuppression === "multiple") {
        await fetch("/contrats", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ids:idsExportSelectionnes})
        });
        idsExportSelectionnes = [];
        mettreAJourExportMulti();
    }
    document.getElementById("confirmationBox").style.display = "none";
    chargerContratsActions();
});

chargerContratsActions();
chargerUser();
chargerDashboard();
chargerStatistiques();