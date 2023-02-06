require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// Remove o warning do console para uma function deprecated
mongoose.set('strictQuery', true); 
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto');
    })
    .catch(e => console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Inicia o Helmet
app.use(helmet());

// Trata o Body das requisições
app.use(express.urlencoded({ extended: true }));

// Faz o parse dos JSON
app.use(express.json());

// Define o caminho para itens estáticos
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'ALKSALKSLJIOEJFOJNCWMLKEÇLQEPDPELMCNBVJ',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// Define o caminho das Views
app.set('views', path.resolve(__dirname, 'src', 'views'));
// Engine utilizado para a View
app.set('view engine', 'ejs');

// Inicia o CSurf
app.use(csrf());

// Inicia os Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Disponibiliza as rotas
app.use(routes);

// Abre a porta do Listener
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('-------------------------------------------------');
        console.log('*   Para acessar: http://localhost:3000         *');
        console.log('*   Servidor executando na porta: 3000          *');
        console.log('-------------------------------------------------');
    });
});