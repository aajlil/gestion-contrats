document.getElementById("btnModifierMdp").addEventListener("click", modifierMotDePasse);
document.getElementById("btnModifierProfil").addEventListener("click", modifierProfil);

let roleUtilisateur = null;

async function verifierConnexion() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else {
        roleUtilisateur = user.role;
        chargerProfil();
    }
}

async function chargerProfil() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    document.getElementById("identifiant").value = user.identifiant;

    if (user.nom) {
        document.getElementById("nom").value = user.nom;
    }
    if (user.prenom) {
        document.getElementById("prenom").value = user.prenom;
    }
    if (user.email) {
        document.getElementById("email").value = user.email;
    }
}

document.getElementById("btnRetour").addEventListener("click", function() {
    if (roleUtilisateur === 1) {
        window.location.href = "/dashboard_admin.html";
    } else {
        window.location.href = "/dashboard_utilisateur.html";
    }
});

async function modifierProfil() {
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const identifiant = document.getElementById("identifiant").value;
    const email = document.getElementById("email").value;
    const res = await fetch("http://localhost:3000/modifier-profil", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nom, prenom, identifiant, email})
    });
    const data = await res.json();
    document.getElementById("message").textContent = data.message;
}

async function modifierMotDePasse() {
    const ancien_mdp = document.getElementById("ancien_mdp").value;
    const nouveau_mdp = document.getElementById("nouveau_mdp").value;
    const confirmation_mdp = document.getElementById("confirmation_mdp").value;
    if (nouveau_mdp !== confirmation_mdp) {
        document.getElementById("message").textContent = "Les mots de passe ne correspondent pas";
    } else {
        const res = await fetch("http://localhost:3000/modifier-mot-de-passe", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ancien_mdp, nouveau_mdp})
        });
        const data = await res.json();
        document.getElementById("message").textContent = data.message;
    }
}

verifierConnexion();