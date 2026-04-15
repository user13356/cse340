import db from '../db.js';
import pool from '../db.js';


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

//

export const getProjectById = async (id) => {
    const result = await db.query(`
        SELECT *
        FROM project
        WHERE project_id = $1;
    `, [id]);

    return result.rows[0];
};



//

export const getAllProjects = async () => {
    const result = await db.query(`
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
        ORDER BY p.project_date DESC;
    `);

    return result.rows;
};

export const postAssignCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.send("Category is required");
        }

        // TODO: save to database later

        res.redirect(`/project/${id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


//

export const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await pool.query(query, [projectId, categoryId]);
};



//


export const processNewProjectForm = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            project_date,
            organizationId
        } = req.body;

        let error = null;

        //  SERVER-SIDE VALIDATION
        if (!title || title.trim().length < 3) {
            error = "Title must be at least 3 characters";
        }
        else if (!description || description.trim().length < 10) {
            error = "Description must be at least 10 characters";
        }
        else if (!project_date) {
            error = "Date is required";
        }
        else if (!organizationId) {
            error = "Organization is required";
        }

        if (error) {
            const organizations = await getAllOrganizations();

            return res.status(400).render('new-project', {
                title: 'Create Project',
                organizations,
                formData: req.body,
                error
            });
        }

        await createProject(
            title,
            description,
            location,
            project_date,
            organizationId
        );

        return res.redirect('/projects');

    } catch (error) {
        console.error(error);

        const organizations = await getAllOrganizations();

        return res.status(500).render('new-project', {
            title: 'Create Project',
            organizations,
            formData: req.body,
            error: 'Error creating project'
        });
    }
};





//

export const postEditProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            location,
            project_date,
            organizationId
        } = req.body;

        let error = null;

        //  VALIDATION
        if (!title || title.trim().length < 3) {
            error = "Title must be at least 3 characters";
        }
        else if (!description || description.trim().length < 10) {
            error = "Description must be at least 10 characters";
        }
        else if (!project_date) {
            error = "Date is required";
        }
        else if (!organizationId) {
            error = "Organization is required";
        }

        if (error) {
            const project = await getProjectById(id);
            const organizations = await getAllOrganizations();

            return res.status(400).render('edit-project', {
                title: 'Edit Project',
                project,
                organizations,
                error
            });
        }

        await updateProject(
            id,
            title,
            description,
            location,
            project_date,
            organizationId
        );

        return res.redirect(`/project/${id}`);

    } catch (err) {
        next(err);
    }
};



//

export const getAssignCategoryForm = async (req, res) => {
    try {
        const { id } = req.params;

        // PROJECT DETAILS
        const project = await getProjectById(id);

        // safe
        if (!project) {
            return res.status(404).send("Project not found");
        }

        const categories = await getAllCategories();

        res.render('assign-category', {
            title: 'Assign Category',
            project,
            categories
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};