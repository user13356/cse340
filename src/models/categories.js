import db from '../db.js';

// GET ALL CATEGORIES
export const getAllCategories = async () => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `);
    return result.rows;
};

// GET ONE CATEGORY
export const getCategoryById = async (id) => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `, [id]);

    return result.rows[0];
};

// GET PROJECTS BY CATEGORY
export const getProjectsByCategoryId = async (id) => {
    const result = await db.query(`
        SELECT sp.project_id, sp.name, sp.description
        FROM service_project sp
        JOIN project_category pc ON sp.project_id = pc.project_id
        WHERE pc.category_id = $1;
    `, [id]);

    return result.rows;
};