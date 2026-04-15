import db from '../db.js';
import pool from '../db.js';


// =======================================================
// GET ALL ORGANIZATIONS
// =======================================================
export const getAllOrganizations = async () => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        ORDER BY name;
    `);

    return result.rows;
};


export const getOrganizationById = async (id) => {
    const result = await db.query(`
        SELECT *
        FROM organization
        WHERE organization_id = $1
    `, [id]);

    return result.rows[0];
};







// =======================================================
// GET ONE ORGANIZATION
// =======================================================
export const getOrganizationDetails = async (id) => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, website, logo_filename
        FROM organization
        WHERE organization_id = $1;
    `, [id]);

    return result.rows[0];
};



// =======================================================
// CREATE ORGANIZATION
// =======================================================

export const createOrganization = async (
    name,
    description,
    contact_email,
    website,
    logo_filename
) => {
    const result = await db.query(`
        INSERT INTO organization
        (name, description, contact_email, website, logo_filename)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING organization_id;
    `, [name, description, contact_email, website, logo_filename]);

    return result.rows[0].organization_id;
};



export const updateOrganization = async (
    id,
    name,
    description,
    contact_email,
    website,
    logo_filename
) => {
    const result = await db.query(`
        UPDATE organization
        SET name = $1,
            description = $2,
            contact_email = $3,
            website = $4,
            logo_filename = $5
        WHERE organization_id = $6
        RETURNING organization_id;
    `, [name, description, contact_email, website, logo_filename, id]);

    return result.rows[0];
};