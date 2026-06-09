let fournisseurASupprimer = null;

document.getElementById("btnAjouterFournisseur").addEventListener("click", ajouterFournisseur);
document.getElementById("btnOui").addEventListener("click", confirmerSuppression);
document.getElementById("btnNon").addEventListener("click", fermerConfirmation);

async function chargerFournisseurs() {
    const res = await fetch("/fournisseurs");
    const fournisseurs = await res.json();
    const div = document.getElementById("listeFournisseurs");
    div.innerHTML = "";

    fournisseurs.forEach(function(f) {
        const ligne = document.createElement("div");
        ligne.className = "fournisseur-ligne";
        const nom = document.createElement("span");
        nom.className = "fournisseur-nom";
        nom.textContent = f.nom;
        const btnSupprimer = document.createElement("button");
        btnSupprimer.className = "btn-danger";
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.addEventListener("click", function() {
            fournisseurASupprimer = f.id_fournisseur;
            document.getElementById("confirmationBox").hidden = false;
        });

        ligne.appendChild(nom);
        ligne.appendChild(btnSupprimer);
        div.appendChild(ligne);
    });
}


async function ajouterFournisseur() {
    const nom = document.getElementById("nom").value;
    const res = await fetch("/fournisseurs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nom})
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;
    document.getElementById("nom").value = "";
    chargerFournisseurs();
}


function fermerConfirmation() {
    fournisseurASupprimer = null;
    document.getElementById("confirmationBox").hidden = true;
}


async function confirmerSuppression() {
    const res = await fetch("/fournisseurs/" + fournisseurASupprimer, {
        method: "DELETE"
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;

    fermerConfirmation();
    chargerFournisseurs();
}

chargerFournisseurs();