import {
    getProjectDetails,
    updateProject,
    createProject,
    getProjectById,
    getAllProjects
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

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

        if (!title || !description || !project_date || !organizationId) {
            const organizations = await getAllOrganizations();

            return res.status(400).render('new-project', {
                title: 'Create Project',
                organizations,
                formData: req.body,
                error: 'All required fields must be filled'
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

        if (!project) {
            return res.status(404).render('404', {
                title: 'Not Found'
            });
        }

        const formattedDate = project.project_date
            ? new Date(project.project_date).toISOString().split('T')[0]
            : '';

        const organizations = await getAllOrganizations();

        return res.render('edit-project', {
            title: 'Edit Project',
            project: {
                ...project,
                project_date: formattedDate
            },
            organizations,
            error: null,
            success: null   // 
        });

    } catch (err) {
        next(err);
    }
};

// =======================================================
// UPDATE PROJECT
// =======================================================
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

        if (!title || !description || !project_date || !organizationId) {
            return res.status(400).send("Missing required fields");
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