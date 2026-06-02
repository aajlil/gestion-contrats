async function verifierAdmin() {
    const res = await fetch("http://localhost:3000/me");
    const user = await res.json();
    if (!user) {
        window.location.href = "/connexion.html";
    } else if (user.role !== 1) {
        window.location.href = "/dashboard_utilisateur.html";
    }
}


async function chargerUtilisateurs() {
    const res = await fetch("http://localhost:3000/utilisateurs");
    const utilisateurs = await res.json();
    const div = document.getElementById("liste");
    div.innerHTML = "";
    utilisateurs.forEach(function(u) {
        const ligne = document.createElement("div");
        const texte = document.createElement("span");
        texte.textContent = u.nom + " " + u.prenom + " - " + u.identifiant + " - " + u.email + " ";
        const select = document.createElement("select");
        const optionAdmin = document.createElement("option");
        optionAdmin.value = 1;
        optionAdmin.textContent = "Administrateur";
        const optionUser = document.createElement("option");
        optionUser.value = 2;
        optionUser.textContent = "Utilisateur";

        select.appendChild(optionAdmin);
        select.appendChild(optionUser);
        select.value = u.role_id;

        const button = document.createElement("button");
        button.textContent = "Modifier";
        button.addEventListener("click", async function() {
            const role_id = Number(select.value);
            const res = await fetch("http://localhost:3000/utilisateurs/role", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: u.id_utilisateur, role_id: role_id
                })
            });
            const data = await res.json();
            document.getElementById("message").textContent = data.message;
            chargerUtilisateurs();
        });

        ligne.appendChild(texte);
        ligne.appendChild(select);
        ligne.appendChild(button);
        div.appendChild(ligne);
        div.appendChild(document.createElement("br"));
    });
}

verifierAdmin();
chargerUtilisateurs();
