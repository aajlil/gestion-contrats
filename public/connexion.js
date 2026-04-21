const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const login = document.getElementById("login").value;
        const mdp = document.getElementById("mdp").value;

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({login, mdp})
        });

        const data = await res.json();
        const message = document.getElementById("message");
        message.textContent = data.message;

        if (data.message.includes("réussie")) {
            if (data.role === 1) {
                window.location.href = "dashboard_admin.html";
            } else {
                window.location.href = "dashboard_utilisateur.html";
            }
        }
    });
}