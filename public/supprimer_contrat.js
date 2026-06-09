let contrats = [];
let idsSelectionnes = [];

document.getElementById("btnRechercher").addEventListener("click", rechercherContrats);
document.getElementById("btnReset").addEventListener("click", reinitialiserRecherche);
document.getElementById("btnSupprimer").addEventListener("click", ouvrirConfirmation);
document.getElementById("btnOui").addEventListener("click", confirmerSuppression);
document.getElementById("btnNon").addEventListener("click", fermerConfirmation);

async function verifierAdmin() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}


async function chargerContratsSelectionnes() {
    idsSelectionnes = JSON.parse(sessionStorage.getItem("idsSuppression")) || [];
    const res = await fetch("/contrats");
    contrats = await res.json();
    afficherSelection();
}

function afficherListe(listeContrats) {
    const div = document.getElementById("liste");
    div.innerHTML = "";
    listeContrats.forEach(function(c) {
        const ligne = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = c.id_contrat;
        checkbox.checked = idsSelectionnes.includes(Number(c.id_contrat));
        checkbox.addEventListener("change", function() {
            const id = Number(c.id_contrat);
            if (checkbox.checked) {
                if (!idsSelectionnes.includes(id)) {
                    idsSelectionnes.push(id);
                }
            } else {
                idsSelectionnes = idsSelectionnes.filter(function(item) {
                    return item !== id;
                });
            }
            afficherSelection();
        });

        const texte = document.createTextNode(
            c.nom + " - " + c.montant + "€" + " - " + (c.description || "Sans description")
        );
        ligne.appendChild(checkbox);
        ligne.appendChild(texte);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}


function afficherSelection() {
    const div = document.getElementById("selection");
    div.innerHTML = "";
    if (idsSelectionnes.length === 0) {
        div.textContent = "Aucun contrat sélectionné";
    } else {
        idsSelectionnes.forEach(function(id) {
            const contrat = contrats.find(function(c) {
                return Number(c.id_contrat) === id;
            });

            if (contrat) {
                const ligne = document.createElement("div");
                ligne.textContent =
                    contrat.nom + " - " + contrat.montant + "€" + " - " + (contrat.description || "Sans description");
                div.appendChild(ligne);
            }
        });
    }
}


function rechercherContrats() {
    const recherche = document.getElementById("recherche").value.toLowerCase();
    if (!recherche) {
        document.getElementById("message").textContent = "";
        afficherListe(contrats);
    } else {
        const resultats = contrats.filter(function(c) {
            const nom = (c.nom || "").toLowerCase();
            const montant = String(c.montant || "").toLowerCase();
            const description = (c.description || "").toLowerCase();
            return nom.includes(recherche) || montant.includes(recherche) || description.includes(recherche);
        });
        if (resultats.length === 0) {
            document.getElementById("liste").innerHTML = "";
            document.getElementById("message").textContent = "Aucun contrat trouvé";
        } else {
            document.getElementById("message").textContent = "";
            afficherListe(resultats);
        }
    }
}


function reinitialiserRecherche() {
    document.getElementById("recherche").value = "";
    document.getElementById("message").textContent = "";
    afficherListe(contrats);
}


function ouvrirConfirmation() {
    if (idsSelectionnes.length === 0) {
        document.getElementById("message").textContent = "Sélectionne au moins un contrat";
    } else {
        document.getElementById("message").textContent = "";
        document.getElementById("confirmationBox").hidden = false;
    }
}


function fermerConfirmation() {
    document.getElementById("confirmationBox").hidden = true;
}


async function confirmerSuppression() {
    const res = await fetch("/contrats", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: idsSelectionnes })
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;
    idsSelectionnes = [];
    fermerConfirmation();
    sessionStorage.removeItem("idsSuppression");
    document.getElementById("selection").innerHTML = "";
    document.getElementById("liste").innerHTML = "";
}

verifierAdmin();
chargerContratsSelectionnes();