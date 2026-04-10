import express from 'express';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './categories.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './projects.js';

const router = express.Router();

// categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

export default router;