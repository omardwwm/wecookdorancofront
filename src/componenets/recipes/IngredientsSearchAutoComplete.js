import React, {useState, useEffect} from "react";
import {FormGroup, Label, Input, Button} from "reactstrap";
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
// import { connect } from 'react-redux';
import {useDispatch} from "react-redux";
import {searchIngredientByName, getIngredientNutriFacts} from "../../redux/actions/IngredientsActions";
// import {nutriFctsTest} from "./NutriFactsTest"

const AutoCompleteIngredient = (props) =>{
    
    const dispatch = useDispatch();
    // const [ingredientName,setIngredientName] = useState(props.ingredientName);
    // const [query, setQuery] = useState("");
    const [suggestions, setsuggestions] = useState([]);
    const[selectedIngredient, setSelectedIngredient] = useState([]);
    const [selectedIngId, setSelectedIngId] = useState("");
    const [display, setDisplay] = useState(false);

    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
    // added 1/11/2021 (unity)
    const [ingredientUnity, setIngredientUnity] = useState("");
    const [ingredientsError, setIngredientsError] = useState("");
    const[recipeIngrediants, setRecipeIngrediants] = useState([]);
    
    // Constantes Pour ajoter les nitriFacts
    // const[ingredientCaloriesForCentGrams, setIngredientCaloriesForCentGrams] = useState("");
    // const[ingredientCarbohydForCentGrams, setIngredientCarbohydForCentGrams] = useState(0);
    // const[ingredientProteinForCentGrams, setIngredientProteinForCentGrams] = useState(0);
    // const[ingredientFatForCentGrams, setIngredientFatForCentGrams] = useState(0);


const onChangeIngredientQauntity = (event)=>{
    setQauntity(event.target.value)
}

const onChangeIngredientUnity = (event)=>{
    setIngredientUnity(event.target.value)
}

const handleChange=(e)=>{
    //   props.onChangeIngredientName(e);
    setIngredientName(e.target.value)
    searchAutoComplete(e.target.value);
  }

const fetchIngredientFactsInformations = (id) =>{
    dispatch(getIngredientNutriFacts(id))
    .then((res)=>{
        setSelectedIngredient(res && res.data);
        // ReactDOM.unstable_batchedUpdates(()=>{
        //     setSelectedIngredient(res && res.data);
        // });
        // console.log(res && res.data);
      //   getNutriFactsByIngredients(res && res.data);
      });
      console.log(selectedIngredient);              
  }

// const getNutriFactsByIngredients = (selectedIngredient)=>{
    // let coef =quantity/100;
    // console.log(coef)
    // console.log(selectedIngredient);
    // if (selectedIngredient && selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients) {
    //     console.log(selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients);
    //     const nutrientArray = selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients;
        // const sugarPerCentGrams = nutrientArray.filter((ing) => ing.name === "Sugar")[0].amount;
        // const caloriesPerCentGrams = nutrientArray.filter((ing) => ing.name === "Calories")[0].amount* (coef? coef : 1);
        // console.log(caloriesPerCentGrams);
        // setIngredientCaloriesForCentGrams(caloriesPerCentGrams);
        // console.log(ingredientCaloriesForCentGrams);
        // const proteinPerCentGrams = nutrientArray.filter((ing) => ing.name === "Protein")[0].amount* (coef? coef : 1);
        // setIngredientProteinForCentGrams(proteinPerCentGrams);
        // const fatPerCentGrams = nutrientArray.filter((ing) => ing.name === "Fat")[0].amount* (coef? coef : 1);
        // setIngredientFatForCentGrams(fatPerCentGrams);
        // const carbohydPerCentGrams = nutrientArray.filter((ing) => ing.name === "Carbohydrates")[0].amount* (coef? coef : 1);
        // setIngredientCarbohydForCentGrams(carbohydPerCentGrams);
        // const fiberPerCentGrams = nutrientArray.filter((ing) => ing.name === "Protein")[0].amount;
        // console.log({caloriesPerCentGrams, proteinPerCentGrams, fatPerCentGrams, carbohydPerCentGrams });
        // const oneIngredientNutriFacts ={
        //     ingredientCalories:caloriesPerCentGrams,
        //     ingredientProtein:proteinPerCentGrams,
        //     ingredientFat:fatPerCentGrams,
        //     ingredientCarboHyd:carbohydPerCentGrams
        // }
        // console.log(oneIngredientNutriFacts);
        // const recipeNutriFactTemp = {
        //     recipeCalories:recipeNutriFacts.recipeCalories + caloriesPerCentGrams,
        //     recipeProtein:recipeNutriFacts.recipeProtein + proteinPerCentGrams,
        //     recipeFat:recipeNutriFacts.recipeFat + fatPerCentGrams,
        //     recipeCarboHyd:recipeNutriFacts.recipeCarboHyd + carbohydPerCentGrams
        // };
        // setRecipeNutriFacts(recipeNutriFactTemp);
        // console.log(recipeNutriFacts);            
        // return {caloriesPerCentGrams, carbohydPerCentGrams, proteinPerCentGrams, fatPerCentGrams}
//     }
// }

  const addIngredient =(event)=>{
    event.preventDefault();
    let coef =quantity/100;
    // Gerer le coef si unity est en cl ou ml
    console.log(coef);
    if(ingredientName==="" || quantity ==="" || ingredientUnity ===""){
        setIngredientsError("Vous devez enter un nom, une quantité et une unité pour chaque l'ingredient avant de cliquer sur ajouter")
        return;
    }else if(recipeIngrediants.some(ingredient=> ingredient.ingredientName ===ingredientName)){
        setIngredientsError("Vous avez deja ajoute un ingredient avec ce nom!!");
        return;
    }else{

        console.log(selectedIngredient)
        // fetchIngredientFactsInformations(selectedIngId);
        // getNutriFactsByIngredients(selectedIngredient);
        console.log(selectedIngredient);

        const nutrientArray = selectedIngredient && selectedIngredient.nutrition && selectedIngredient.nutrition.nutrients;
        // const sugarPerCentGrams = nutrientArray.filter((ing) => ing.name === "Sugar")[0].amount;
        const caloriesPerCentGrams = nutrientArray.filter((ing) => ing.name === "Calories")[0].amount* (coef? coef : 1);
        console.log(caloriesPerCentGrams);
        // setIngredientCaloriesForCentGrams(caloriesPerCentGrams);
        // console.log(ingredientCaloriesForCentGrams);
        const proteinPerCentGrams = nutrientArray.filter((ing) => ing.name === "Protein")[0].amount* (coef? coef : 1);
        // setIngredientProteinForCentGrams(proteinPerCentGrams);
        const fatPerCentGrams = nutrientArray.filter((ing) => ing.name === "Fat")[0].amount* (coef? coef : 1);
        // setIngredientFatForCentGrams(fatPerCentGrams);
        const carbohydPerCentGrams = nutrientArray.filter((ing) => ing.name === "Carbohydrates")[0].amount* (coef? coef : 1);
        // setIngredientCarbohydForCentGrams(carbohydPerCentGrams);

        const newIngredient = {
        ingredientName:ingredientName,
        quantity: quantity,
        ingredientUnity: ingredientUnity,
        ingredientCaloriesForCentGrams:caloriesPerCentGrams,
        ingredientCarbohydForCentGrams:carbohydPerCentGrams,
        ingredientProteinForCentGrams:proteinPerCentGrams,
        ingredientFatForCentGrams:fatPerCentGrams,
        ingredientCoef:coef
        }
        // console.log(newIngredient);
    const newIngredients = [...recipeIngrediants, newIngredient];
    setRecipeIngrediants(newIngredients);
    // updateIngrediantsList(recipeIngrediants);
    // https://stackoverflow.com/questions/55028583/how-do-i-call-setstate-from-another-component-in-reactjs
    props.onAddIngrediants(newIngredients);
    props.calculRecipeNutrifactsFor100Grams(recipeIngrediants);
    setIngredientName("");
    setQauntity("");
    //added 1/11/2021
    setIngredientUnity("");
    setIngredientsError("");
    }      
}

console.log(selectedIngredient);
console.log(selectedIngId);

const removeIngredient =(index)=>{
    let filtredArray = [...recipeIngrediants];
    // console.log(index)
    if(index > -1){
        filtredArray.splice(index, 1)
    }
    setRecipeIngrediants(filtredArray);
    props.onAddIngrediants(filtredArray);
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

    // if (ingredientQauntity) {
    //     console.log(ingredientQauntity)
    // }
    
// TODO
    useEffect(() => {
        if (selectedIngId) {
            fetchIngredientFactsInformations(selectedIngId);
        }
        // getNutriFactsByIngredients(selectedIngredient)
    }, [selectedIngId])
    

    // const addIngredientAndItsNutriFacts = (e)=>{
    //     // props.addIngredient(e);
    //     // addIngredient(e);
    //     // fetchIngredientFactsInformations(selectedIngId);
    // }
    
    const onSuggestHandler = (e) =>{
        // props.selectIngerdientName(e);
        setIngredientName(e.target.innerText);
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
              <FormGroup className="col-md-4 col-sm-5 col-xs-9 d-inline-block mt-2">
                <Label for="ingredientName">Nom de l'ingrédient</Label>
                <Input type="text" id="ingredientName" name="ingredientName" placeholder="nom de l'ingredient" value={ingredientName} onChange={(e)=>handleChange(e)}/>
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
                        {(ingredientName && ingredientName.length > 2) && (suggestions && suggestions.length ===0) ? (
                            <p>No matches...</p> 
                        ):null}
                    </div>
                    )
                }
              </FormGroup>
              <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                <Label for="quantity">Quantité de l'ingrédient</Label>
                <Input type="number" name="quantity" value={quantity} id="quantity" placeholder="Quantité (En chiffre)" onChange={onChangeIngredientQauntity} />
              </FormGroup>
              <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                    <Label for="ingredientUnity">Choisir une unite</Label>
                    <Input type={"select"} value={ingredientUnity} onChange={onChangeIngredientUnity}>
                        <option value=""></option>
                        <option value="gramme">Gramme</option>
                        <option value="cl">Cl</option>
                        <option value="ml">Ml</option>
                    </Input>
              </FormGroup>
              <Button className="mb-4" onClick={(e)=>addIngredient(e)}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter l'ingrédient</Button>
              {ingredientsError?(
                    <div style={{color:'red'}}>
                        <p>{ingredientsError}</p>
                    </div>
                )
                :null}

                {recipeIngrediants.length >0 ?
                    (<div className="listIng p-0 m-auto col-sm-12 col-lg-9">
                        <h5>Aperçu des ingrédients</h5>
                        <ol>
                            {recipeIngrediants.map((ing, index)=>(
                                <div className="p-0 m-0" key={index}>
                                    <li className="d-inline-block" >
                                        {ing.ingredientName}{" :  "}{ing.quantity}{" "}{ing.ingredientUnity}
                                        <Button className="btnRemoveIngr" onClick={()=> removeIngredient(index)}><RiDeleteBin6Fill /></Button>
                                    </li>
                                   
                                </div>                       
                            ))}
                        </ol>
                    </div>) : null
                }

          </div>
    )
}

// export default connect()(AutoCompleteIngredient);
export default AutoCompleteIngredient;