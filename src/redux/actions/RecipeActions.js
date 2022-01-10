import axios from "axios";

export const createRecipe = (formData, config)=>{
    return async(dispatch)=>{
        try {
            // const response = await axios.post('https://mern-recipes.herokuapp.com/recipes/add-recipe', 
            const response = await axios.post('http://localhost:8080/recipes/add-recipe', // PENSER A REMETTRE L'URL PRODUCTION "HEROKU",  DECOMMENTER.
            formData, config);
            // console.log(response);
            dispatch({
                type: "CREATE-RECIPE",
                recipe: response.data,
                showModale:true,
                modalBody: response.data.message,
                modalTitle: "Success modal recipe",
                redirect: setTimeout(()=>true, 4000) 
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: "CREATE-RECIPE-FAILED",
                showModale:true,
                modalBody: ["something went wrong: ", [error.response.data.message]],
                modalTitle: "Failur modal recipe",
                redirect: false           
            })
            
        }

    }
}

export const getAllRecipes = ()=>{
    return async(dispatch)=>{
        dispatch({type: "GET-RECIPES-REQUEST"})
        try {
            const response = await axios.get('https://mern-recipes.herokuapp.com/recipes');
            // console.log(response);
            dispatch({
                type: "GET-RECIPES",
                recipes: response.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type: "GET-RECIPES-FAILED",
                recipes: []
            })    
        }
    }
}

export const getOneRecipe =(recipeId)=>{
    // console.log(recipeId);
    return async(dispatch)=>{
        try {
            const response = await axios.get(`https://mern-recipes.herokuapp.com/recipes/${recipeId}`);
            // console.log(response.data);
            dispatch({
                type: "GET-ONE-RECIPE",
                payload: response.data
            })
            // let thisRecipe = response.data
            localStorage.setItem("thisRecipe", JSON.stringify(response.data));
        } catch (error) {
            console.log(error);
        }
    }
    
}
export const updateRecipe=(recipeId, formData,config)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.put(`https://mern-recipes.herokuapp.com/recipes/update/${recipeId}`,formData, config);
            // console.log(response);
            dispatch({
                type: "UPDATE-RECIPE-SUCCESS",
                recipe: response.data,
                showModale:true,
                modalBody: response.data.message,
                modalTitle: "Success modal recipe", 
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type: "UPDATE-RECIPE-FAILLURE",
                showModale:true,
                modalBody: ["something went wrong: ", [error.response.data.message]],
                modalTitle: "Failur modal recipe",
            })
        }
    }
}

export const postComment =(recipeId, userId, commentContent, config)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.post(`https://mern-recipes.herokuapp.com/comments/add/${recipeId}/${userId}`, {commentContent}, config);
            // console.log(response);
            dispatch({
                type:"POST-COMMENT-SUCCES",
                comment: response.data,
                showModale: true,
                modalBody: response.data.message,
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const deleteRecipe = (recipeId, dataToDelete, token)=>{
    // console.log(dataToDelete);
    return async(dispatch)=>{
        // console.log(formData);
        try {
            const response = await axios.delete(`https://mern-recipes.herokuapp.com/recipes/delete/${recipeId}`, { headers: {
                Accept:'*/*',
                'Content-Type': '*',
                'Authorisation': `Bearer ${token}`,
                "x-auth-token":`${token}`
                },
                params: {dataToDelete: dataToDelete}
            }
            );
            // console.log(response);   
            dispatch({
                type: "DELETE-RECIPES-SUCCESS",
                showModale:true,
                modalBody: response.data.message,
                modalTitle: "Success delete recipe",
            })
            
        } catch (error) {
            console.log(error.response);
            dispatch({
                type: "DELETE-RECIPE-FAILURE",
                showModale:true,
                modalBody: ["something went wrong: ", [error.response.data.message]],
                modalTitle: "Failur delete recipe",
            })
        }
    }
}