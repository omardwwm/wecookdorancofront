import React, { useEffect, useState} from "react";
// import { useDispatch} from "react-redux";
// import {getAllRecipes} from "../../redux";
import {Link} from "react-router-dom";
import axios from "axios";
import { Form, Button} from 'reactstrap';
import {GiCook} from 'react-icons/gi';
import {AiOutlineLike} from 'react-icons/ai';
// import ClipLoader from "react-spinners/ClipLoader";
// import {SiCodechef} from 'react-icons/si';
import "./recipes.css";

const Recipes =(props)=>{
    // const dispatch = useDispatch();
    const [recipes, setRecipes] =useState([]);
    // const [recipes, setRecipes] = useState(useSelector(state=>state.recipeReducer.recipes));
    // const user = useSelector(state=>state.userReducer.user);
    const user = JSON.parse(localStorage.getItem('myUser'));
    const userId = user &&  user.id ? user.id : user && user._id;
    // console.log(user)
    // console.log('insideReact', recipes);
    // const firstUpdate = useRef(true);
    // const myCategories2 = [{category: "entree", icon:<GiMeal style={{color:'rgb(27, 214, 58)'}}/>}, {category: "plat", icon:<GiHotMeal style={{color:'rgb(224, 218, 38)'}}/>}, {category: "dessert", icon:<GiCakeSlice style={{color:'rgb(216, 62, 126)'}}/>}];
    const myCategories = [
        {"_id":1, "name": "entree", "affichage":"Entrées"}, {"_id":2, "name": "plat", "affichage":"Plats"}, {"_id":3, "name": "dessert", "affichage":"Desserts"}
    ]
    const [categories, setCategories] = useState([]);
    const [filtredCategories, setFiltredCategories] = useState([]);

    const newRecipes = [...recipes];
    const newCategories = [...categories];

    const onCheckCategory =(myCategory)=>{
        // console.log(filtredCategories);
     
        const currentIndex = categories.indexOf(myCategory);
        // console.log(currentIndex);
        // event.target.checked ? setCategories([...newCategories, event.target.name]) : 
        // setCategories([newCategories.filter(item => item !== event.target.value)])
        if(currentIndex === -1){
            // if(event.target.checked){
            // let addedCategory = event.target.value
            // setCategories([...newCategories, addedCategory])
            newCategories.push(myCategory);
            // console.log('categories are::', categories);
        }else{
            // setCategories([newCategories.filter(item => item !== event.target.value)]);
            newCategories.splice(currentIndex, 1)
            // console.log('categories are::', categories);
        }
        setCategories(newCategories);
        // console.log('categories are::', categories);
    };

    useEffect(()=>{
        let mounted = true;
        if(mounted){
            if(categories.length === 0){
                setFiltredCategories([...newRecipes])
            }else{
                setFiltredCategories(
                    newRecipes.filter(categorie =>
                        categories.some(category => [categorie.recipeCategory].flat().includes(category))
                        )
                )
            };
        }
        return () => mounted = false;
    }, [categories]) 

    // console.log('filtredCategories are:', filtredCategories);
    // console.log('categories are::', categories);
   
    const checkboxList =()=>
    myCategories.map((myCategory, index)=>(
            <div className="d-inline-block" key={index}>
                    <label >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;               
                        <input  
                            type="checkbox" 
                            value={myCategory.category} 
                            // checked={myCategory.isChecked} 
                            checked={categories.indexOf(myCategory.name) === -1 ? false : true}
                            onChange={()=>onCheckCategory(myCategory.name)}
                            name={myCategory.name}
                        />&nbsp;  
                        {/* {myCategory.icon} */}
                        {myCategory.affichage}
                    </label>
            </div>
        )) 
        // http://localhost:8080/recipes    // 
    const fetchRecipes =async()=>{
        // await axios.get('https://mern-recipes.herokuapp.com/recipes').then(response=>{
            await axios.get('http://localhost:8080/recipes').then(response=>{
            setRecipes([...recipes, ...response.data]);
            setFiltredCategories([...filtredCategories, ...response.data]) 
        })      
    } 
    // console.log(recipes);
    useEffect(()=>{
        // const { pathname } = window.location;
        fetchRecipes();
        setCategories(newCategories);
        checkboxList();
    }
    ,[]); 

    if(!recipes){
        return <p>Looding ...</p>
    }else if(recipes.length === 0){ 
        return <p>
                Pas de recettes pour le moment
                {/* <ClipLoader color='#fff' loading={true} size={48} /> */}
            </p>
    }else
    return (
        <div className="recipes">
            <h2>All our recipes/Toutes nos recettes</h2>
            <Form>
            {checkboxList()}
            </Form>
            <div>
                {recipes && filtredCategories.map((recipe, index) =>{ 
                    return (
                        <div key={index} className="d-inline-block m-3 wrap ">
                            <p>{recipe.recipeName}</p>
                            <img 
                                // src={`https://mern-recipes.herokuapp.com${recipe.recipePicture}`} 
                                src={recipe.recipePicture} 
                                style={{width:'300px', height:'200px', borderRadius:10}} alt="recipe illustration"
                            />
                            <div className="col-12">
                                 {
                                    // (recipe.recipeCreator && recipe.recipeCreator._id ===user && user.id) || (recipe.recipeCreator && recipe.recipeCreator._id ===user && user._id) ? 
                                    (recipe.recipeCreator && recipe.recipeCreator._id === userId) || (recipe.recipeCreator && recipe.recipeCreator._id === userId) ? 
                                    (<p className="pNameChef col-8">By: Me</p> )
                                    : <p className="pNameChef col-8">By: {recipe.recipeCreatorName}</p>
                                }
                                {recipe.likes && recipe.likes.length === 0? (
                                    <p className="pNameChef">
                                        0<AiOutlineLike style={{color:'grey', fontSize:'32px'}}/>
                                    </p>
                                    
                                ): recipe.likes.includes(userId)?
                                    (<p className="pNameChef">
                                    {recipe.likes.length}<AiOutlineLike style={{color:'#0ed4f7', fontSize:'32px'}}/>
                                    </p>):
                                    <p className="pNameChef">
                                    {recipe.likes.length}<AiOutlineLike style={{color:'#fff', fontSize:'32px'}}/>
                                    </p>
                                }
                                {recipe.recipeCreator && recipe.recipeCreator.isPro === true? (
                                    <span className="d-inline-block col-1"><GiCook style={{color:'#bcf70c', fontSize:24}}/></span>
                                    ): null}
                            </div>
                            
                            <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}} ><Button color="success" size="sm">Voir plus</Button></Link>
                        </div>
                    )
                })}
            </div>
        </div>
        
    )
}

export default Recipes;