const btnLogout = document.getElementById("btnLogout");

async function chargerUser() {
    const res = await fetch("http://localhost:3000/me");
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
    fetch("http://localhost:3000/logout")
        .then(() => {
            window.location.href = "/connexion.html";
        });
}

if (btnLogout) {
    btnLogout.addEventListener("click", logout);
}

chargerUser();
