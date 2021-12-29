import React, {useState, useEffect} from "react";
// import { connect } from 'react-redux';
import {useSelector, useDispatch} from "react-redux";
import {searchIngredientByName, getIngredientNutriFacts} from "../../redux/actions/IngredientsActions";

const AutoCompleteIngredient = (props) =>{

    // const [ingredientName,setIngredientName] = useState(props.ingredientName);
    // const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [display, setDisplay] = useState(false);
    
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
          //setQuery(e.target.value);
          props.onChange(e);
          searchAutoComplete(e.target.value);
      }
    
     // Executer la fonction (redux) pour receperer le nom de l'ingred via l'api
      const searchAutoComplete = (ingredientName) =>{
          if(ingredientName.length > 2){
             dispatch(searchIngredientByName(ingredientName)).then(res=>{
                setResults(res.data);
                // console.log(res && res.data);
                console.log(results);
                //  setResults(res.data).then(setDisplay(true))
             }).then(()=>setDisplay(true));
            //   console.log(test);
          }else{
              setDisplay(false);
              setResults([]);
          }
      }

      const getIngredientFacts = (id) =>{
          dispatch(getIngredientNutriFacts(id)).then(res =>{
              console.log(res.data.nutrition.nutrients)
          })
      }

      const onSuggestHandler = (e) =>{
          props.selectIngerdientName(e);
          getIngredientFacts(e.target.id);
          setResults([]);
      }

      const enter=()=>{
          setDisplay(true);
      }

      const leave=()=>{
        setDisplay(false);
    }

      return(
          <div className="col-8">
              <input type="text" id={props.id} name={props.name} placeholder={props.placeholder} value={props.ingredientName} onChange={handleChange}/>
              {display && results.length > 0 ? (
                  <div>
                      <ol>
                          {results.map((ingr, index)=>(
                              <li key={index} onMouseEnter={enter} onMouseLeave={leave} onClick={onSuggestHandler} id={ingr.id} >
                                  {ingr.name}
                                  {/* <img src={`https://spoonacular.com/cdn/ingredients_100x100/${ingr.image}`} 
                                    alt="" /> */}
                              </li>
                          ))}
                      </ol>
                  </div>
              ):(
                  null
              )
              }

          
            {/* <h4>test auto complete</h4> */}

          </div>
      )
}

// export default connect()(AutoCompleteIngredient);
export default AutoCompleteIngredient;