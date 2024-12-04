const express = require('express');
const router = express.Router();
const User = require('../models/CTusers');
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");

//GET LOGIN
router.get("/login", (req, res, next) => {
  const messages = req.flash('error')|| [];
  res.render('users/login', {messages: messages});
})
//POST LOGIN
router.post('/login', (req, res, next) => {
  console.log('Login attempt:', req.body);
  next();
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}));


// GET /register
router.get("/register", (req, res, next) => {
  res.render("users/register");
});

//POST /register
router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Register the user using the `email` field
    const user = await User.register(new User({ email }), password);

    // Log the user in after successful registration
    req.login(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return next(err);
      }
      console.log('User registered and logged in successfully');
      res.redirect('/'); // Redirect to the desired page (e.g., meals page)
    });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.redirect('/register'); // Redirect back to register if an error occurs
  }
});


// GET /logout on index routes

// Google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/meals",
    failureRedirect: "/",
  })
);

module.exports = router;
