import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

//  LIST PAGE
export const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });

    } catch (error) {
        console.error(error);
        console.error("ERROR:", error);res.status(500).send(error.message);
    }
};

//  DETAILS PAGE 
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