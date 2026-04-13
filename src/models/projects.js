import db from '../db.js';


// =======================================================
// UPCOMING PROJECTS
// =======================================================
export const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o 
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [limit]);
    return result.rows;
};


// =======================================================
// SINGLE PROJECT
// =======================================================
export const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o 
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};


// =======================================================
// PROJECTS BY ORGANIZATION
// =======================================================
export const getProjectsByOrganizationId = async (id) => {
    const query = `
        SELECT 
            project_id,
            title,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};


// =======================================================
// CREATE PROJECT
// =======================================================
export const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        INSERT INTO project
        (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    return result.rows[0].project_id;
};

//






//


// =======================================================
// UPDATE PROJECT
// =======================================================
export const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE project
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const values = [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};