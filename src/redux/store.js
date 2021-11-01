import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {rootReducer} from "./reducers/RootReducer";

// Le store

export const store = createStore(rootReducer, applyMiddleware(thunk));