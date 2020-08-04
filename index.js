const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session');

//Load config
// dotenv.config({path:'./config/config.env'});

//passport
require('./config/passport')(passport);

const connectDB = require('./models/db')
connectDB()

const app = express();

//for consoling
app.use(morgan('dev'))


//Handlebars
app.engine('.hbs',exphbs({extname:'hbs'}));
app.set('view engine','.hbs')

//session middleware
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'));

const PORT = process.env.PORT || 5000; 

app.listen(PORT,()=>console.log(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`))