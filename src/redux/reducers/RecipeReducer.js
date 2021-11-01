const initialState = {
    recipe: null,
    recipes:[],
    oneRecipe: null,
    comment: null,
    modalBody:"",
    modalTitle: "",
    showModale: false,
    redirect: false,
    // modalImage: null
}

export const recipeReducer = (state = initialState, action) =>{
    switch(action.type){
        case "CREATE-RECIPE":
            return {
                ...state,
                recipe: action.recipe,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
                redirect: action.redirect
            };
        case "CREATE-RECIPE-FAILED":
            return{
                ...state,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
                redirect: action.redirect
            }; 
        case "UPDATE-RECIPE-SUCCESS":
            return{
                ...state,
                recipe: action.recipe,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
            };
        case "UPDATE-RECIPE-FAILLURE":
            return{
                ...state,
                recipe: action.recipe,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
            };  
        case "DELETE-RECIPES-SUCCESS":
            return{
                ...state,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
            };
        case "DELETE-RECIPE-FAILURE":
            return{
                ...state,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
            };           
        case "POST-COMMENT-SUCCES":
            return{
                ...state,
                comment: action.comment,
                showModale: action.showModale,
                modalBody: action.modalBody
            };    
        case "GET-RECIPES":
            return{
                ...state,
                recipes: action.recipes,
            } 
        case "GET-ONE-RECIPE":
            // console.log(action.payload)
            return{
                ...state,
                recipe: action.payload
            };     

        default:
            return state;
    }
} 