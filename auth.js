exports.isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({message: "Non authentifié"});
    } else {
        next();
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({message: "Non authentifié"});
    } else if (req.session.user.role !== 1) {
        return res.status(403).json({message: "Accès refusé"});
    } else {
        next();
    }
};
