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

// ASSIGN CATEGORY TO PROJECT
export const assignCategoryToProject = async (categoryId, projectId) => {
    await db.query(`
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `, [categoryId, projectId]);
};

// UPDATE CATEGORY ASSIGNMENTS
export const updateCategoryAssignments = async (projectId, categoryIds = []) => {
    await db.query(
        `DELETE FROM project_category WHERE project_id = $1`,
        [projectId]
    );

    if (!Array.isArray(categoryIds)) return;

    for (const id of categoryIds) {
        await assignCategoryToProject(id, projectId);
    }
};