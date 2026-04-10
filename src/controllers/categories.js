import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

// ALL categories page
export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Categories',
            categories
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading categories');
    }
};

// CATEGORY DETAILS PAGE
export const showCategoryDetailsPage = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await getCategoryById(id);
        const projects = await getProjectsByCategoryId(id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.render('category', {
            title: category.name,
            category,
            projects
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading category');
    }
};