import React, {useState, useEffect} from "react";
import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader, Collapse, Card, CardBody} from "reactstrap";
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
    const [recipeNutriFacts, setRecipeNutriFacts] = useState([]);
    // Added 12/01/2022 to manage status of nutriFacts
    const [nutriFactsStatus, setNutriFactsStatus] = useState('NC');
    const [ingredientsError, setIngredientsError] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
    //   added 1/11/2021 (unity)
      const [ingredientUnity, setIngredientUnity] = useState("");
    //   const pour la gestion de calcul et communication des nutriFacts
      const [willCalculateNutriFacts, setWillCalculateNutriFacts] = useState(false);
      const [willGiveNutriFacts, setWillGiveNutriFacts] = useState(false);
      const [isOpen, setIsOpen] = useState(false);

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
    // let idSelectedIng;
    // const selectIngerdientName = (e) =>{
    //     setIngredientName(e.target.innerText);
    //     idSelectedIng = e.target.id;
    //     console.log(idSelectedIng);
    // }
    // Pour recuperer les info nutri de l'ingredient selectionne //TODO
    // const getIngredientNutriInfos = ()=>{

    // }
    const onChangeIngredientQauntity = (event)=>{
        setQauntity(event.target.value)
    }
    // console.log(recipeIngrediants);
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
        // if(recipeIngrediants.length === 0){
        //     formIsValid = false;
        //     setIngredientsError('Vous devez ajouter des ingredients !')
        // }
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
        if(recipeIngrediants && recipeIngrediants.length ===0){
            formIsValid = false;
            setIngredientsError("Les ingredients sont obligatoires !");
        }
        return formIsValid;
    }
    // Calcule des nutriFacts avant de le transmetter a la fonction submit et l'envoie au back et la BDD 
    // A ajouter une const pour gerer la condition d'1 recipe avec ou sans calcule
    const onCheckCheckBoxCalculate =()=>{
        setWillCalculateNutriFacts(!willCalculateNutriFacts);
        setWillGiveNutriFacts(false);
        //  Affed 21/01/2022 to manage status of nutrifacts
        setNutriFactsStatus('CALCULATED');
        setIsOpen(false);
    }
    // Gerer la condition pour communiquer ou pas les ntriFACTS si on choisit pas le calcul just  dans la checkbox d'avant 
    const onCheckCheckBoxGiveNutri=()=>{
        setWillGiveNutriFacts(!willGiveNutriFacts);
        //  Affed 21/01/2022 to manage status of nutrifacts
        setNutriFactsStatus('GIVED');
        toggleCollapse();
    }
    // Gerer l'affichage de form pour declare les nutriFacts si fourni par le createure de la recette
    const toggleCollapse = (e) =>{
        // const {name} = e.target
        setIsOpen(!isOpen);
      //   setInputs(state=>({...state, name:''}))
    }
    // Pour valide les nutrifacts fourni par le chef
    const validerNutriFacts =(e)=>{
        e.preventDefault();
        if(recipeIngrediants.length === 0){
            setNutriFactsFormError('Vous devez ajouter des ingredientes avant de dajouter les infos nutritionnelles !!');
        }
        calculRecipeNutrifactsFor100Grams(recipeIngrediants);
    }
    
    const[recipeCaloriesIn100Grams, setRecipeCaloriesIn100Grams] = useState('');
    const[recipeCarbohydIn100Grams, setRecipeCarbohydIn100Grams] = useState('');
    const[recipeProteinIn100Grams, setRecipeProteinIn100Grams] = useState('');
    const[recipeFatIn100Grams, setRecipeFatIn100Grams] = useState('');
    const[recipeFiberIn100Grams, setRecipeFiberIn100Grams] = useState('');
    // recipeFiberIn100Grams
    const[nutriFactsFormError, setNutriFactsFormError] = useState(''); 

    const calculRecipeNutrifactsFor100Grams = (recipeIngrediants)=>{
        if (recipeIngrediants && recipeIngrediants.length > 0) {
            if (willGiveNutriFacts) {
                if(!recipeCaloriesIn100Grams || !recipeCaloriesIn100Grams || !recipeProteinIn100Grams ||!recipeFatIn100Grams || !recipeFiberIn100Grams){
                    setNutriFactsFormError('Rensigner toutes les valeurs!!');
                }else{
                    // pour le test, a modifier selon les info fourni par le createur de la recette via le form dans la collapse
                    const nutriFactsTemp = {
                        recipeCaloriesIn100Grams: recipeCaloriesIn100Grams,
                        recipeCarbohydIn100Grams: recipeCarbohydIn100Grams,
                        recipeProteinIn100Grams: recipeProteinIn100Grams,
                        recipeFatIn100Grams: recipeFatIn100Grams,
                        recipeFiberIn100Grams:recipeFiberIn100Grams
                    }
                    // const finalrecipeNutriFacts = [...recipeNutriFacts, nutriFactsTemp];
                    setRecipeNutriFacts(nutriFactsTemp);
                    setNutriFactsFormError('');
                }
            }
        }

        if (willCalculateNutriFacts) {
            let sumCalories = recipeIngrediants.reduce(function(prev, current){
                return prev + +current.ingredientCaloriesForCentGrams
            }, 0);
            console.log(sumCalories); 
            const nutriFactsTemp = {
                recipeCaloriesIn100Grams: sumCalories,
                recipeCarbohydIn100Grams: 55,
                recipeProteinIn100Grams: 34,
                recipeFatIn100Grams: 22
            }
            setRecipeNutriFacts(nutriFactsTemp);     
        }
    }
    // A revoir si besoin de ce useeffect (psk y'a la validation des nutri avant l'ajout de la recette)
    useEffect(() => {
        let mounted = true
        if(mounted){
            calculRecipeNutrifactsFor100Grams(recipeIngrediants);
        }
        return () => mounted = false;
    }, [recipeIngrediants]);

    // console.log(willGiveNutriFacts)
    // console.log(recipeNutriFacts);
    // console.log(recipeIngrediants);
    const handleSubmit =(event)=>{
        event.preventDefault();
        const recipeINgTest = recipeIngrediants;
        console.log(recipeINgTest);
        // calculRecipeNutrifactsFor100Grams(recipeINgTest);
        console.log(recipeNutriFacts);
        const recipeToSend = JSON.stringify(recipeINgTest);
        // console.log(recipeToSend);
        // Add nutrifacts array
        const nutriFactsToSend = JSON.stringify(recipeNutriFacts);
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
        // Added 12/01/2022 to manage status of nutrifas
        formData.append('nutriFactsStatus', nutriFactsStatus);
        formData.append('recipeNutriFacts', nutriFactsToSend);
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
        // console.log(recipeIngrediants);
        // if(user && token){
        //     setDisableAddButton(false)
        // }else{
        //     setDisableAddButton(true);
        //     setMsgAddRecipe('Vous devez vous connecter pour pouvoir ajouter une recette')
        // }
    }, [recipeIngrediants])
    
    // console.log("test from", recipeNutriFacts);

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
                <FormGroup className=" d-inline-block mt-4">
                    <Label  >
                        <p className="d-inline-block mr-4">
                            Vous voulez calculer les nutriFacts * ?
                        </p>     
                        <Input                  
                            type="checkbox" label="checkbox" name="checkbox" id="willCalculateNutriFacts" 
                            checked={willCalculateNutriFacts} 
                            // checked onclick="return false;" onkeydown="e = e || window.event; if(e.keyCode !== 9) return false;"
                            // onChange={onCheckCheckBoxCalculate}
                            onChange={(e)=>e.preventDefault()}
                        /> 
                        <p style={{fontSize:"10px", color:"yellow"}}>
                            * Pour chaque 100 grames dans la recette<br/>Fonctionnalite en cours d'implementation (utilisations d'API externe (Spoonacular seulement en anglais), autocompletion lors de saisie des ingredients + recuperations des valeurs nutritionnelles, calculs des valeurs nutritionnelles pour la recette a la validation)
                        </p>
                    </Label>
                </FormGroup>
                {willCalculateNutriFacts? (
                    <AutoCompleteIngredient
                     recipeIngrediants={recipeIngrediants} 
                     onAddIngrediants={setRecipeIngrediants}
                     calculRecipeNutrifactsFor100Grams={calculRecipeNutrifactsFor100Grams}
                     />
                ):( 
                    <div className="mt-4">
                        <FormGroup className="col-md-4 col-sm-5 col-xs-9 d-inline-block">
                            <Label for="ingredientName">Nom de l'ingrédient</Label>
                            <Input type="text" name="ingredientName" value={ingredientName} id="ingredientName" placeholder="Le nom de l'ingrédient" onChange={onChangeIngredientName} />
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                            <Label for="quantity">Quantité de l'ingrédient</Label>
                            <Input type="number" min="0" name="quantity" value={quantity} id="quantity" placeholder="Quantité (En chiffre)" onChange={onChangeIngredientQauntity} />
                        
                        </FormGroup>
                        <FormGroup className="col-md-3 col-sm-4 col-xs-7 d-inline-block">
                            <Label for="ingredientUnity">Choisir une unite</Label>
                            <select value={ingredientUnity} onChange={onChangeIngredientUnity}>
                                <option value=""></option>
                                <option value="gramme">Gramme</option>
                                <option value="cl">Cl</option>
                                <option value="ml">Ml</option>
                            </select>
                        </FormGroup>
                        <Button className="mb-4" onClick={addIngredient}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter l'ingrédient</Button>
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
                 {!willCalculateNutriFacts ? (
                            <FormGroup className="">
                                <Label  >
                                    <p className="d-inline-block mr-4">
                                        Connaissez vous les info nutri de votre recette ** ?
                                    </p>    
                                    <Input                  
                                        type="checkbox" label="checkbox" name="checkbox" id="willGiveNutriFacts" checked={willGiveNutriFacts} onChange={onCheckCheckBoxGiveNutri}
                                    /> 
                                </Label>
                                <p style={{fontSize:"10px", color:"yellow"}}>**Pour chaque 100 grames dans la recette</p> 
                            </FormGroup>
                        ):null}
                         <div>
                            <Collapse isOpen={isOpen}>
                                    <Card id="NutriCollaps" >
                                        <CardBody style={{background:"rgb(50 59 59)"}}>
                                            <p style={{fontSize:"small", color:"#db6111"}}>Ces valeurs seront affichees avec la recette, veuillez assurez que'elles sont calculees selon les normes pour chaques 100 grames de la recette</p>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeCaloriesIn100Grams">Calories</Label>
                                                <Input type="number" min="0" name="recipeCaloriesIn100Grams" value={recipeCaloriesIn100Grams} id="recipeCaloriesIn100Grams" onChange={(e)=> setRecipeCaloriesIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeCarbohydIn100Grams">Glucides</Label>
                                                <Input type="number" min="0" name="recipeCarbohydIn100Grams" value={recipeCarbohydIn100Grams} id="recipeCarbohydIn100Grams" onChange={(e)=> setRecipeCarbohydIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeProteinIn100Grams">Proteines</Label>
                                                <Input type="number" min="0" name="recipeProteinIn100Grams" value={recipeProteinIn100Grams} id="recipeProteinIn100Grams" onChange={(e)=> setRecipeProteinIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeFatIn100Grams">Lipides</Label>
                                                <Input type="number" min="0" name="recipeFatIn100Grams" value={recipeFatIn100Grams} id="recipeFatIn100Grams" onChange={(e)=> setRecipeFatIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeFiberIn100Grams">Fibres</Label>
                                                <Input type="number" min="0" name="recipeFiberIn100Grams" value={recipeFiberIn100Grams} id="recipeFiberIn100Grams" onChange={(e)=> setRecipeFiberIn100Grams(e.target.value)} />
                                            </FormGroup>

                                        </CardBody>
                                        <Button className="col-md-2 col-sm-3 col-xs-6 d-center" onClick={validerNutriFacts}
                                        style={{background:'rgb(50 59 59)', color:'#fff'}}
                                        >
                                            Valider
                                        </Button>
                                        <p style={{color:'#ff0000'}}>{nutriFactsFormError}</p>
                                    </Card>                    
                            </Collapse>
                        </div>

                {/* pour gerer la condition de calcul ou pas des nutriFacs */}
                
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