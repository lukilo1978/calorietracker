const mongoose = require("mongoose");
const infoSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'], // in kilograms
    required: true,
  },
  heigth: {
    type: Number,
    min: [0, 'Height cannot be negative'], // in centimeters
    required: true,
  },
  activityLevel: {
    type: String,
    enum: [
      'sedentary',         // little or no physical activity
      'lightly active',    // light activity or casual exercise
      'moderately active', // moderate exercise 3–5 times a week
      'very active',       // intense exercise or physical labor
      'extremely active',  // very intense daily physical activity
    ],
    required: true,
  },
  goal: {
    type: String,
    enum: [
      'lose weight',       // reduce body weight
      'maintain weight',   // maintain current weight
      'increase weight',   // gain weight
    ],
    required: true,
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Info', infoSchema);