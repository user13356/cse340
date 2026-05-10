<<<<<<< HEAD
import { getAllOrganizations } from './src/models/organizations.js';
import { testConnection } from './src/models/db.js';
=======

>>>>>>> 620fdde493914149ea6564db2226432bd0846b8e
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './src/controllers/routes.js';

const app = express();

// =====================
// BODY PARSING 
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =====================
// SESSION (ONLY ONCE)
// =====================
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// 

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// =====================
// FLASH (ONLY ONCE)
// =====================
app.use(flash());

// =====================
// VIEWS
// =====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// =====================
// STATIC FILES
// =====================
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// GLOBAL VARS
// =====================
app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    next();
});

<<<<<<< HEAD
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
=======
// =====================
// ROUTES
// =====================
app.use('/', router);

// =====================
// HOME
// =====================
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
>>>>>>> 620fdde493914149ea6564db2226432bd0846b8e
});

// =====================
// 404
// =====================
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

<<<<<<< HEAD
app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });

});

//
app.get('/', (req, res) => {
    res.render('index');
});
//

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
=======
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
>>>>>>> 620fdde493914149ea6564db2226432bd0846b8e
});