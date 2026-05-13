import { getAllUsers as getUsersFromModel } from '../models/userModel.js';

export const getAllUsers = (req, res) => {
    const users = getUsersFromModel();
    res.render('users', { users });
};

export const setUserRole = (req, res) => {
    const { email, role } = req.body;

    const user = users.find(u => u.email === email);
    if (user) {
        user.role = role;
    }

    res.redirect('/users');
};