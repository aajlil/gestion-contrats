const express = require("express");
const router = express.Router();
const controller = require("./controller_notification");
const {isAdmin} = require("../../auth");

router.get("/tester-notifications", isAdmin, controller.testerNotifications);
module.exports = router;