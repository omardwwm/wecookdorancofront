import React, {useState} from "react";
// import { connect } from 'react-redux';
import {useSelector, useDispatch} from "react-redux";
import {searchIngredientByName} from "../../redux/actions/IngredientsActions";

const AutoCompleteIngredient = () =>{

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [visible, setVisible] = useState(false);
    
    const dispatch = useDispatch();
    
    const debounce = (func, delay) => {
        let inDebounce
          return function() {
            const context = this
            const args = arguments
            clearTimeout(inDebounce)
            inDebounce = setTimeout(() => func.apply(context, args), delay)
          }
      }
    
      searchAutoComplete= debounce(searchAutoComplete, 100);
      const handleChange=(e)=>{
          setQuery(e.target.value);
          searchAutoComplete(e.target.value);
      }
    
      const searchAutoComplete = (query) =>{
          if(query !==""){
             dispatch(searchIngredientByName(query)).then(res=>{
                //  setResults([...results, ...res.data]);
                 console.log(res[0]);
                //  setResults(res.data).then(setVisible(true))
             });
            //   console.log(test);
          }else{
              setVisible(false);
          }
      }

      return(
          <div>
              <input type="text" value={query} onChange={handleChange}/>
          
            <h4>test auto complete</h4>

          </div>
      )
}

// export default connect()(AutoCompleteIngredient);
export default AutoCompleteIngredient;