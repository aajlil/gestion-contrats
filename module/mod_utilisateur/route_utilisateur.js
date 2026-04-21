const express = require("express");
const router = express.Router();
const controller = require("./controller_utilisateur");
const {isAdmin} = require("../../auth");

router.get("/utilisateurs", isAdmin, controller.getUtilisateurs);
router.put("/utilisateurs/role", isAdmin, controller.modifierRole);

module.exports = router;
