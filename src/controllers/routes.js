import express from 'express';

// =====================
// AUTH CONTROLLERS
// =====================
import {
    showLoginPage,
    showRegisterPage,
    processLogin,
    processRegister,
    logout
} from './authController.js';

// =====================
// USER CONTROLLERS
// =====================
import {
    getAllUsers,
    setUserRole
} from './userController.js';

// =====================
// AUTH MIDDLEWARE
// =====================
import { requireLogin, requireRole } from '../middleware/auth.js';

// =====================
// ORGANIZATION CONTROLLERS
// =====================
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
} from './organizations.js';

// =====================
// PROJECT CONTROLLERS
// =====================
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    volunteerForProject,
    removeVolunteerFromProject
} from './projects.js';

// =====================
// CATEGORY CONTROLLERS
// =====================
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    getAddCategory,
    postAddCategory
} from './categories.js';

// =====================
// MODEL FUNCTION (dashboard use)
// =====================
import { getVolunteerProjects } from '../models/projects.js';

const router = express.Router();


// =====================
// USER ROLE UPDATE (ADMIN)
// =====================
router.post(
    '/users/role',
    requireLogin,
    requireRole('admin'),
    setUserRole
);


// =====================
// AUTH ROUTES
// =====================
router.get('/login', showLoginPage);
router.post('/login', processLogin);

router.get('/register', showRegisterPage);
router.post('/register', processRegister);

router.get('/logout', logout);


// =====================
// DASHBOARD
// =====================
router.get('/dashboard', requireLogin, async (req, res) => {
    const volunteerProjects =
        await getVolunteerProjects(req.session.user.id);

    res.render('dashboard', {
        user: req.session.user,
        volunteerProjects
    });
});


// =====================
// ADMIN USERS
// =====================
router.get('/users', requireLogin, requireRole('admin'), getAllUsers);

router.get('/admin', requireLogin, requireRole('admin'), (req, res) => {
    res.render('admin', {
        user: req.session.user
    });
});


// =====================
// ORGANIZATIONS
// =====================
router.get('/organizations', requireLogin, showOrganizationsPage);

router.get(
    '/organizations/new',
    requireLogin,
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/organizations',
    requireLogin,
    requireRole('admin'),
    processNewOrganizationForm
);

router.get(
    '/organization/:id',
    requireLogin,
    showOrganizationDetailsPage
);


// =====================
// PROJECTS
// =====================
router.get('/projects', requireLogin, showProjectsPage);

router.get(
    '/projects/new',
    requireLogin,
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/projects',
    requireLogin,
    requireRole('admin'),
    processNewProjectForm
);

router.get(
    '/project/:id',
    requireLogin,
    showProjectDetailsPage
);


// =====================
// VOLUNTEER ROUTES
// =====================
router.get(
    '/project/:id/volunteer',
    requireLogin,
    volunteerForProject
);

router.get(
    '/project/:id/unvolunteer',
    requireLogin,
    removeVolunteerFromProject
);


// =====================
// CATEGORIES
// =====================
router.get('/categories', requireLogin, showCategoriesPage);

router.get(
    '/categories/add',
    requireLogin,
    requireRole('admin'),
    getAddCategory
);

router.post(
    '/categories/add',
    requireLogin,
    requireRole('admin'),
    postAddCategory
);


// =====================
export default router;