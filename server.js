import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';

import path from 'path';
import { fileURLToPath } from 'url';

import router from './src/controllers/routes.js';

const app = express();

// body parsing 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session before flash
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// flash messages
app.use(flash());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

//

app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || 'development';
    next();
});

//




//

//

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


//

//  ONLY THIS ROUTER
app.use('/', router);

// home test
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});



// 404 fallback
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});