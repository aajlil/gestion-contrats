const pool = require("../../db");

exports.createContrat = async (
    nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id) => {
    await pool.query(
        "INSERT INTO contrat (nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [nom, date_debut, date_fin, montant, description, fournisseur_id, type_id, responsable_id]
    );
};

exports.createFournisseur = async (nom, email, telephone) => {
    await pool.query("INSERT INTO fournisseur (nom, email, telephone) VALUES ($1,$2,$3)", [nom, email, telephone]);
};

exports.createType = async (nom) => {
    await pool.query("INSERT INTO type_contrat (nom) VALUES ($1)", [nom]);
};