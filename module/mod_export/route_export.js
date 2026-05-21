const express = require("express");
const router = express.Router();
const controller = require("./controller_export");
const {isAuthenticated} = require("../../auth");

router.post("/export/excel", isAuthenticated, controller.exportExcel);
router.post("/export/pdf", isAuthenticated, controller.exportPdf);

module.exports = router;