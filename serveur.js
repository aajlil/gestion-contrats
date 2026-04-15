const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// page par défaut(connexion)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "connexion.html"));
});

// import module connexion
const connexionRoutes = require("./module/mod_connexion/route_connexion");
app.use("/", connexionRoutes);


app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});