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
app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Service Projects' });
});

// Categories page
app.get('/categories', (req, res) => {
    const title = 'Service Project Categories';
    res.render('categories', { title });
});

// Example category links (optional, adjust as needed)
app.get('/categories/:name', (req, res) => {
    const categoryName = req.params.name;
    res.send(`You clicked category: ${categoryName}`);
});

// -------- START SERVER -------- //
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});