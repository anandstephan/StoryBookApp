const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
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

//Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//for consoling
app.use(morgan('dev'))

//Handlebars Helpers
const {formatDate,stripTags,truncate,editIcon} = require('./helpers/hbs')

//Handlebars
app.engine('.hbs',exphbs({helpers:{formatDate,stripTags,truncate,editIcon},defaultLayout:'main',extname:'hbs'}));
app.set('view engine','.hbs')

//Method Override middleware
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      console.log(req.body);
      delete req.body._method
      console.log("after");
      console.log(req.body)
      console.log(method)
      return method
    }
  }))

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

// Set global vars
app.use((req,res,next) =>{
    res.locals.user = req.user || null;
    next()
})


// Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));


const PORT = process.env.PORT || 5000; 

app.listen(PORT,()=>console.log(`Server  running in ${process.env.NODE_ENV} mode on port ${PORT}`))