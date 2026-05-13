import bcrypt from 'bcrypt';

const users = [];

export const createUser = async (name, email, password, role = 'user') => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        id: Date.now(),
        name,
        email,
        password: hashedPassword,
        role
    };

    users.push(user);
    return user;
};

export const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

export const getAllUsers = () => {
    return users.map(u => ({
        name: u.name,
        email: u.email,
        role: u.role
    }));
};

export const updateUserRole = (email, role) => {
    const user = users.find(u => u.email === email);
    if (user) {
        user.role = role;
    }
    return user;
};