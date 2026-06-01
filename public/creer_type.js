let typeASupprimer = null;

document.getElementById("btnAjouterType").addEventListener("click", ajouterType);
document.getElementById("btnOui").addEventListener("click", confirmerSuppression);
document.getElementById("btnNon").addEventListener("click", fermerConfirmation);

async function chargerTypes() {
    const res = await fetch("http://localhost:3000/types");
    const types = await res.json();
    const div = document.getElementById("listeTypes");
    div.innerHTML = "";

    types.forEach(function(t) {
        const ligne = document.createElement("div");
        ligne.className = "type-ligne";
        const nom = document.createElement("span");
        nom.className = "type-nom";
        nom.textContent = t.nom;
        const btnSupprimer = document.createElement("button");
        btnSupprimer.className = "btn-danger";
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.addEventListener("click", function() {
            typeASupprimer = t.id_type_contrat;
            document.getElementById("confirmationBox").hidden = false;
        });

        ligne.appendChild(nom);
        ligne.appendChild(btnSupprimer);
        div.appendChild(ligne);
    });
}

async function ajouterType() {
    const nom = document.getElementById("nom").value;
    const res = await fetch("http://localhost:3000/types", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nom})
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;
    document.getElementById("nom").value = "";

    chargerTypes();
}

function fermerConfirmation() {
    typeASupprimer = null;
    document.getElementById("confirmationBox").hidden = true;
}

async function confirmerSuppression() {
    const res = await fetch("http://localhost:3000/types/" + typeASupprimer, {
        method: "DELETE"
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message;

    fermerConfirmation();
    chargerTypes();
}

chargerTypes();