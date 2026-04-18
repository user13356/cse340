import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel.js';

export const showLoginPage = (req, res) => {
    res.render('login');
};

export const showRegisterPage = (req, res) => {
    res.render('register');
};

export const processRegister = async (req, res) => {
    const { name, email, password } = req.body;

    const exists = findUserByEmail(email);
    if (exists) return res.redirect('/register');

    await createUser(name, email, password, 'user');

    res.redirect('/login');
};

export const processLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) return res.redirect('/login');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect('/login');

    req.session.user = {
        name: user.name,
        email: user.email,
        role: user.role
    };

    res.redirect('/dashboard');
};

export const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};