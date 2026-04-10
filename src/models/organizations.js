import db from '../db.js';

// GET ALL
export const getAllOrganizations = async () => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name;
    `);
    return result.rows;
};

// GET ONE
export const getOrganizationDetails = async (id) => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization;
        
    `,);

    return result.rows[0];
};