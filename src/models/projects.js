import db from '../db.js';

// Upcoming projects
export const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT 
            sp.project_id,
            sp.name AS title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            sp.organization_id,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o 
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [limit]);
    return result.rows;
};

// Single project
export const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            sp.project_id,
            sp.name AS title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            sp.organization_id,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o 
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

// 
export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT 
            project_id,
            organization_id,
            name AS title,
            description,
            location,
            project_date AS date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};