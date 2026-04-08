import db from './db.js';

// Get upcoming projects
export async function getUpcomingProjects(limit) {
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
}

// Get ONE project by ID
export async function getProjectDetails(id) {
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
}