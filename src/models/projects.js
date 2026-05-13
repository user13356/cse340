// src/models/projects.js
import db from './db.js';

export const getAllProjects = async () => {
    const query = `
        SELECT 
            sp.project_id,
            sp.name AS title,           
            sp.description,
            o.name AS organization_name
        FROM service_project sp
        JOIN organization o 
          ON sp.organization_id = o.organization_id
        ORDER BY sp.project_id ASC;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error loading projects:', error);
        throw error;
    }
};

