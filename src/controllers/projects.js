import {
    getProjectDetails,
    getUpcomingProjects,
    updateProject,
    createProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;


// =======================================================
// LIST PROJECTS
// =======================================================
export async function showProjectsPage(req, res) {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

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
// SHOW EDIT FORM
// =======================================================
export const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;

        const projectDetails = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!projectDetails) {
            return res.status(404).send('Project not found');
        }

        res.render('edit-project', {
            title: 'Edit Project',
            projectDetails,
            organizations,
            formData: {},
            error: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


// =======================================================
// PROCESS EDIT FORM
// =======================================================
export const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);

    } catch (error) {
        console.error(error);

        req.flash('error', 'Error updating project');
        res.redirect(`/edit-project/${projectId}`);
    }
};


// =======================================================
// SHOW CREATE FORM
// =======================================================
export const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('new-project', {
            title: 'Create Project',
            organizations,
            formData: {},
            error: req.flash('error'),
            success: req.flash('success')
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


// =======================================================
// PROCESS CREATE FORM
// =======================================================
export const processNewProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;

    try {
        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project created successfully!');
        res.redirect('/projects');

    } catch (error) {
        console.error(error);

        const organizations = await getAllOrganizations();

        res.render('new-project', {
            title: 'Create Project',
            organizations,
            formData: req.body,
            error: ['Error creating project'],
            success: []
        });
    }
};