const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ['meal', 'snack', 'drink'], // Predefined meal types
    required: true,
  },
  mealName: {
    type: String,
    required: true,
  },
  mealDescription: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative'], // Value in kcal
    required: true,
  },
  carbohydrates: {
    type: Number,
    min: [0, 'Carbohydrates cannot be negative'], // Value in grams
  },
  proteins: {
    type: Number,
    min: [0, 'Proteins cannot be negative'], // Value in grams
  },
  fats: {
    type: Number,
    min: [0, 'Fats cannot be negative'], // Value in grams
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

module.exports = mongoose.model('Meal', mealSchema);