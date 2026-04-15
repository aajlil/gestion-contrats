const express = require("express");
const router = express.Router();
const pool = require("../../db");
const controller = require("./controller_contrat");

// fournisseurs
router.get("/fournisseurs", async (req, res) => {
    const result = await pool.query("SELECT * FROM fournisseur");
    res.json(result.rows);
});

// types
router.get("/types", async (req, res) => {
    const result = await pool.query("SELECT * FROM type_contrat");
    res.json(result.rows);
});

// utilisateurs
router.get("/utilisateurs", async (req, res) => {
    const result = await pool.query("SELECT * FROM utilisateur");
    res.json(result.rows);
});

router.post("/contrats", controller.create);
router.post("/fournisseurs", controller.createFournisseur);
router.post("/types", controller.createType);
module.exports = router;