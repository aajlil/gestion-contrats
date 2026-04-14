const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());


// 🔹 Test connexion PostgreSQL
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur connexion DB");
    }
});


// 🔹 Ajouter un contrat
app.post("/contrats", async (req, res) => {
    const {
        nom,
        date_debut,
        date_fin,
        montant,
        description,
        statut,
        fournisseur_id,
        type_id,
        responsable_id
    } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO contrat (nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
            [nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur insertion");
    }
});


// 🔹 Récupérer tous les contrats
app.get("/contrats", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contrat");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur récupération");
    }
});


// 🔹 GET un seul contrat
app.get("/contrats/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query("SELECT * FROM contrat WHERE id_contrat = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur récupération");
    }
});


// 🔹 UPDATE un contrat
app.put("/contrats/:id", async (req, res) => {
    const {id} = req.params;

    const {
        nom,
        date_debut,
        date_fin,
        montant,
        description,
        statut
    } = req.body;

    try {
        const result = await pool.query(
            "UPDATE contrat SET nom = $1, date_debut = $2, date_fin = $3, montant = $4, description = $5, statut = $6 WHERE id_contrat = $7 RETURNING *",
            [nom, date_debut, date_fin, montant, description, statut, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur modification");
    }
});


// 🔹 DELETE un contrat
app.delete("/contrats/:id", async (req, res) => {
    const {id} = req.params;

    try {
        await pool.query("DELETE FROM contrat WHERE id_contrat = $1", [id]);
        res.send("Contrat supprimé");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur suppression");
    }
});


app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});