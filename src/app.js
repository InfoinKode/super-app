require('dotenv').config();
const express = require('express');
const sequelize = require('./config/dbConfig')
const path = require('path');
const bodyParser = require("body-parser");
const session = require("express-session");
const useragent = require('express-useragent');
const { sessionStatus } = require('./services/whatsappService');
const flash = require('connect-flash');

const app = express();
app.use(useragent.express());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Menyajikan file statis (misalnya CSS, JS, gambar) dari folder public
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "apanyaclay", // Gantilah dengan secret key yang lebih aman
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 jam (dalam milidetik)
    },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Koneksi ke database
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

sessionStatus('im3')

app.use(require('./routes'));

module.exports = app;