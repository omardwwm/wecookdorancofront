import {combineReducers} from "redux";
import {userReducer} from "./UserReducer";
import {recipeReducer} from "./RecipeReducer";

export const rootReducer = combineReducers({
    userReducer, recipeReducer
});