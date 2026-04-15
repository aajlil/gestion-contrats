const express = require("express");
const path = require("path");
const session = require("express-session");
const contratRoutes = require("./module/mod_contrat/route_contrat");


const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(session({secret: "mon_secret", resave: false, saveUninitialized: false}));
app.use("/", contratRoutes);

// page par défaut(connexion)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "connexion.html"));
});

app.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.json(null);
    }
    res.json(req.session.user);
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json({message: "Déconnecté"});
});

// import module connexion
const connexionRoutes = require("./module/mod_connexion/route_connexion");
app.use("/", connexionRoutes);


app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});