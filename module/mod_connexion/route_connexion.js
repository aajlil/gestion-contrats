const express = require("express");
const router = express.Router();
const controller = require("./controller_connexion");

router.post("/inscription", controller.inscription);
router.post("/login", controller.login);
router.get("/confirmer-inscription", controller.confirmerInscription);

module.exports = router;