export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user || req.session.user.role !== role) {
            return res.redirect('/dashboard');
        }
        next();
    };
};