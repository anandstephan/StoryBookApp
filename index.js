const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
//Load config
// dotenv.config({path:'./config/config.env'});

//passport
require('./config/passport')(passport);

const connectDB = require('./models/db')
connectDB()

const app = express();

//for consoling
app.use(morgan('dev'))

//Handlebars Helpers
const {formatDate} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs',exphbs({extname:'hbs'}));
app.set('view engine','.hbs')

//session middleware
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));


const PORT = process.env.PORT || 5000; 

app.listen(PORT,()=>console.log(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`))