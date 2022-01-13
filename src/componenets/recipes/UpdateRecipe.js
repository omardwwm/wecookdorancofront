import React, {useState, useEffect} from "react";
import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector, useDispatch} from "react-redux";
// import { Redirect } from 'react-router';
import { EditorState, convertToRaw, convertFromHTML, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
import {stateToHTML} from 'draft-js-export-html'
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {updateRecipe} from "../../redux/actions/RecipeActions";
import {useHistory} from "react-router-dom";
import "./recipes.css";
const UpdateRecipe = (props)=>{

    const recipeToUpdate = props.location.state.testRecipe;
    // console.log('recipe to update is:', recipeToUpdate);
    const [formRecipe, setFormRecipe] = useState({
        recipeName: recipeToUpdate.recipeName,
        recipeDescription: recipeToUpdate.recipeDescription,
        recipePreparationTime: recipeToUpdate.recipePreparationTime,
        recipeCookingTime: recipeToUpdate.recipeCookingTime,
        recipeCategory: recipeToUpdate.recipeCategory, 
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
    const[recipeIngrediants, setRecipeIngrediants] = useState([...recipeToUpdate.recipeIngrediants]);
    const [ingredientsError, setIngredientsError] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
      // added 1/11/2021 (unity)
      const [ingredientUnity, setIngredientUnity] = useState("");
    const recipeCreator = user && user.id;
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
            errors, [name]: value
        })
    }
    // console.log(formRecipe);
    const onChangeIngredientName = (event)=>{
        setIngredientName(event.target.value)
    }
    const onChangeIngredientQauntity = (event)=>{
        setQauntity(event.target.value)
    }
      //added 1/11/2021
      const onChangeIngredientUnity = (event)=>{
        setIngredientUnity(event.target.value)
    }
    // console.log(recipeIngrediants);
    // console.log(recipeToUpdate.recipeDescription);
// Added 13/01/2022 pour mettre a jour le form des nutrifacts 
    // Pour valide les nutrifacts fourni par le chef
    const validerNutriFacts =(e)=>{
        e.preventDefault();
        if(recipeIngrediants.length === 0){
            setNutriFactsFormError('Vous devez ajouter des ingredientes avant de dajouter les infos nutritionnelles !!');
        }
        calculRecipeNutrifactsFor100Grams(recipeIngrediants);
    }
    const [recipeNutriFacts, setRecipeNutriFacts] = useState(recipeToUpdate.recipeNutriFacts && recipeToUpdate.recipeNutriFacts);
    // const nutriFactsStatus = recipeToUpdate.nutriFactsStatus && recipeToUpdate.nutriFactsStatus; // A revoir si besoin lors de l'update
    const[recipeCaloriesIn100Grams, setRecipeCaloriesIn100Grams] = useState(recipeToUpdate.recipeNutriFacts[0].recipeClories);
    const[recipeCarbohydIn100Grams, setRecipeCarbohydIn100Grams] = useState(recipeToUpdate.recipeNutriFacts[0].recipeCarbohydes);
    const[recipeProteinIn100Grams, setRecipeProteinIn100Grams] = useState(recipeToUpdate.recipeNutriFacts[0].recipeProteines);
    const[recipeFatIn100Grams, setRecipeFatIn100Grams] = useState(recipeToUpdate.recipeNutriFacts[0].recipeFat);
    const[recipeFiberIn100Grams, setRecipeFiberIn100Grams] = useState(recipeToUpdate.recipeNutriFacts[0].recipeFiber);
    // recipeFiberIn100Grams
    const[nutriFactsFormError, setNutriFactsFormError] = useState('');

    const calculRecipeNutrifactsFor100Grams = (recipeIngrediants)=>{
        if (recipeIngrediants && recipeIngrediants.length > 0) {
            if(!recipeCaloriesIn100Grams || recipeCarbohydIn100Grams==='' || recipeProteinIn100Grams==='' ||recipeFatIn100Grams==='' || recipeFiberIn100Grams===''){
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
            // if (willGiveNutriFacts) {
            // }
        }
    }
console.log(recipeNutriFacts);

    const htmlInstructions = stateToHTML(convertFromRaw(JSON.parse(recipeToUpdate.recipeDescription)));
    const [instructionsError, setInstructionsError] = useState('');
    // console.log(htmlInstructions);
    // const [instructions, setInstructions] = useState(EditorState.createWithContent((htmlInstructions.rowBlocks), null));

    const converted = convertFromHTML(htmlInstructions);
    // console.log(converted);
 
    const defaultInstructions = EditorState.createWithContent(
        ContentState.createFromBlockArray(
            converted
        )
    )
    // console.log(defaultInstructions);
  
    const [instructions, setInstructions] = useState(defaultInstructions);
    const onEditorStateChange = (editorState) => {
      setInstructions(editorState);
      setInstructionsError('')
      }
    
    const[recipePicture, setRecipePicture] =useState(null);
    const selectImage = (event)=>{
        event.preventDefault();
        setRecipePicture(event.target.files[0])        
    };
    // console.log(recipePicture);
    const addIngredient =(event)=>{
        event.preventDefault();
        if(ingredientName ==="" || quantity ==="" || ingredientUnity ===""){
            setIngredientsError("Vous devez enter un nom et une (quantité unité) pour l'ingredient avant de cliquer sur ajouter")
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
        setIngredientUnity("");
        setIngredientsError("");
        }      
    }

    const removeIngredient =(index)=>{
        let filtredArray = [...recipeIngrediants];
        // console.log(index)
        if(index > -1){
            filtredArray.splice(index, 1)
        }
        setRecipeIngrediants(filtredArray);
    }
   
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
        const recipeToSend = JSON.stringify(recipeINgTest);
        // console.log(recipeToSend);
        const nutriFactsToSend = JSON.stringify(recipeNutriFacts);
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        let recipeId = recipeToUpdate._id
        const formData = new FormData();
        if(recipePicture){
            formData.append('recipePicture',recipePicture);
            formData.append('oldRecipePicture',recipeToUpdate.recipePicture);
        }else{
            formData.append('oldRecipePicture',recipeToUpdate.recipePicture);
        }
        // console.log(recipePicture);
        // formData.append('recipePicture',recipePicture);
        formData.append('recipeName', formRecipe.recipeName);
        formData.append('recipeCategory', formRecipe.recipeCategory);
        // formData.append('recipeDescription', formRecipe.recipeDescription);
        formData.append('recipeDescription',  JSON.stringify(convertToRaw(instructions.getCurrentContent())));
        formData.append('recipePreparationTime', formRecipe.recipePreparationTime);
        formData.append('recipeCookingTime', formRecipe.recipeCookingTime);
        formData.append('recipeCreator', recipeCreator);
        formData.append('recipeCreatorName', recipeCreatorName);
        formData.append('recipeIngrediants', recipeToSend);
        formData.append('recipeNutriFacts', nutriFactsToSend);
        if(checkFormValidation()){
            console.log(nutriFactsToSend);
            dispatch(updateRecipe(recipeId, formData, config)).then(setModal(true)).then(()=>setTimeout(() => {
            history.push(`/recipes`);
            (setModal(false))
            }, 5000));
        }else{
            setMsgAddRecipe('Certains champs sont pas remplis');
         }      
    }
    // console.log('showModalIs:', showModale);
    useEffect(()=>{
        localStorage.getItem('myUser');
        localStorage.getItem('userToken');
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted){
            calculRecipeNutrifactsFor100Grams(recipeIngrediants);
            setRecipeNutriFacts(recipeNutriFacts);
        }
        return () => mounted = false;
    }, [recipeIngrediants, recipeNutriFacts]);
    // console.log(recipePicture.name); 


    if(user){
        return (
            <div className="formNewRecipe">
                <h3>UPDATE/MODIFIER LA RECETTE</h3>
                <Form className="m-4 col-md-10 col-sm-12 m-auto" encType="multipart/form-data" onSubmit={handleSubmit }>
                    <FormGroup className="col-md-8 col-sm-9 m-auto">
                        <Label for="recipeName">Nom de la recette</Label>
                        <Input type="text" name="recipeName" id="recipeName" defaultValue={recipeToUpdate.recipeName} onChange={handleChange} />
                    </FormGroup>
                    {formRecipe.errors.recipeNameError?
                        <div style={{color:'red'}}>
                            {formRecipe.errors.recipeNameError}
                        </div>: null
                    }
                    <FormGroup className="col-md-6 col-sm-8 col-xs-8 m-auto">
                        <Label for="recipeCategory">Sélectionner une catégorie</Label>
                        <Input type="select" name="recipeCategory" id="recipeCategory" placeholder="Choice a category" onChange={handleChange}>
                            <option defaultValue={recipeToUpdate.recipeCategory}>{recipeToUpdate.recipeCategory}</option>
                            <option value="entree">Entree</option>
                            <option value="plat">Plat</option>
                            <option value="dessert">Dessert</option>
                        </Input>
                    </FormGroup>
                    {formRecipe.errors.recipeCategoryError?
                        <div style={{color:'red'}}>
                            {formRecipe.errors.recipeCategoryError}
                        </div>: null
                    }
                    <FormGroup className="col-md-4 col-sm-5 col-xs-9 d-inline-block mt-4">
                        <Label for="ingredientName">Nom de l'ingrédient</Label>
                        <Input type="text" name="ingredientName" value={ingredientName} id="ingredientName" placeholder="Le nom de l'ingrédient" onChange={onChangeIngredientName} />
                    </FormGroup>
                    <FormGroup className="col-md-3 col-sm-4 col-xs-9 d-inline-block">
                        <Label for="quantity">Quantité de l'ingrédient</Label>
                        <Input type="number" min="0" name="quantity" value={quantity} id="quantity" placeholder="Quantité : en chiffre" onChange={onChangeIngredientQauntity} />
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
                    <Button className="mb-4" onClick={addIngredient}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter l'ingrédient</Button>
                    {ingredientsError?(
                        <div style={{color:'red'}}>
                            <p>{ingredientsError}</p>
                        </div>
                    )
                    :null}
                    {recipeIngrediants.length >0 ?
                        (<div className="listIng p-0 m-auto col-sm-12 col-lg-9">
                            <h4>Liste des ingredients</h4>
                            <ol>
                                {recipeIngrediants.map((ing, index)=>(
                                    <div className="" key={index}>
                                        <li className="d-inline-block" >
                                            {ing.ingredientName}:{"   "}{ing.quantity}{ing.ingredientUnity}
                                            <Button className="btnRemoveIngr" onClick={()=>removeIngredient(index)}><RiDeleteBin6Fill /></Button>
                                        </li>
                                       
                                    </div>                       
                                ))}
                            </ol>
                        </div>) : null
                    }
                    {recipeToUpdate.nutriFactsStatus && recipeToUpdate.nutriFactsStatus ==="GIVED"?
                        (
                            <>
                                <p>TEST FORM UPDATE NUTRIFACTS</p>
                                <Card id="NutriCollaps" >
                                        <CardBody style={{background:"rgb(50 59 59)"}}>
                                            <p style={{fontSize:"small", color:"#db6111"}}>Ces valeurs seront affichees avec la recette, veuillez assurez que'elles sont calculees selon les normes pour chaques 100 grames de la recette</p>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeCaloriesIn100Grams">Calories</Label>
                                                <Input type="number" min="0" name="recipeCaloriesIn100Grams" defaultValue={recipeCaloriesIn100Grams} id="recipeCaloriesIn100Grams" onChange={(e)=> setRecipeCaloriesIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeCarbohydIn100Grams">Glucides</Label>
                                                <Input type="number" min="0" name="recipeCarbohydIn100Grams" defaultValue={recipeCarbohydIn100Grams} id="recipeCarbohydIn100Grams" onChange={(e)=> setRecipeCarbohydIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeProteinIn100Grams">Proteines</Label>
                                                <Input type="number" min="0" name="recipeProteinIn100Grams" defaultValue={recipeProteinIn100Grams} id="recipeProteinIn100Grams" onChange={(e)=> setRecipeProteinIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeFatIn100Grams">Lipides</Label>
                                                <Input type="number" min="0" name="recipeFatIn100Grams" defaultValue={recipeFatIn100Grams} id="recipeFatIn100Grams" onChange={(e)=> setRecipeFatIn100Grams(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup className="col-md-2 col-sm-3 col-xs-6 d-inline-block">
                                                <Label for="recipeFiberIn100Grams">Fibres</Label>
                                                <Input type="number" min="0" name="recipeFiberIn100Grams" defaultValue={recipeFiberIn100Grams} id="recipeFiberIn100Grams" onChange={(e)=> setRecipeFiberIn100Grams(e.target.value)} />
                                            </FormGroup>

                                        </CardBody>
                                        <Button className="col-md-2 col-sm-3 col-xs-6 d-center" onClick={validerNutriFacts}
                                        style={{background:'rgb(50 59 59)', color:'#fff'}}
                                        >
                                            Valider
                                        </Button>
                                        <p style={{color:'#ff0000'}}>{nutriFactsFormError}</p>
                                    </Card>                    
                            </>
                        ):null
                    }
                    <div className="instructions m-3">
                        <FormGroup>
                            <Label for="recipeDescription">Instructions de la recette</Label>
                            <Editor 
                                editorState={instructions}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                editorStyle={{ height: "250px" , padding: "10px", background:'#fff', color:'#000'}}
                                onEditorStateChange={onEditorStateChange}
                            />
                        </FormGroup>
                    </div>
                    {instructionsError ?
                        <div style={{color:'red'}}>
                            {instructionsError}
                        </div>: null
                    }
                   
                    <FormGroup className="d-inline-block m-1">
                        <Label for="recipePreparationTime">Temps de preparation</Label>
                        <Input className="col-xs-6 " type="text" name="recipePreparationTime" id="recipePreparationTime" defaultValue={recipeToUpdate.recipePreparationTime}  onChange={handleChange}/>
                    </FormGroup>
                    {formRecipe.errors.recipePreparationTimeError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipePreparationTimeError}
                    </div>: null
                }
                    <FormGroup className="d-inline-block m-1">
                        <Label for="recipeCookingTime">Temps de cuisson</Label>
                        <Input className="col-xs-6 " type="text" name="recipeCookingTime" id="recipeCookingTime" defaultValue={recipeToUpdate.recipeCookingTime}  onChange={handleChange}/>
                    </FormGroup>
                    {formRecipe.errors.recipeCookingTimeError?
                    <div style={{color:'red'}}>
                        {formRecipe.errors.recipeCookingTimeError}
                    </div>: null
                }
                    <FormGroup className="mt-4">
                        <Label for="recipePicture">Image de la recette</Label>
                        <div>
                            <h5>ancienne image</h5>
                            <img className="d-block m-2" 
                                // src={`https://mern-recipes.herokuapp.com${recipeToUpdate.recipePicture}`}
                                src={recipeToUpdate.recipePicture}
                                style={{width:'200px', height:'100px'}}
                                alt="recipe illustration"
                            />
                        </div>
                        <Input type="file" name="recipePicture" id="recipePicture" placeholder="Select a picture" onChange={selectImage}/>
                        {/* {recipePicture && <div>
                            <h5>nouvelle image</h5>
                            <img className="d-block m-2" src={recipePicture} style={{width:'200px', height:'100px'}} alt="test" />
                        </div>} */}
                         
                    </FormGroup>
                    {/* {modalBody ? (
                        <div style={{color:'#f0f'}}>
                            <p>{modalBody}</p>
                        </div>
                    ):null} */}
                    <Button type="submit" color="primary" style={{margin:5}}>
                        Modifier cette recette
                    </Button>
                    <p style={{color:'#f00'}}>{msgAddRecipe}</p>
                </Form>
                <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                        <ModalBody>
                            {modalBody}       
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary"  onClick={toggle}>OK</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            
        )
    }else{
        return <div>
            <p>vous devez vous connecter pour creer et ajouter vos recettes</p>
        </div>
    }

}

export default UpdateRecipe;