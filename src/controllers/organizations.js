import {
    getOrganizationById,
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
export const showNewOrganizationForm = async (req, res) => {
    try {
        res.render('new-organization', {
            title: 'New Organization',
            formData: {},   
            errors: []      
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};


// =======================================================
// PROCESS NEW ORGANIZATION
// POST /organizations
// =======================================================

export const processNewOrganizationForm = async (req, res) => {
    const { name, description, contact_email, website, logo_filename } = req.body;

    try {
        const errors = [];

        if (!name || name.trim().length < 3) {
            errors.push("Name must be at least 3 characters");
        }

        if (!description || description.trim().length < 3) {
            errors.push("Description must be at least 3 characters");
        }

        if (!contact_email) {
            errors.push("Email is required");
        }

        if (errors.length > 0) {
            return res.status(400).render('new-organization', {
                title: 'New Organization',
                formData: req.body,
                errors   // REQUIRED
            });
        }

        await createOrganization(
            name,
            description,
            contact_email,
            website,
            logo_filename
        );

        return res.redirect('/organizations');

    } catch (error) {
        console.error(error);

        return res.status(500).render('new-organization', {
            title: 'New Organization',
            formData: req.body,
            errors: ["Error creating organization"]
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

        const organization = await getOrganizationById(id);

        return res.render('edit-organization', {
            title: 'Edit Organization',
            organization,
            formData: {},   // REQUIRED
            errors: []      //  ERROR
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
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
        const errors = [];

        // VALIDATION
        if (!name || name.trim().length < 3) {
            errors.push("Name must be at least 3 characters");
        }

        if (!description || description.trim().length < 3) {
            errors.push("Description must be at least 3 characters");
        }

        if (!contact_email) {
            errors.push("Email is required");
        }

        // IF ERRORS → RE-RENDER FORM
        if (errors.length > 0) {
            const organization = await getOrganizationById(id);

            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                organization,
                formData: req.body,   // 🔥 THIS FIXES YOUR CRASH
                errors
            });
        }

        // UPDATE
        await updateOrganization(
            id,
            name,
            description,
            contact_email,
            website,
            logo_filename
        );

        // SUCCESS
        return res.redirect(`/organization/${id}`);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error updating organization");
    }
};