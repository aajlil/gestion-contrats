const pool = require("../../db");

exports.getContratsAvecResponsable = async () => {
    const result = await pool.query(
        `SELECT
             c.id_contrat, c.nom AS contrat_nom, c.date_fin, u.id_utilisateur,
             u.nom AS utilisateur_nom, u.prenom AS utilisateur_prenom, u.identifiant, u.email
         FROM contrat c LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur
         WHERE c.date_fin IS NOT NULL`
    );
    return result.rows;
};