const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {type: String,required: true ,unique: true,},
  totalCalories: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalProteins: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 },
  googleId: String,
});

// Add the passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose,{ usernameField: 'email' });

module.exports = mongoose.model("User", userSchema);
