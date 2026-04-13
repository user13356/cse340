import {
    getAllOrganizations,
    getOrganizationDetails,
    updateOrganization,
    createOrganization
} from '../models/organizations.js';

import {
    getProjectsByOrganizationId
} from '../models/projects.js';


// =======================================================
// LIST PAGE
// /organizations
// =======================================================
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send(error.message);
    }
};


// =======================================================
// SHOW NEW ORGANIZATION FORM
// /organizations/new
// =======================================================
export const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', {
        title: 'New Organization',
        formData: {},
        error: req.flash('error'),
        success: req.flash('success')
    });
};


// =======================================================
// PROCESS NEW ORGANIZATION
// POST /organizations
// =======================================================
export const processNewOrganizationForm = async (req, res) => {
    const { name, description, contact_email, website, logo_filename } = req.body;

    try {
        // VALIDATION
        if (!name || !description || !contact_email) {
            req.flash('error', 'Name, description, and email are required');
            return res.redirect('/organizations/new');
        }

        await createOrganization(
            name,
            description,
            contact_email,
            website,
            logo_filename
        );

        req.flash('success', 'Organization created successfully!');
        res.redirect('/organizations');

    } catch (error) {
        console.error(error);

        res.render('new-organization', {
            title: 'New Organization',
            formData: req.body,
            error: ['Error creating organization'],
            success: []
        });
    }
};


// =======================================================
// SHOW ORGANIZATION DETAILS
// /organization/:id
// =======================================================
export const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        const organizationDetails = await getOrganizationDetails(id);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found');
        }

        const projects = await getProjectsByOrganizationId(id);

        res.render('organization', {
            title: organizationDetails.name,
            organizationDetails,
            projects
        });

    } catch (error) {
        next(error);
    }
};


// =======================================================
// SHOW EDIT FORM
// /edit-organization/:id
// =======================================================
export const showEditOrganizationForm = async (req, res) => {
    try {
        const id = req.params.id;

        const organizationDetails = await getOrganizationDetails(id);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found');
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            organizationDetails,
            formData: organizationDetails,
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
// POST /edit-organization/:id
// =======================================================
export const processEditOrganizationForm = async (req, res) => {
    const id = req.params.id;

    const { name, description, contact_email, website, logo_filename } = req.body;

    try {
        await updateOrganization(
            id,
            name,
            description,
            contact_email,
            website,
            logo_filename
        );

        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${id}`);

    } catch (error) {
        console.error(error);

        req.flash('error', 'Error updating organization');
        res.redirect(`/edit-organization/${id}`);
    }
};