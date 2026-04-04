import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { getAllCategories } from './src/models/categories.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { testConnection } from './src/models/db.js';

// Define environment and port
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// Home page
app.get('/', (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// Organizations page
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error loading organizations:', error);
        res.status(500).send('Error loading organizations');
    }
});

// Projects page
app.get('/projects', (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

// Categories page
app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        if (!categories || categories.length === 0) {
            console.warn('No categories found in the database.');
        }

        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).send('Error loading categories');
    }
});

// Catch-all route for unknown pages
app.use((req, res) => {
    res.status(404).send('Page not found');
});

/**
 * Start server
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});