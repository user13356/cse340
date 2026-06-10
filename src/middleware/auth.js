export const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect('/login');
    }
    next();
};

export const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.session?.user;

        if (!user) {
            return res.redirect('/login');
        }

        // admin bypass
        if (user.role === 'admin') {
            return next();
        }

        if (user.role !== role) {
            return res.redirect('/dashboard');
        }

        next();
    };
};