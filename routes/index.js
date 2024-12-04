const config = require('../configs/globalconfig');
const express = require('express');
const router = express.Router();
const User = require('../models/CTusers');

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    // Fetch user from the database
    const user = await User.findById(req.user._id);

    if (user) {
      totalCalories = user.totalCalories || 0; // Use 0 if totalCalories is undefined
    }

    // Render the index view, passing user and totalCalories
    res.render('index', { user: req.user, totalCalories });
  } catch (err) {
    console.error("Error fetching user data:", err);

    // Handle the error by rendering the index page with default values
    res.render('index', { user: req.user, totalCalories: 0 });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


module.exports = router;
