const express = require("express");
const router = express.Router();
const controller = require("./controller_mdp");

router.post("/mot-de-passe-oublie", controller.demandeReset);
router.post("/reset-mot-de-passe", controller.resetMdp);

module.exports = router;