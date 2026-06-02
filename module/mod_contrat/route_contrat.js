const express = require("express");
const router = express.Router();
const pool = require("../../db");
const controller = require("./controller_contrat");
const {isAuthenticated, isAdmin} = require("../../auth");

// fournisseurs
router.get("/fournisseurs", isAuthenticated, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM fournisseur");
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération fournisseurs"});
    }
});

// types
router.get("/types", isAuthenticated, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM type_contrat");
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération types"});
    }
});

// utilisateurs
router.get("/utilisateurs", isAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT id_utilisateur, nom, prenom, identifiant, email, role_id FROM utilisateur");
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur récupération utilisateurs"});
    }
});


// contrats admin
router.get("/contrats", isAdmin, controller.getAll);
// contrats utilisateur
router.get("/mes-contrats", isAuthenticated, controller.getMesContrats);
router.get("/calendrier-contrats", isAuthenticated, controller.getCalendrier);
router.get("/recherche-contrats", isAdmin, controller.rechercher);
router.get("/recherche-mes-contrats", isAuthenticated, controller.rechercherMesContrats);
router.get("/filtres-contrats", isAdmin, controller.filtrer);
router.get("/filtres-mes-contrats", isAuthenticated, controller.filtrerMesContrats);
router.get("/dashboard-data", isAdmin, controller.getDashboard);
router.get("/dashboard-utilisateur-data", isAuthenticated, controller.getDashboardUtilisateur);
router.get("/statistiques-data", isAdmin, controller.getStatistiques);
router.get("/statistiques-utilisateur-data", isAuthenticated, controller.getStatistiquesUtilisateur);
router.get("/alertes-expiration", isAdmin, controller.getAlertes);
router.get("/alertes-expiration-utilisateur", isAuthenticated, controller.getAlertesUtilisateur);
router.delete("/fournisseurs/:id", isAdmin, controller.supprimerFournisseur);
router.delete("/types/:id", isAdmin, controller.supprimerType);


// supprimer plusieurs contrats
router.delete("/contrats", isAdmin, async (req, res) => {
    try {
        const {ids} = req.body;
        if (!ids || ids.length === 0) {
            return res.json({message:"Aucun contrat sélectionné"});
        } else {
            await pool.query("DELETE FROM contrat WHERE id_contrat = ANY($1)", [ids]);
            return res.json({message:"Contrat(s) supprimé(s)"});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur suppression"});
    }
});

router.post("/contrats", isAdmin, controller.create);
router.post("/fournisseurs", isAdmin, controller.createFournisseur);
router.post("/types", isAdmin, controller.createType);
router.put("/contrats", isAdmin, controller.update);

module.exports = router;
