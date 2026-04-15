import {
    getProjectDetails,
    updateProject,
    createProject,
    getProjectById,
    getAllProjects
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

//

import { getAllCategories } from '../models/categories.js';
import { assignCategoryToProject } from '../models/projects.js';


//

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// =======================================================
// LIST PROJECTS
// =======================================================
export async function showProjectsPage(req, res) {
    try {
        const projects = await getAllProjects();

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading projects');
    }
}

// =======================================================
// PROJECT DETAILS
// =======================================================
export async function showProjectDetailsPage(req, res) {
    try {
        const id = req.params.id;

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        res.render('project', {
            title: project.title,
            project
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading project details');
    }
}

// =======================================================
// SHOW NEW PROJECT FORM (FIXED - NO BLANK PAGE)
// =======================================================
export const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        return res.render('new-project', {
            title: 'Create Project',   // IMPORTANT (prevents header crash)
            organizations,
            formData: {},
            error: null
        });

    } catch (error) {
        console.error("NEW PROJECT FORM ERROR:", error);

        return res.status(500).send("Server error loading form");
    }
};

// =======================================================
// PROCESS NEW PROJECT FORM
// =======================================================
export const processNewProjectForm = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            project_date,
            organizationId
        } = req.body;

        let error = null;

        if (!title || title.trim().length < 3) {
            error = "Title must be at least 3 characters";
        }
        else if (!description || description.trim().length < 3) {
            error = "Description must be at least 3 characters";
        }
        else if (!location || location.trim().length < 3) {
            error = "Location must be at least 3 characters";
        }
        else if (!project_date) {
            error = "Project date is required";
        }
        else if (!organizationId) {
            error = "Organization is required";
        }

        if (error) {
            const organizations = await getAllOrganizations();

            return res.status(400).render('new-project', {
                title: 'Create Project',
                organizations,
                formData: req.body,
                error
            });
        }

        await createProject(
            title,
            description,
            location,
            project_date,
            organizationId
        );

        return res.redirect('/projects');

    } catch (error) {
        console.error(error);

        const organizations = await getAllOrganizations();

        return res.status(500).render('new-project', {
            title: 'Create Project',
            organizations,
            formData: req.body,
            error: 'Error creating project'
        });
    }
};

// =======================================================
// EDIT PROJECT FORM
// =======================================================

export const getEditProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await getProjectById(id);
        const organizations = await getAllOrganizations();

        return res.render('edit-project', {
            title: 'Edit Project',
            project,
            organizations,
            errors: [],       
            formData: {},     
            success: null     
        });

    } catch (err) {
        next(err);
    }
};


export const postEditProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            location,
            project_date,
            organizationId
        } = req.body;

        const errors = [];

        if (!title || title.trim().length < 3) {
            errors.push("Title must be at least 3 characters");
        }

        if (!description || description.trim().length < 3) {
            errors.push("Description must be at least 3 characters");
        }

        if (!location || location.trim().length < 3) {
            errors.push("Location must be at least 3 characters");
        }

        if (!project_date) {
            errors.push("Project date is required");
        }

        if (!organizationId) {
            errors.push("Organization is required");
        }

        if (errors.length > 0) {
            const project = await getProjectById(id);
            const organizations = await getAllOrganizations();

            return res.status(400).render('edit-project', {
            title: 'Edit Project',
            project,
            organizations,
            errors,
            formData: req.body,
            success: null   
        });
        }

        await updateProject(
            id,
            title,
            description,
            location,
            project_date,
            organizationId
        );

        return res.redirect(`/project/${id}`);

    } catch (err) {
        next(err);
    }
};

// =======================================================
// ASSIGN CATEGORY
// =======================================================







export const getAssignCategoryForm = async (req, res) => {
    try {
        const { id } = req.params;

        const categories = await getAllCategories();

        res.render('assign-category', {
            title: 'Assign Category',
            projectId: id,
            categories
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};



export const postAssignCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).send("Category is required");
        }

        // CATEGORY TO DATABASE 
        await assignCategoryToProject(id, categoryId);

        // BACK TO PROJECT PAGE 
        return res.redirect(`/project/${id}`);

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};