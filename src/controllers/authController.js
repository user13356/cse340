import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel.js';



// =====================
// SHOW PAGES
// =====================
export const showLoginPage = (req, res) => {
    res.render('login');
};

export const showRegisterPage = (req, res) => {
    res.render('register');
};
// =====================
// Register
// =====================

export const processRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await findUserByEmail(email);

        if (exists) {
            return res.redirect('/register');
        }

        await createUser(name, email, password, 'user');

        return res.redirect('/login');

    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).send('Server error');
    }
};

// =====================
// LOGIN
// =====================
export const processLogin = async (req, res) => {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        console.log("USER:", user);

        if (!user) {
            return res.redirect('/login');
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.redirect('/login');
        }

        // STORE SESSION 
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // FORCE SESSION SAVE BEFORE REDIRECT
        req.session.save(() => {
            console.log("SESSION SAVED:", req.session.user);

            if (user.role === 'admin') {
                return res.redirect('/admin');
            }

            return res.redirect('/dashboard');
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Server error");
    }
};

// =====================
// LOGOUT
// =====================
export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};