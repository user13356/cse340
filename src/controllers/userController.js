import { getAllUsers as getAllUsersModel } from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();

        console.log("USERS:", users);

        res.render('users', { users });

    } catch (err) {
        console.error('Get users error:', err);
        return res.status(500).send('Server error');
    }
};



import { updateUserRole } from '../models/userModel.js';

export const setUserRole = async (req, res) => {
    const { email, role } = req.body;

    try {
        await updateUserRole(email, role);

        return res.redirect('/users');

    } catch (err) {
        console.error('setUserRole error:', err);
        return res.status(500).send('Server error');
    }
};