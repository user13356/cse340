import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from '../models/categories.js';

// =======================================================
// LIST CATEGORIES
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
// CATEGORY DETAILS
// =======================================================
export const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).send("Invalid category ID");
        }

        const category = await getCategoryById(id);
        const projects = await getProjectsByCategoryId(id);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render('category', {
            title: category.name,
            category,
            projects
        });

    } catch (error) {
        next(error);
    }
};

// =======================================================
// ADD CATEGORY FORM
// =======================================================
export const getAddCategory = (req, res) => {
    res.render('add-category', {
        title: 'Add Category',
        error: null
    });
};

// =======================================================
// CREATE CATEGORY
// =======================================================
export const postAddCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).render("add-category", {
                title: 'Add Category',
                error: "Category name is required"
            });
        }

        await createCategory(name);
        res.redirect("/categories");

    } catch (err) {
        next(err);
    }
};

// =======================================================
// EDIT CATEGORY FORM
// =======================================================
export const getEditCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
            return res.status(400).send("Invalid category ID");
        }

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render("edit-category", {
            title: "Edit Category",
            category,
            error: null
        });

    } catch (err) {
        next(err);
    }
};

// =======================================================
// UPDATE CATEGORY
// =======================================================
export const postEditCategory = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body;

        if (isNaN(id)) {
            return res.status(400).send("Invalid category ID");
        }

        if (!name || name.trim() === "") {
            return res.status(400).render("edit-category", {
                title: "Edit Category",
                category: { category_id: id, name: "" },
                error: "Name is required"
            });
        }

        await updateCategory(id, name);
        res.redirect("/categories");

    } catch (err) {
        next(err);
    }
};