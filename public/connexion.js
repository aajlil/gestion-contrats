const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email_login").value;
        const mdp = document.getElementById("mdp").value;

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, mdp})
        });

        const data = await res.text();

        const message = document.getElementById("message");
        message.textContent = data;

        if (data.includes("réussie")) {
            window.location.href = "dashboard.html";
        }
    });
}