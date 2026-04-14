import db from '../db.js';

// =======================================================
// GET ALL CATEGORIES
// =======================================================
export const getAllCategories = async () => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `);
    return result.rows;
};


// =======================================================
// GET CATEGORY BY ID
// =======================================================
export const getCategoryById = async (id) => {
    const result = await db.query(`
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `, [id]);

    return result.rows[0];
};


// =======================================================
// GET PROJECTS BY CATEGORY
// =======================================================
export const getProjectsByCategoryId = async (id) => {
    const result = await db.query(`
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date
        FROM project p
        JOIN project_category pc 
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_id;
    `, [id]);

    return result.rows;
};


// =======================================================
// CREATE CATEGORY
// =======================================================
export const createCategory = async (name) => {
    const result = await db.query(`
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING *;
    `, [name]);

    return result.rows[0];
};


//

export const updateCategory = async (id, name) => {
    const result = await db.query(`
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING *;
    `, [name, id]);

    return result.rows[0];
};


//