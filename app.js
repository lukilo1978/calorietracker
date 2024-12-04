var createError = require('http-errors');
var express = require('express');
 var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var APIRouter = require('./routes/API')
var caloriesRouter = require('./routes/calories')
var mealsRouter = require('./routes/meals')
var mongoose = require('mongoose');
const session = require('express-session');
const Grant = require('grant').express;
var User = require('./models/CTusers');
var passport = require('passport');
const passportLocal = require('passport-local');
const { engine } = require('express-handlebars');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
const config = require('./configs/globalconfig');
const flash = require('connect-flash');
const handlebars = require('handlebars');
const hbs = require('hbs');



var app = express();


// view engine setup
try {
  app.engine('hbs', engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Enable access to prototype properties
      allowProtoMethodsByDefault: true,   // Optionally allow prototype methods
    },
    helpers: {
      eq: (a, b) => a === b,
    },
  }));
  app.set('view engine', 'hbs');
  // Register helpers for express-handlebars
  hbs.registerHelper('getProp', (obj, key) => obj[key]);
  console.log('Handlebars setup successful');
} catch (err) {
  console.error('Error setting up Handlebars:', err);
}


app.use(
  session({
    secret: 'c0l0rieTr0ck0r',
    resave: false,
    saveUninitialized: true,
  })
  
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, _res, next) => {
  if (!req.session.messages) {
    req.session.messages = [];
  }
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
 
passport.use(User.createStrategy({usernameField: 'email'}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use ('/API', APIRouter);
app.use ('/calories', caloriesRouter); 
app.use('/meals', mealsRouter);


// Serialize and deserialize users

//FUNCTIONALITY CODE STARTS HERE

// Connect to MongoDB
const mongoUri = config.DatabaseStrings.MongoDB;
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


//further routher functionality will be added here

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




//Grant setup
const grantconfig = {
  defaults: {
    origin: config.Server.Port || 'http://localhost:3000', // Fallback to localhost
    transport: 'session',
    state: true,
  },
  google: {
    key: config.Authentication.google.ClientId,      // From your .env file
    secret: config.Authentication.google.ClientSecret,
    scope: ['profile', 'email'],
    callback: '/auth/google/callback',
  },
};
app.use(Grant(grantconfig));


app.get('/connect/google/callback', async (req, res) => {
  const { session } = req;
  if (session.grant) {
    const { access_token, refresh_token, raw,} = session.grant.response;

    try{

      let existingUser = await User.findOne({ googleId: raw.id });

    if (!existingUser){
      existingUser = new User({
        googleId: raw.id,
        name: raw.name,
        email: raw.email,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      res.json({
        message: 'Google Authentication Successful!',
        user: { 
          googleId: raw.id, 
          email: raw.email 
        },
        tokens: { 
          access_token, 
          refresh_token 
        },
      });
    }
    else
    {
      existingUser.accessToken = access_token;
      existingUser.refreshToken = refresh_token;
    }
    await existingUser.save(); 
    req.session.userId = existingUser._id;

    }catch (error){
      console.error('Error saving user to the database:', error);
      res.status(500).json({ message: 'An error occurred while saving the user data.' });
    }

} else {
  res.status(400).json({ message: 'Authentication failed.' });
}
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = config.Server.Port || 3000;  
app.listen(port , () => {
  console.log(`Server is running on http://localhost:${port}`);
});



module.exports = app;
