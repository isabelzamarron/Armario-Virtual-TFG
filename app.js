"use strict"


//importacion modulos

const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const MySQLStore = require('express-mysql-session')(session);
const userRouter = require("./routes/usuarios");
const authRouter = require("./routes/autenticacion");
const prendasRouter = require("./routes/prendas");
const outfitsRouter= require ("./routes/outfits");
const comunidadRouter=require("./routes/comunidad");

const app = express();

const fileUpload = require('express-fileupload');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


app.use(upload.single('foto'));

const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistema_inteligente",
  port: 3306
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
}));
app.use(fileUpload());

app.use('/user',requireLogin,userRouter);
app.use('/auth', authRouter);
app.use('/prendas',prendasRouter);
app.use('/outfits',outfitsRouter);
app.use('/comunidad',comunidadRouter);

//Pagina principal
app.get('/', (req, res) => {
  res.redirect('menuPrincipal.ejs');
});
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user_id) {
    return res.redirect('/auth');
  }
  next();
};


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/auth`);
});

module.exports = app;