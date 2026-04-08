import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show /projects page
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

// Show /project/:id page
export async function showProjectDetailsPage(req, res) {
    try {
        const id = req.params.id;
        const project = await getProjectDetails(id);

        res.render('project', {
            title: project.title,
            project
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading project details');
    }
}