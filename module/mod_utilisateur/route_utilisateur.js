const express = require("express");
const router = express.Router();
const controller = require("./controller_utilisateur");
const {isAdmin, isAuthenticated} = require("../../auth");

router.get("/utilisateurs", isAdmin, controller.getUtilisateurs);
router.put("/utilisateurs/role", isAdmin, controller.modifierRole);
router.put("/modifier-mot-de-passe", isAuthenticated, controller.modifierMotDePasse);
router.put("/modifier-profil", isAuthenticated, controller.modifierProfil);

module.exports = router;