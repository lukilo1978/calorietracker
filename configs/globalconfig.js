const configurations = {
  DatabaseStrings: {
    MongoDB: "mongodb+srv://lukilo1978:tomy2005@cluster0.xtqjp.mongodb.net/CalorieTracker?retryWrites=true&w=majority&appName=Cluster0",
  }, 
  Authentication: {
    google: {
      ClientId: "741902635681-b6e17nq5cursjq9ultr1s1vgbebrj9lk.apps.googleusercontent.com",
      ClientSecret: "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",
    },
  },
  Server: {
    Port: 3000,
  },
  API: {
    Key: "54819a5d91204d96b9b21e2a5e52a0ec",
    Urls: {
      IngredientsSearch: "https://api.spoonacular.com/food/ingredients/search",
      NutritionalInfo: "https://api.spoonacular.com/food/ingredients/{id}/information",
    },
  },
};

module.exports = configurations;
