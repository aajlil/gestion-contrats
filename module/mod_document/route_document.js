const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("./controller_document");
const {isAuthenticated, isAdmin} = require("../../auth");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});


function fileFilter(req, file, cb) {
    const extensionsAutorisees = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const extension = path.extname(file.originalname).toLowerCase();
    if (extensionsAutorisees.includes(extension)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non autorisé"));
    }
}


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


router.post("/documents", isAdmin, function(req, res) {
    upload.single("document")(req, res, async function(err) {
        if (err) {
            return res.status(400).json({message: err.message});
        } else {
            return controller.upload(req, res);
        }
    });
});


router.get("/documents/telecharger/:id", isAuthenticated, controller.telecharger);
router.get("/documents/:id", isAuthenticated, controller.getByContrat);
router.get("/mes-documents", isAuthenticated, controller.getMesDocuments);
router.get("/mes-documents/telecharger/:id", isAuthenticated, controller.telechargerUtilisateur);
router.delete("/documents/:id", isAdmin, controller.supprimer);
module.exports = router;
