import axios from 'axios';

const apiKey = process.env.REACT_APP_API_KEY;
export const searchIngredientByName = (query = "", limit = 2) => {
    // return axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&metaInformation=true&number=${limit}&apiKey=${apiKey}`);
    return async()=>{
        // dispatch({type: "GET-INGREDIENT-AUTOCOMPLETE"})
        try {
            
            // console.log(apiKey);
            const response = await axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${query}&metaInformation=true&number=${limit}&apiKey=${apiKey}`);
              console.log(response && response.data[0].name);
              return response;
        } catch (error) {
            console.log(error)
        }
    }
  }

  export const getIngredientNutriFacts = (id) =>{
      return async() => {
          try {
            const response = await axios.get(`https://api.spoonacular.com/food/ingredients/${id}/information?amount=100&unit="g"&apiKey=${apiKey}`);
            // console.log(response && response.data);
            return response;
          } catch (error) {
            console.log(error)
          }
      }
  }