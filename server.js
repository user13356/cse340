
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

// =====================
// ROUTES
// =====================
app.use('/', router);

// =====================
// HOME
// =====================
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// =====================
// 404
// =====================
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});