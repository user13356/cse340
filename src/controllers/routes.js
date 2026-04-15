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
    getEditProject,
    postEditProject,
    getAssignCategoryForm,
    postAssignCategory
} from './projects.js';


import {
    showCategoriesPage,
    showCategoryDetailsPage,
    getAddCategory,
    postAddCategory,
    getEditCategory,
    postEditCategory
    
    
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
router.get('/edit-project/:id', getEditProject);

// PROCESS EDIT FORM
router.post('/edit-project/:id', postEditProject);


// List all categories
router.get('/categories', showCategoriesPage);


// Category details (projects under category)

router.get('/categories/add', getAddCategory);
router.post('/categories/add', postAddCategory);

router.get('/categories/:id', showCategoryDetailsPage);

router.get('/categories/edit/:id', getEditCategory);
router.post('/categories/edit/:id', postEditCategory);

//

// Assign Category

router.get('/project/:id/assign-category', getAssignCategoryForm);
router.post('/project/:id/assign-category', postAssignCategory);



//

export default router;