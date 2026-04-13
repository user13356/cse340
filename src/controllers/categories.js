import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';


// =======================================================
// ALL CATEGORIES PAGE
// =======================================================
export const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Categories',
            categories
        });

    } catch (error) {
        next(error);
    }
};


// =======================================================
// CATEGORY DETAILS PAGE
// =======================================================
export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        const projects = await getProjectsByCategoryId(id) || [];

        res.render('category', {
            title: category.name,
            category,
            projects
        });

    } catch (error) {
        next(error);
    }
};