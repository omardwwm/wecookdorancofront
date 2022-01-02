import React, {useState, useEffect} from "react";
import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector, useDispatch} from "react-redux";
import {createRecipe} from "../../redux/actions/RecipeActions";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import {stateToHTML} from 'draft-js-export-html'
// import htmlToDraft from 'html-to-draftjs';
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./newRecipe.css";
// import axios from "axios";
import {useHistory} from "react-router-dom";
import AutoCompleteIngredient from "./IngredientsSearchAutoComplete";

const Recipes = ()=>{

    const [formRecipe, setFormRecipe] = useState({
        recipeName:"",
        recipeDescription: {},
        recipePreparationTime: "",
        recipeCookingTime:"",
        recipeCategory: "",
        errors:{
            recipeNameError:"",
            recipePreparationTimeError:"",
            recipeCookingTimeError:"",
            recipeCategoryError:"",
        }
    });

    const history = useHistory();
    // const user = useSelector(state => state.userReducer.user);
    const user = JSON.parse(localStorage.getItem('myUser'));
    // console.log('user inside form', user);
    const token = localStorage.getItem('userToken');
    // console.log(token);
    // const willRedirect = useSelector(state=>state.recipeReducer.redirect);
    // const [willRedirect, setWillRedirect]= useState(redirect);
    const modalTitle = useSelector(state=>state.recipeReducer.modalTitle);
    const modalBody = useSelector(state=>state.recipeReducer.modalBody);
    const showModale = useSelector(state => state.recipeReducer.showModale)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!showModale);
    const dispatch = useDispatch();
    // const [inputValue, setInputValue]=useState("");
    const[recipeIngrediants, setRecipeIngrediants] = useState([]);
    const [ingredientsError, setIngredientsError] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
      // added 1/11/2021 (unity)
      const [ingredientUnity, setIngredientUnity] = useState("");
    const recipeCreator = user && user.id ? user.id : user && user._id;
    const recipeCreatorName = user && user.username;
    // console.log(recipeCreator);
    const handleChange = (event)=>{
        event.preventDefault();
        const {name, value} = event.target;
        let errors = formRecipe.errors;
        switch(name){
            case "recipeName":
                errors.recipeNameError = value.length < 2 || value.length == null? "Enter un nom pour cette recette": "";
                break;
            case "recipeCategory":
                errors.recipeCategoryError = value === ""? "Vous devez choisir une cetegorie": "";
                break;
            case "recipePreparationTime":
                errors.recipePreparationTimeError = (value.length === "" || isNaN(value) ) ? "Enter une duree en chiffre":"";
                break;
            case "recipeCookingTime":
                errors.recipeCookingTimeError = (value.length === "" || isNaN(value) ) ? "Enter une duree en chiffre":"";
                break;
            default:
                break;         
        }
        setFormRecipe({
            ...formRecipe,
            // [event.target.name]:isFile? event.target.files[0] : event.target.value 
            // [event.target.name]:event.target.value,
            errors, [name]: value
        })
    }
    // console.log(formRecipe);
    const onChangeIngredientName = (e)=>{
        setIngredientName(e.target.value)
    }
    let idSelectedIng;
    const selectIngerdientName = (e) =>{
        setIngredientName(e.target.innerText);
        idSelectedIng = e.target.id;
        console.log(idSelectedIng);
    }
    // Pour recuperer les info nutri de l'ingredient selectionne //TODO
    // const getIngredientNutriInfos = ()=>{

    // }
    const onChangeIngredientQauntity = (event)=>{
        setQauntity(event.target.value)
    }
    console.log(recipeIngrediants);
    //added 1/11/2021
    const onChangeIngredientUnity = (event)=>{
        setIngredientUnity(event.target.value)
    }

    const [instructions, setInstructions] = useState(EditorState.createEmpty());
    const [instructionsError, setInstructionsError] = useState('');
    const onEditorStateChange = (editorState) => (
      setInstructions(editorState),
      setInstructionsError('')
    //   console.log(draftToHtml(convertToRaw(instructions.getCurrentContent())))
      );
    
    // console.log(instructions);   

    const[recipePicture, setRecipePicture] =useState("");
    const selectImage = (event)=>{
        event.preventDefault();
        // const file = event.target.files[0];
        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        setRecipePicture(event.target.files[0])

        // setFormRecipe({
        //     ...formRecipe,
        //     recipePicture: file
        // })
        // reader.onloadend = ()=>{
        //     setFormRecipe({
        //         ...formRecipe,
        //         recipePicture:reader.result
        //     });
        //     console.log(reader);
        // }      
        // reader.readAsDataURL(file)   
    };
    // console.log(recipePicture);
    const addIngredient =(event)=>{
        event.preventDefault();
        if(ingredientName==="" || quantity ==="" || ingredientUnity ===""){
            setIngredientsError("Vous devez enter un nom, une quantité et une unité pour chaque l'ingredient avant de cliquer sur ajouter")
        }else if(recipeIngrediants.some(ingredient=> ingredient.ingredientName ===ingredientName)){
            setIngredientsError("Vous avez deja ajoute un ingredient avec ce nom!!")
        }else{
            const newIngredient = {
            ingredientName:ingredientName,
            quantity: quantity,
            ingredientUnity: ingredientUnity
            }
        const newIngredients = [...recipeIngrediants, newIngredient];
        setRecipeIngrediants(newIngredients);
        setIngredientName("");
        setQauntity("");
        //added 1/11/2021
        setIngredientUnity("");
        setIngredientsError("");
        }      
    }

    // console.log("ingerd inside newRecipe ===>", ingredientName);
    useEffect(()=>{
        setModal(false);
    }, [])

    const removeIngredient =(index)=>{
        let filtredArray = [...recipeIngrediants];
        // console.log(index)
        if(index > -1){
            filtredArray.splice(index, 1)
        }
        setRecipeIngrediants(filtredArray);
    }
    // console.log(convertToRaw(instructions.getCurrentContent()).blocks[0].text);
    // add recipe Button gestion
    // const [disableAddButton, setDisableAddButton] = useState(true);
    const [msgAddRecipe, setMsgAddRecipe] = useState('');
    const checkFormValidation = ()=>{
        let formIsValid = true;
        if(!formRecipe.recipeName){
            formIsValid = false;
            formRecipe.errors.recipeNameError = 'Le nom ne peut pas etre vide'
        }
        if(!formRecipe.recipeCategory){
            formIsValid = false;
            formRecipe.errors.recipeCategoryError = 'Category ne peut pas etre vide'
        }
        if(recipeIngrediants.length === 0){
            formIsValid = false;
            setIngredientsError('Vous devez ajouter des ingredients !')
        }
        if(convertToRaw(instructions.getCurrentContent()).blocks[0].text === '' ){
            formIsValid = false;
            // console.log('ok')
            setInstructionsError('Vous devez saisir les instructions et étapes de la recette');
            // console.log(instructionsError);
        }
        if(!formRecipe.recipePreparationTime){
            formIsValid = false;
            formRecipe.errors.recipePreparationTimeError = 'La durée est obligatoire'
        }
        if(!formRecipe.recipeCookingTime){
            formIsValid = false;
            formRecipe.errors.recipeCookingTimeError = 'La durée est obligatoire'
        }
        return formIsValid;
    }
    const handleSubmit =(event)=>{
        event.preventDefault();
        const recipeINgTest = recipeIngrediants;
        // console.log(recipeINgTest);
        // formRecipe.recipeIngrediants.split(',');
        // [
        //     {ingredientName: "potatose",quantity: "200gr"},
        //     {ingredientName: "tomatoes",quantity: "2 pieces"},
        //     {ingredientName: "olive oil",quantity: "20cl"}
        // ];
        const recipeToSend = JSON.stringify(recipeINgTest);
        // console.log(recipeToSend);
        const config = {headers: {
            Accept:'*/*',
            "x-auth-token":`${token}`,
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }};
        const formData = new FormData();
        formData.append('recipePicture',recipePicture);
        formData.append('recipeName', formRecipe.recipeName);
        formData.append('recipeCategory', formRecipe.recipeCategory);
        // formData.append('recipeDescription', formRecipe.recipeDescription);
        formData.append('recipeDescription', JSON.stringify(convertToRaw(instructions.getCurrentContent())));
        formData.append('recipePreparationTime', formRecipe.recipePreparationTime);
        formData.append('recipeCookingTime', formRecipe.recipeCookingTime);
        formData.append('recipeCreator', recipeCreator);
        formData.append('recipeCreatorName', recipeCreatorName);
        formData.append('recipeIngrediants', recipeToSend);
        // console.log('myPictureIs', recipePicture);
        // console.log(JSON.stringify(formRecipe));
        // axios.post('http://localhost:8080/recipes/add-recipe', formData, config
        // )
        if(checkFormValidation()){
            if(user && token){
                dispatch(createRecipe(formData, config)).then(setModal(true)).then(()=>setTimeout(() => {
                    history.push(`/recipes`);
                    setModal(false);
                }, 4000));
            }else{
                setMsgAddRecipe('Vous devez vous connecter pour pouvoir ajouter une recette')
            }
            
        }else{
           setMsgAddRecipe('Certains champs sont pas remplis');
        }
        // if(user && token){
            
        //     if(checkFormValidation()){
        //         dispatch(createRecipe(formData, config)).then(setModal(true)).then(()=>setTimeout(() => {
        //             history.push(`/recipes`);
        //             setModal(false);
        //         }, 4000));
                
        //     }else{
        //        setMsgAddRecipe('Certains champs sont pas remplis');
        //     }
        // }     
    }
    useEffect(()=>{
        localStorage.getItem('myUser');
        localStorage.getItem('userToken');
        // if(user && token){
        //     setDisableAddButton(false)
        // }else{
        //     setDisableAddButton(true);
        //     setMsgAddRecipe('Vous devez vous connecter pour pouvoir ajouter une recette')
        // }
    }, [])
    

    return (
        <div className="formNewRecipe">
            <Form className="m-4 col-md-10 col-sm-12 m-auto" encType="multipart/form-data" onSubmit={handleSubmit }>
                <FormGroup className="col-md-8 col-sm-9 m-auto">
                    <Label for="recipeName">Nom de la recette</Label>
                    <Input type="text" name="recipeName" id="recipeName" placeholder="Enter un nom pour cette recette" onChange={handleChange} />
                </FormGroup>
                {formRecipe.errors.recipeNameError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipeNameError}
                    </div>: null
                }
                <FormGroup className="col-md-6 col-sm-8 col-xs-8 m-auto">
                    <Label for="recipeCategory">Sélectionner une catégorie</Label>
                    <Input type="select" name="recipeCategory" id="recipeCategory" placeholder="Choice a category" onChange={handleChange}>
                        <option value="">Choisir...</option>
                        <option value="entree">Entrée</option>
                        <option value="plat">Plat</option>
                        <option value="dessert">Dessert</option>
                    </Input>
                </FormGroup>
                {formRecipe.errors.recipeCategoryError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipeCategoryError}
                    </div>: null
                }
                    <AutoCompleteIngredient ingredientName={ingredientName} quantity={quantity} ingredientUnity={ingredientUnity} onChangeIngredientName={onChangeIngredientName} selectIngerdientName={selectIngerdientName} onChangeIngredientQauntity={onChangeIngredientQauntity} ingredientUnity={ingredientUnity} onChangeIngredientUnity={onChangeIngredientUnity} addIngredient={addIngredient} ingredientsError={ingredientsError} />
                    {/* ---DEBUT A MODIFIER APRES SELON CHECK OPTION SI AVEC OU SANS CALCUL DES NUTRIFACTS */}
                {/* <FormGroup className="col-md-4 col-sm-5 col-xs-9 d-inline-block mt-4">
                    <Label for="ingredientName">Nom de l'ingrédient</Label>
                    <Input type="text" name="ingredientName" value={ingredientName} id="ingredientName" placeholder="Le nom de l'ingrédient" onChange={onChangeIngredientName} />
                </FormGroup>
                <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                    <Label for="quantity">Quantité de l'ingrédient</Label>
                    <Input type="number" name="quantity" value={quantity} id="quantity" placeholder="Quantité (En chiffre)" onChange={onChangeIngredientQauntity} />
                   
                </FormGroup>
                <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                    <Label for="ingredientUnity">Choisir une unite</Label>
                    <select value={ingredientUnity} onChange={onChangeIngredientUnity}>
                        <option value=""></option>
                        <option value="gramme">Gramme</option>
                        <option value="cl">Cl</option>
                        <option value="ml">Ml</option>
                    </select>
                </FormGroup> */}
                {/* A MODIFIER APRES SELON CHECK OPTION SI AVEC OU SANS CALCUL DES NUTRIFACTS ---FIN */}

                {/* <Button className="mb-4" onClick={addIngredient}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter l'ingrédient</Button> */}
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
                
                {/* <FormGroup>
                    <Label for="recipeDescription">Instructions of the recipe</Label>
                    <Input type="textarea" name="recipeDescription" id="recipeDescription" placeholder="Instructions of the recipe" onChange={handleChange} />
                </FormGroup> */}
                <div className="instructions m-3">
                    <FormGroup>
                        <Label for="recipeDescription" style={{fontSize:'28px'}}>INSTRUCTIONS ET ÉTAPES DE LA RECETTE</Label>
                        <Editor 
                            editorState={instructions}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            editorStyle={{ height: "250px" , padding: "10px", }}
                            onEditorStateChange={onEditorStateChange}
                        />
                    </FormGroup>
                </div>
                {instructionsError ?
                        <div style={{color:'red'}}>
                            {instructionsError}
                        </div>: null
                    }
                <FormGroup className=" d-inline-block m-1">
                    <Label for="recipePreparationTime">Temps de préparation</Label>
                    <Input className="col-xs-6 " type="text" name="recipePreparationTime" id="recipePreparationTime" placeholder="En minutes"  onChange={handleChange}/>
                </FormGroup>
                {formRecipe.errors.recipePreparationTimeError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipePreparationTimeError}
                    </div>: null
                }
                <FormGroup className=" d-inline-block m-1">
                    <Label for="recipeCookingTime">Temps de cuisson</Label>
                    <Input className="col-xs-6 " type="text" name="recipeCookingTime" id="recipeCookingTime" placeholder="En minutes"  onChange={handleChange}/>
                </FormGroup>
                {formRecipe.errors.recipeCookingTimeError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipeCookingTimeError}
                    </div>: null
                }
                <FormGroup className="mt-4">
                    <Label for="recipePicture">Image de la recette</Label>
                    <Input type="file" name="recipePicture" id="recipePicture" placeholder="Select a picture" onChange={selectImage}/>
                </FormGroup>
                <Button type="submit" color="primary" style={{margin:5}}>
                    Ajouter la recette
                </Button>
                <p style={{color:'#f00'}}>{msgAddRecipe}</p>
            </Form>
            <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                    <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {modalBody}       
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary"  onClick={toggle}>OK</Button>{' '}
                    {/* {willRedirect ? <Redirect to="/recipes" />
                    : null } */}
                    {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                    </ModalFooter>
                </Modal>
        </div>   
    )

}

export default Recipes;