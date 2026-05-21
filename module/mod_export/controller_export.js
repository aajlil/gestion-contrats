const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const modeleContrat = require("../mod_contrat/modele_contrat");

function formaterStatut(statut) {
    if (statut === "actif") {
        return "Actif";
    } else if (statut === "expire") {
        return "Expiré";
    } else if (statut === "bientot_expire") {
        return "Bientôt expiré";
    } else {
        return "Non renseigné";
    }
}

function formaterDate(date) {
    return new Date(date).toLocaleDateString("fr-FR");
}

function getValeurDate(date) {
    if (date) {
        return formaterDate(date);
    } else {
        return "";
    }
}

function getValeurTexte(valeur) {
    if (valeur) {
        return valeur;
    } else {
        return "";
    }
}

function getResponsable(nom, prenom) {
    return getValeurTexte(nom) + " " + getValeurTexte(prenom);
}

exports.exportExcel = async (req, res) => {
    const {ids} = req.body;
    try {
        let contrats;
        if (!ids || ids.length === 0) {
            return res.json({message: "Aucun contrat sélectionné"});
        } else if (req.session.user.role === 1) {
            contrats = await modeleContrat.getContratsByIds(ids);
        } else {
            contrats = await modeleContrat.getMesContratsByIds(ids, req.session.user.id);
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Contrats");
        sheet.columns = [
            {header: "Nom", key: "nom"},
            {header: "Fournisseur", key: "fournisseur"},
            {header: "Type", key: "type_contrat"},
            {header: "Description", key: "description"},
            {header: "Date de début", key: "date_debut"},
            {header: "Date de fin", key: "date_fin"},
            {header: "Montant", key: "montant"},
            {header: "Responsable", key: "responsable"},
            {header: "Statut", key: "statut"}
        ];

        contrats.forEach(function(c) {
            sheet.addRow({
                nom: c.nom,
                fournisseur: getValeurTexte(c.fournisseur),
                type_contrat: getValeurTexte(c.type_contrat),
                description: getValeurTexte(c.description),
                date_debut: getValeurDate(c.date_debut),
                date_fin: getValeurDate(c.date_fin),
                montant: c.montant,
                responsable: getResponsable(c.responsable_nom, c.responsable_prenom),
                statut: formaterStatut(c.statut)
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=contrats.xlsx");
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        return res.status(500).json({message:"Erreur export Excel"});
    }
};

exports.exportPdf = async (req, res) => {
    const {ids} = req.body;
    try {
        let contrats;
        if (!ids || ids.length === 0) {
            return res.json({message:"Aucun contrat sélectionné"});
        } else if (req.session.user.role === 1) {
            contrats = await modeleContrat.getContratsByIds(ids);
        } else {
            contrats = await modeleContrat.getMesContratsByIds(ids, req.session.user.id);
        }

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=contrats.pdf");
        doc.pipe(res);
        doc.fontSize(18).text("Contrats");
        doc.moveDown();

        contrats.forEach(function(c) {
            doc.fontSize(12).text("Nom : " + c.nom);
            doc.text("Fournisseur : " + getValeurTexte(c.fournisseur));
            doc.text("Type : " + getValeurTexte(c.type_contrat));
            doc.text("Description : " + getValeurTexte(c.description));
            doc.text("Date de début : " + getValeurDate(c.date_debut));
            doc.text("Date de fin : " + getValeurDate(c.date_fin));
            doc.text("Montant : " + c.montant + " EUR");
            doc.text("Responsable : " + getResponsable(c.responsable_nom, c.responsable_prenom));
            doc.text("Statut : " + formaterStatut(c.statut));
            doc.moveDown();
        });
        doc.end();
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Erreur export PDF"});
    }
};