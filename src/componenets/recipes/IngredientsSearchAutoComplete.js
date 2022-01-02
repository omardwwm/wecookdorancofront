import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {FormGroup, Label, Input, Button} from "reactstrap";
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
// import { connect } from 'react-redux';
import {useDispatch} from "react-redux";
import {searchIngredientByName, getIngredientNutriFacts} from "../../redux/actions/IngredientsActions";
// import {nutriFctsTest} from "./NutriFactsTest"

const AutoCompleteIngredient = (props) =>{

    // const [ingredientName,setIngredientName] = useState(props.ingredientName);
    // const [query, setQuery] = useState("");
    const [suggestions, setsuggestions] = useState([]);
    const[selectedIngredient, setSelectedIngredient] = useState([]);
    const [selectedIngId, setSelectedIngId] = useState("");
    const [display, setDisplay] = useState(false);
    // const[sugarPerCentGrams, setSugarPerCentGrams] = useState(0);
    // const [recipeNutriFacts, setRecipeNutriFacts] = useState({})
    const [recipeNutriFacts, setRecipeNutriFacts] = useState({
        recipeCalories:0,
        recipeProtein:0,
        recipeFat:0,
        recipeCarboHyd:0
  });
  const ingredientQauntity = props.quantity;
    
    const dispatch = useDispatch();
    
    // const debounce = (func, delay) => {
    //     let inDebounce
    //       return function() {
    //         const context = this
    //         const args = arguments
    //         clearTimeout(inDebounce)
    //         inDebounce = setTimeout(() => func.apply(context, args), delay)
    //       }
    //   }
    
      const handleChange=(e)=>{
          props.onChangeIngredientName(e);
          searchAutoComplete(e.target.value);
      }
    
     // Executer la fonction (redux) pour receperer le nom de l'ingred via l'api
      const searchAutoComplete = (ingredientName) =>{
          if(ingredientName.length > 2){
             dispatch(searchIngredientByName(ingredientName)).then(res=>{
                setsuggestions(res && res.data);
                // console.log(res && res.data);
                console.log(suggestions);
                //  setsuggestions(res.data).then(setDisplay(true))
             }).then(()=>setDisplay(true));
            //   console.log(test);
          }else{
              setDisplay(false);
              setsuggestions([]);
          }
      }

      const fetchIngredientFactsInformations = (id) =>{
          dispatch(getIngredientNutriFacts(id)).then((res)=>{
              ReactDOM.unstable_batchedUpdates(()=>{
                  setSelectedIngredient(res && res.data);
              });
              console.log(res.data);
              getNutriFactsByIngredients(res.data);
            //   console.log("INSIDE FETCH", selectedIngredient);
            })         
            // console.log(selectedIngredient);     
        }
    // console.log(selectedIngredient);

    if (ingredientQauntity) {
        console.log(ingredientQauntity)
    }
    const getNutriFactsByIngredients = (selectedIngredient)=>{
        let coef =ingredientQauntity/100;
        console.log(coef)
        if (selectedIngredient && selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients) {
            console.log(selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients);
            const nutrientArray = selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients;
            // const sugarPerCentGrams = nutrientArray.filter((ing) => ing.name === "Sugar")[0].amount;
            const caloriesPerCentGrams = nutrientArray.filter((ing) => ing.name === "Calories")[0].amount* (coef? coef : 1);
            const proteinPerCentGrams = nutrientArray.filter((ing) => ing.name === "Protein")[0].amount* (coef? coef : 1);
            const fatPerCentGrams = nutrientArray.filter((ing) => ing.name === "Fat")[0].amount* (coef? coef : 1);
            const carbohydPerCentGrams = nutrientArray.filter((ing) => ing.name === "Carbohydrates")[0].amount* (coef? coef : 1);
            // const fiberPerCentGrams = nutrientArray.filter((ing) => ing.name === "Protein")[0].amount;
            // console.log({caloriesPerCentGrams, proteinPerCentGrams, fatPerCentGrams, carbohydPerCentGrams });
            const oneIngredientNutriFacts ={
                ingredientCalories:caloriesPerCentGrams,
                ingredientProtein:proteinPerCentGrams,
                ingredientFat:fatPerCentGrams,
                ingredientCarboHyd:carbohydPerCentGrams
            }
            console.log(oneIngredientNutriFacts);
            const recipeNutriFactTemp = {
                recipeCalories:recipeNutriFacts.recipeCalories + caloriesPerCentGrams,
                recipeProtein:recipeNutriFacts.recipeProtein + proteinPerCentGrams,
                recipeFat:recipeNutriFacts.recipeFat + fatPerCentGrams,
                recipeCarboHyd:recipeNutriFacts.recipeCarboHyd + carbohydPerCentGrams
            };
            setRecipeNutriFacts(recipeNutriFactTemp);
            console.log(recipeNutriFacts);            
        }
    }
    
    console.log(recipeNutriFacts);

    const updateRecipeFacts =() =>{}
    
    const addIngredientAndItsNutriFacts = (e)=>{
        props.addIngredient(e);
        fetchIngredientFactsInformations(selectedIngId);
    }
    

    const onSuggestHandler = (e) =>{
        props.selectIngerdientName(e);
        // fetchIngredientFactsInformations(e.target.id);
        setSelectedIngId(e.target.id);
        setsuggestions([]);
    }

      const enter=()=>{
          setDisplay(true);
      }

      const leave=()=>{
        setDisplay(false);
    }

      return(
          <div>
              <FormGroup className="col-md-4 col-sm-5 col-xs-9 d-inline-block mt-4">
                <Label for="ingredientName">Nom de l'ingrédient</Label>
                <Input type="text" id="ingredientName" name="ingredientName" placeholder="nom de l'ingredient" value={props.ingredientName} onChange={(e)=>handleChange(e)}/>
                {display && suggestions && suggestions.length > 0 ? (
                    <div>
                        <ol>
                            {suggestions.map((ingr, index)=>(
                                <li key={index} onMouseEnter={enter} onMouseLeave={leave} onClick={(e)=>onSuggestHandler(e)} id={ingr.id} >
                                    {ingr.name}
                                    {/* <img src={`https://spoonacular.com/cdn/ingredients_100x100/${ingr.image}`} 
                                        alt="" /> */}
                                </li>
                            ))}
                        </ol>
                    </div>
                    ):(
                    <div>
                        {(props.ingredientName && props.ingredientName.length > 2) && (suggestions && suggestions.length ===0) ? (
                            <p>No matches...</p> 
                        ):null}
                    </div>
                    )
                }
              </FormGroup>
              <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                <Label for="quantity">Quantité de l'ingrédient</Label>
                <Input type="number" name="quantity" value={props.quantity} id="quantity" placeholder="Quantité (En chiffre)" onChange={props.onChangeIngredientQauntity} />
              </FormGroup>
              <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                    <Label for="ingredientUnity">Choisir une unite</Label>
                    <Input type={"select"} value={props.ingredientUnity} onChange={props.onChangeIngredientUnity}>
                        <option value=""></option>
                        <option value="gramme">Gramme</option>
                        <option value="cl">Cl</option>
                        <option value="ml">Ml</option>
                    </Input>
              </FormGroup>
              <Button className="mb-4" onClick={(e)=>addIngredientAndItsNutriFacts(e)}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter l'ingrédient</Button>

          </div>
    )
}

// export default connect()(AutoCompleteIngredient);
export default AutoCompleteIngredient;