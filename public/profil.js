async function chargerProfil() {
    const res = await fetch("/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else {
        document.getElementById("nom").textContent = user.nom || "Non renseigné";
        document.getElementById("prenom").textContent = user.prenom || "Non renseigné";
        document.getElementById("identifiant").textContent = user.identifiant || "Non renseigné";
        document.getElementById("email").textContent = user.email || "Non renseigné";
        if (user.role === 1) {
            document.getElementById("role").textContent = "Administrateur";
        } else {
            document.getElementById("role").textContent = "Utilisateur";
        }
        document.getElementById("btnRetour").addEventListener("click", function() {
            if (user.role === 1) {
                window.location.href = "/dashboard_admin.html";
            } else {
                window.location.href = "/dashboard_utilisateur.html";
            }
        });
    }
}

chargerProfil();