import express from 'express';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm
} from './projects.js';


import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './categories.js';



const router = express.Router();


// =======================================================
// ORGANIZATIONS
// =======================================================
router.get('/organizations', showOrganizationsPage);

router.get('/organizations/new', showNewOrganizationForm);
router.post('/organizations', processNewOrganizationForm);

router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganizationForm);

//

// LIST ALL PROJECTS
router.get('/projects', showProjectsPage);

// SHOW CREATE FORM
router.get('/projects/new', showNewProjectForm);

// PROCESS CREATE FORM
router.post('/projects', processNewProjectForm);

// SHOW SINGLE PROJECT
router.get('/project/:id', showProjectDetailsPage);

// SHOW EDIT FORM
router.get('/edit-project/:id', showEditProjectForm);

// PROCESS EDIT FORM
router.post('/edit-project/:id', processEditProjectForm);


// List all categories
router.get('/categories', showCategoriesPage);

// Category details (projects under category)
router.get('/category/:id', showCategoryDetailsPage);


//

export default router;