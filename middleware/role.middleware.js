const isPermitted = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non détecté' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Accès non authorisé, rôles ayant accès: ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = isPermitted;
