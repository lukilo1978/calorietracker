const express = require('express');
const axios = require('axios');
const config = require('../configs/globalconfig');
const { Query } = require('mongoose');
const router = express.Router();


// Fetch calories and nutritional information
// router.post('/', (req, res) => {
//     // Retrieve the input value from the form
  
//     // Process the input value (e.g., store it, use it in another API request, etc.)
//     console.log('Received input:', inputValueID);
  
//     // Redirect or render another view with the data
//     res.send(`You submitted: ${inputValueID}`);
//   });



router.post('/', async (req, res) => {
    const query = req.body.inputValue;
    const apiUrl = config.API.Urls.IngredientsSearch;
    const apiKey = config.API.Key;
    const apiNutritional = config.API.Urls.NutritionalInfo;
    const amount = req.body.amount;
    const unit = 'g';

  
    try {
      // Step 1: Fetch food IDs based on search query
      const idResponse = await axios.get(apiUrl, {
        params: {
          query, // Adjust parameter as per API documentation
          apiKey, // API key as query parameter
        },
      });


      const results = idResponse.data.results || [];
      const foodIds = results.map((results) => results.id);
      console.log(foodIds);
  
      // Step 2: Fetch nutritional info for each ID
      const nutritionPromises = foodIds.map((id) =>
        axios
          .get(`${apiNutritional.replace('{id}', id)}`, {
            params: 
            { apiKey,
              amount,
              unit
            },
            
          })
          .catch((error) => {
            console.error(`Failed to fetch nutrition data for ID ${id}:`, error.message);
            return null;
          })
      );

  
      const nutritionResponses = await Promise.all(nutritionPromises);
      const nutritionData = nutritionResponses
      .filter(response => response !== null) // Filter out failed requests
      .map(response => {
      const data = response.data;
    // Extracting nutrients information
    const nutrients = data.nutrition.nutrients;
    const relevantNutrients = {
      calories: nutrients.find(n => n.name === "Calories")?.amount || 0,
      protein: nutrients.find(n => n.name === "Protein")?.amount || 0,
      carbs: nutrients.find(n => n.name === "Carbohydrates")?.amount || 0,
      fats: nutrients.find(n => n.name === "Fat")?.amount || 0,
    };
     const imageurl = 'https://img.spoonacular.com/ingredients_100x100/'

    return {
      id: data.id,
      name: data.name,
      image: `${imageurl}${data.image}`,
      nutrients: relevantNutrients,
    };
  });

    console.log(nutritionData);

      
      // Step 3: Render the results in an HBS view
      res.render('API', { nutritionData, amount, query, user: req.user });
    } catch (error) {
      console.error('Error fetching food data:', error.message);
      res.status(500).send('Failed to fetch food data');
    }
  });
  
  module.exports = router;