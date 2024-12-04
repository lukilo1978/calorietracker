const express = require('express');
const router = express.Router();
const User = require('../models/CTusers');
const passport = require('passport');
var mongoose = require('mongoose');
/* GET users listing. */

router.get('/', async function(req, res, next) {
  try {
    // Fetch user from the database
    const user = await User.findById(req.user._id);

    if (user) {
      totalCalories = user.totalCalories || 0; // Use 0 if totalCalories is undefined
      totalCarbs = user.totalCarbs || 0;
      totalProteins = user.totalCarbs || 0;
      totalFats = user.totalCarbs || 0;
    }
    // Render the index view, passing user and totalCalories
    res.render('calories/index', { user: req.user, totalCalories,
       totalCarbs,
       totalProteins,
       totalFats });

  } catch (err) {
    console.error("Error fetching user data:", err);

    // Handle the error by rendering the index page with default values
    res.render('calories/index', { user: req.user, totalCalories: 0,
       totalCarbs: 0, 
       totalProteins: 0,
       totalFats: 0 })
  }
});

module.exports = router;