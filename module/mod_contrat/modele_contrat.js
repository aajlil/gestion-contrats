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

exports.updateContrat = async (
    id, nom, date_debut, date_fin, montant, description, statut) => {
    await pool.query(
        "UPDATE contrat SET nom=$1, date_debut=$2, date_fin=$3, montant=$4, description=$5, statut=$6 WHERE id_contrat=$7",
        [nom, date_debut, date_fin, montant, description, statut, id]
    );
};