import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';
import { testConnection } from './src/models/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Projects route
app.get('/projects', (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});


// Organizations route
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations(); // get data from DB
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations }); // pass organizations to EJS
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading organizations');
    }
});

// Categories route
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

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});