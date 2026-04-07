// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Import your database functions
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { getAllProjects } from './src/models/projects.js';
import { testConnection } from './src/models/db.js';

// Environment and port
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//
// -------- DATABASE SYNC -------- //
const syncDatabase = async () => {
    try {
        console.log('Syncing database...');

        // Create tables if they don't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS organization (
                organization_id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                description TEXT NOT NULL,
                contact_email VARCHAR(255) NOT NULL,
                logo_filename VARCHAR(255) NOT NULL
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS category (
                category_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS service_project (
                project_id SERIAL PRIMARY KEY,
                organization_id INT REFERENCES organization(organization_id),
                name VARCHAR(150) NOT NULL,
                description TEXT,
                location VARCHAR(150),
                project_date DATE
            );
        `);

        // Insert data ONLY if empty
        const orgCheck = await db.query('SELECT COUNT(*) FROM organization');
        if (parseInt(orgCheck.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO organization (name, description, contact_email, logo_filename)
                VALUES
                ('BrightFuture Builders', 'Community construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
                ('GreenHarvest Growers', 'Urban farming group.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
                ('UnityServe Volunteers', 'Volunteer group.', 'hello@unityserve.org', 'unityserve-logo.png');
            `);
            console.log('Inserted organizations');
        }

        const catCheck = await db.query('SELECT COUNT(*) FROM category');
        if (parseInt(catCheck.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO category (name) VALUES
                ('Environmental'),
                ('Educational'),
                ('Community Service'),
                ('Health and Wellness');
            `);
            console.log('Inserted categories');
        }

        console.log('Database synced successfully');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
};

//




// -------- ROUTES -------- //

// Home page
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});
// Organizations page
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading organizations');
    }
});

// Projects page

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading projects');
    }
});


// Categories page
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading categories');
    }
});

// -------- START SERVER -------- //
//
app.listen(PORT, async () => {
    try {
        await testConnection();
        await syncDatabase(); // 👈 THIS IS THE KEY

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});