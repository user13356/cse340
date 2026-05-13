import express from 'express';

import {
    showLoginPage,
    showRegisterPage,
    processLogin,
    processRegister,
    logout
} from './authController.js';

import { getAllUsers } from './userController.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

// 👇 ADD THESE IMPORTS (VERY IMPORTANT)
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
} from './organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm
} from './projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    getAddCategory,
    postAddCategory
} from './categories.js';

import { setUserRole } from './userController.js';

const router = express.Router();

router.post('/users/role', requireLogin, requireRole('admin'), setUserRole);

// =====================
// AUTH
// =====================
router.get('/login', showLoginPage);
router.post('/login', processLogin);

router.get('/register', showRegisterPage);
router.post('/register', processRegister);

router.get('/logout', logout);


// =====================
// DASHBOARD
// =====================
router.get('/dashboard', requireLogin, (req, res) => {
    res.render('dashboard');
});


// =====================
// USERS (ADMIN ONLY)
// =====================
router.get('/users', requireLogin, requireRole('admin'), getAllUsers);


// =====================
// ORGANIZATIONS
// =====================
router.get('/organizations', requireLogin, showOrganizationsPage);
router.get('/organizations/new', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post('/organizations', requireLogin, requireRole('admin'), processNewOrganizationForm);
router.get('/organization/:id', requireLogin, showOrganizationDetailsPage);


// =====================
// PROJECTS
// =====================
router.get('/projects', requireLogin, showProjectsPage);
router.get('/projects/new', requireLogin, requireRole('admin'), showNewProjectForm);
router.post('/projects', requireLogin, requireRole('admin'), processNewProjectForm);
router.get('/project/:id', requireLogin, showProjectDetailsPage);


// =====================
// CATEGORIES
// =====================
router.get('/categories', requireLogin, showCategoriesPage);
router.get('/categories/add', requireLogin, requireRole('admin'), getAddCategory);
router.post('/categories/add', requireLogin, requireRole('admin'), postAddCategory);

export default router;