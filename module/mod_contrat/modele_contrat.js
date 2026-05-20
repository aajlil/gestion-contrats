const pool = require("../../db");

exports.createContrat = async (
    nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id) => {
    await pool.query(
        "INSERT INTO contrat (nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [nom, date_debut, date_fin, montant, description, statut, fournisseur_id, type_id, responsable_id]
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


exports.getAllContrats = async () => {
    const result = await pool.query(`
        SELECT
            c.id_contrat,
            c.nom,
            c.date_debut,
            c.date_fin,
            c.montant,
            c.description,
            c.statut,
            f.nom AS fournisseur,
            t.nom AS type_contrat,
            u.nom AS responsable_nom,
            u.prenom AS responsable_prenom
        FROM contrat c
        LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur
        LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat
        LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur
        ORDER BY c.id_contrat DESC
    `);

    return result.rows;
};

exports.getMesContrats = async (responsable_id) => {
    const result = await pool.query(`
        SELECT
            c.id_contrat,
            c.nom,
            c.date_debut,
            c.date_fin,
            c.montant,
            c.description,
            c.statut,
            f.nom AS fournisseur,
            t.nom AS type_contrat
        FROM contrat c
        LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur
        LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat
        WHERE c.responsable_id = $1
        ORDER BY c.id_contrat DESC
    `, [responsable_id]);

    return result.rows;
};

exports.getContratById = async (id) => {
    const result = await pool.query("SELECT * FROM contrat WHERE id_contrat = $1", [id]);
    return result.rows[0];
};


exports.getContratsCalendrier = async () => {
    const result = await pool.query(
        "SELECT c.id_contrat, c.nom, c.date_fin, c.statut, f.nom AS fournisseur " +
        "FROM contrat c " +
        "LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur " +
        "WHERE c.date_fin IS NOT NULL " +
        "ORDER BY c.date_fin ASC"
    );

    return result.rows;
};

exports.getMesContratsCalendrier = async (responsable_id) => {
    const result = await pool.query(
        "SELECT c.id_contrat, c.nom, c.date_fin, c.statut, f.nom AS fournisseur " +
        "FROM contrat c " +
        "LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur " +
        "WHERE c.date_fin IS NOT NULL AND c.responsable_id = $1 " +
        "ORDER BY c.date_fin ASC",
        [responsable_id]
    );
    return result.rows;
};

exports.rechercherContrats = async (recherche) => {
    const result = await pool.query(
        "SELECT c.id_contrat, c.nom, c.date_debut, c.date_fin, c.montant, c.description, c.statut, " +
        "f.nom AS fournisseur, t.nom AS type_contrat, u.nom AS responsable_nom, u.prenom AS responsable_prenom " +
        "FROM contrat c " +
        "LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur " +
        "LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat " +
        "LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur " +
        "WHERE c.nom ILIKE $1 OR f.nom ILIKE $1 OR c.description ILIKE $1 " +
        "ORDER BY c.id_contrat DESC",
        ["%" + recherche + "%"]
    );
    return result.rows;
};

exports.rechercherMesContrats = async (recherche, utilisateur_id) => {
    const result = await pool.query(
        "SELECT c.id_contrat, c.nom, c.date_debut, c.date_fin, c.montant, c.description, c.statut, " +
        "f.nom AS fournisseur, t.nom AS type_contrat, u.nom AS responsable_nom, u.prenom AS responsable_prenom " +
        "FROM contrat c " +
        "LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur " +
        "LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat " +
        "LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur " +
        "WHERE c.responsable_id = $2 AND (c.nom ILIKE $1 OR f.nom ILIKE $1 OR c.description ILIKE $1) " +
        "ORDER BY c.id_contrat DESC",
        ["%" + recherche + "%", utilisateur_id]
    );
    return result.rows;
};

exports.filtrerContrats = async (fournisseur, type, statut, date_fin) => {
    const result = await pool.query(
        `SELECT
             c.id_contrat, c.nom, c.date_debut, c.date_fin, c.montant, c.description, c.statut,
             f.nom AS fournisseur, t.nom AS type_contrat, u.nom AS responsable_nom, u.prenom AS responsable_prenom
         FROM contrat c
                  LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur
                  LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat
                  LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur
         WHERE ($1 = '' OR f.nom ILIKE $1)
           AND ($2 = '' OR t.nom ILIKE $2) AND ($3 = '' OR c.statut = $3) AND ($4 = '' OR c.date_fin = $4::date)
         ORDER BY c.id_contrat DESC`, [`%${fournisseur}%`, `%${type}%`, statut, date_fin]
    );
    return result.rows;
};


exports.filtrerMesContrats = async (utilisateur_id, fournisseur, type, statut, date_fin) => {
    const result = await pool.query(
        `SELECT
             c.id_contrat, c.nom, c.date_debut, c.date_fin, c.montant, c.description, c.statut,
             f.nom AS fournisseur, t.nom AS type_contrat, u.nom AS responsable_nom, u.prenom AS responsable_prenom
         FROM contrat c
                  LEFT JOIN fournisseur f ON c.fournisseur_id = f.id_fournisseur
                  LEFT JOIN type_contrat t ON c.type_id = t.id_type_contrat
                  LEFT JOIN utilisateur u ON c.responsable_id = u.id_utilisateur
         WHERE c.responsable_id = $1
           AND ($2 = '' OR f.nom ILIKE $2) AND ($3 = '' OR t.nom ILIKE $3)
           AND ($4 = '' OR c.statut = $4) AND ($5 = '' OR c.date_fin = $5::date)
         ORDER BY c.id_contrat DESC`, [utilisateur_id, `%${fournisseur}%`, `%${type}%`, statut, date_fin]
    );
    return result.rows;
};

exports.getDashboardData = async () => {
    const totalResult = await pool.query(
        "SELECT COUNT(*) AS total FROM contrat"
    );
    const actifsResult = await pool.query(
        "SELECT COUNT(*) AS actifs FROM contrat WHERE statut = 'actif'"
    );
    const expiresResult = await pool.query(
        "SELECT COUNT(*) AS expires FROM contrat WHERE statut = 'expire'"
    );
    const echeanceResult = await pool.query(
        "SELECT COUNT(*) AS echeance FROM contrat WHERE statut = 'bientot_expire'"
    );
    return {
        total: Number(totalResult.rows[0].total),
        actifs: Number(actifsResult.rows[0].actifs),
        expires: Number(expiresResult.rows[0].expires),
        echeance: Number(echeanceResult.rows[0].echeance)
    };
};

exports.getDashboardUtilisateurData = async (utilisateur_id) => {
    const totalResult = await pool.query(
        "SELECT COUNT(*) AS total FROM contrat WHERE responsable_id = $1", [utilisateur_id]
    );
    const actifsResult = await pool.query(
        "SELECT COUNT(*) AS actifs FROM contrat WHERE responsable_id = $1 AND statut = 'actif'", [utilisateur_id]
    );
    const expiresResult = await pool.query(
        "SELECT COUNT(*) AS expires FROM contrat WHERE responsable_id = $1 AND statut = 'expire'", [utilisateur_id]
    );
    const echeanceResult = await pool.query(
        "SELECT COUNT(*) AS echeance FROM contrat WHERE responsable_id = $1 AND statut = 'bientot_expire'", [utilisateur_id]
    );
    return {
        total: Number(totalResult.rows[0].total),
        actifs: Number(actifsResult.rows[0].actifs),
        expires: Number(expiresResult.rows[0].expires),
        echeance: Number(echeanceResult.rows[0].echeance)
    };
};



