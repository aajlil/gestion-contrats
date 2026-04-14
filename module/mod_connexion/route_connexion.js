const express = require("express");
const router = express.Router();
const controller = require("./controller_connexion");

router.post("/inscription", controller.inscription);
router.post("/login", controller.login);

module.exports = router;