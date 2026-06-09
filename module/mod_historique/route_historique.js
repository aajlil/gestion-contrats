const express = require("express");
const router = express.Router();
const controller = require("./controller_historique");
const {isAdmin} = require("../../auth");

router.get("/historique/:id", isAdmin, controller.getHistoriqueByContrat);

module.exports = router;
