const express = require('express');
const router = express.Router();
const Meal = require('../models/meals');
const User = require('../models/CTusers');
const passport = require('passport');
var mongoose = require('mongoose');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('meals/',{user: req.user })
// });

router.get('/', async (req, res) => {
  try {
    // Fetch all meals from the database
    const meals = await Meal.find({}).lean();
    console.log(meals)

    const user = await User.findById(req.user._id);
    const totalCalories = user.totalCalories;
    const totalCarbs = user.totalCarbs;
    const totalProteins = user.totalProteins;
    const totalFats = user.totalFats;

    // Render the meals/index view, passing the meals data
    res.render('meals/index', {meals, totalCalories, totalCarbs, totalProteins, totalFats, user: req.user});
  } catch (err) {
    console.error('Error fetching meals:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/add', function(req, res, next) {
  res.render('meals/add',{user: req.user })
});

router.post('/add', async (req, res) => {
  try {
    const { mealType, mealName, mealDescription, calories, carbohydrates, proteins, fats } = req.body;

    // Create a new meal document
    const meal = new Meal({
      mealType,
      mealName,
      mealDescription,
      calories,
      carbohydrates,
      proteins,
      fats,
    });
    // Save to the database
    await meal.save();

    const user = await User.findById(req.user._id);
    
    user.totalCalories += calories;
    user.totalCarbs += carbohydrates;
    user.totalProteins += proteins;
    user.totalFats += fats;
    await user.save();


    res.redirect('/meals'); // Redirect to the meals page or any other route
  } catch (err) {
    console.error('Error adding meal:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).send('Meal not found');
    }

    res.render('meals/edit', {meal, user: req.user });
  } catch (err) {
    console.error('Error fetching meal for editing:', err);
    res.status(500).send('Internal Server Error');
  }
});
//////////////////////////////////////
router.post('/edit/:id', async (req, res) => {
  try {
    const { mealType, mealName, mealDescription, calories, carbohydrates, proteins, fats } = req.body;

    const meal = await Meal.findById(req.params.id);
    const user = await User.findById(req.user._id);

    user.totalCalories -= meal.calories;
    user.totalCarbs -= meal.carbohydrates;
    user.totalProteins -= meal.proteins;
    user.totalFats -= meal.fats;

    // Update meal
    meal.mealType = mealType;
    meal.mealName = mealName;
    meal.mealDescription = mealDescription;
    meal.calories = calories;
    meal.carbohydrates = carbohydrates;
    meal.proteins = proteins;
    meal.fats = fats;
    await meal.save();

    // Add new values
    user.totalCalories += calories;
    user.totalCarbs += carbohydrates;
    user.totalProteins += proteins;
    user.totalFats += fats;
    await user.save();

    
    res.redirect('/meals');
  } catch (err) {
    console.error('Error updating meal:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    const user = await User.findById(req.user._id);

    // Subtract values from user totals
    user.totalCalories -= meal.calories;
    user.totalCarbs -= meal.carbohydrates;
    user.totalProteins -= meal.proteins;
    user.totalFats -= meal.fats;
    await user.save();

    // Delete meal
    await Meal.findByIdAndDelete(req.params.id);
    res.redirect('/meals'); // Redirect to the meals list page after deletion
  } catch (err) {
    console.error('Error deleting meal:', err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;