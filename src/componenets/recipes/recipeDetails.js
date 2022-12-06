import React, {useEffect, useState} from "react";
// import {getAllRecipes} from "../../redux";
import axios from "axios";
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw} from 'draft-js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Card } from 'reactstrap';
import {deleteRecipe, postComment} from "../../redux/actions/RecipeActions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import {formatDate} from "../../outils/outils";
import {GiAlarmClock, GiTrashCan} from 'react-icons/gi';
import {AiOutlineLike} from 'react-icons/ai';
import { generateRecipePDF } from "./generateRecipePDF";
import DoghChart from './DoghChart';
import "./recipes.css";
import "./pdfStyle.css";

const RecipeDetails = (props)=>{ 
    
    const {REACT_APP_WECOOK_API_RENDER} = process.env;
    const recipeId = props.match.params._id;
    // const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const dispatch = useDispatch();
    const history = useHistory();
    // const thisRecipe = useSelector(state=> state.recipeReducer.recipe);
    // const testRecipe = useSelector(state=> state.recipeReducer.recipe);
    // const savedRecipe = JSON.parse(localStorage.getItem('thisRecipe'));
    const [testRecipe, setTestRecipe ]= useState([]);
    const [modalMessage, setModalMessage] = useState('');
    // const test = localStorage.thisRecipe;
    // console.log(test); 
    // console.log(localStorage); 
    // console.log('recipeFromReducer', thisRecipe);
    // console.log('recipe is',testRecipe);
    // const test2 = localStorage.thisRecipe && JSON.parse(localStorage.thisRecipe).recipeName;
    // console.log(test2);    
    const token = localStorage.getItem('userToken');
    // console.log(token); 
    // const user = localStorage.getItem('myUser');
    // const [user, setUser] = useState(null);
    const user = localStorage.getItem('myUser') && JSON.parse(localStorage.getItem('myUser'));
    // console.log(user);

    // const getUser = ()=>{
    //     if(JSON.parse(localStorage.getItem('myUser'))){
    //         const storedUser = JSON.parse(localStorage.getItem('myUser'))
    //         setUser(storedUser);
    //         console.log(storedUser);
    //     }
    //     getUser();
    // }
    const userId = user &&  user.id ? user.id : user && user._id;
    // console.log('userID Is:', userId);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!showModale);
    const modalTitle = useSelector(state=>state.recipeReducer.modalTitle);
    const modalBody = useSelector(state=>state.recipeReducer.modalBody);
    const showModale = useSelector(state => state.recipeReducer.showModale)
    // console.log(showModale); 
    // console.log(modal);
    // const config = {headers: {
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};
    // const config = {headers: {
    //     Accept:'*/*',
    //     'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};
    // console.log(recipeId);
    const htmlInstructions = testRecipe && testRecipe.recipeDescription && stateToHTML(convertFromRaw(JSON.parse(testRecipe.recipeDescription)));
    // const htmlInstructions = testRecipe && stateToHTML(convertFromRaw(testRecipe.recipeDescription));
    // console.log(thisRecipe && JSON.parse(thisRecipe.recipeDescription));
    // const state1 = ContentState.createFromBlockArray(
    //     instructionsTest.contentBlock,
    //     instructionsTest.entityMap,
    //   );
    //   console.log(state1);
    // console.log(testRecipe.recipeDescription);
    const ingredients = testRecipe && testRecipe.recipeIngrediants;
    const [commentContent, setCommentContent] = useState('');
    const [errorComment, setErrorComment] = useState('')
    const [errorLikeMsg, setErrorLikeMsg] = useState('');
    const handleChangeComment =(e)=>{
        e.preventDefault();
        setErrorComment('');
        setCommentContent(e.target.value)
        // setCommentContent(JSON.stringify(e.target.value));
        // if(e.target.value == "" || e.target.value == null){
        //     setCommentContent(e.target.value)
        // }  
    }

    useEffect(()=>{
        let mounted = true
        if(mounted){
            if(modalBody){
                setModalMessage(modalBody)
            }      
        }
        return () => mounted = false;
    }, [modalBody]);

    const sendComment =(e)=>{
        e.preventDefault();
        const config = {headers: {
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        if(user && token){
            if(commentContent){
                dispatch(postComment(recipeId, userId, commentContent, config)).then(setModal(true)).then(setCommentContent("")).then(()=>setTimeout(() => {
                    setModal(false)
                }, 2500)).then(()=>fetchRecipe()); 
                ;
                // console.log(commentContent)  
                }else{
                    setErrorComment('Vous devez ecrire le commentaire avant de l\'envoyer')
                }
        }else{
            setErrorComment('Vous devez vous connecter pour pouvoir poster des commentaires');
        }  
    }
    
    const deleteThisRecipe=()=>{
        const token = localStorage.getItem('userToken');
        let recipeId = testRecipe._id;
        const dataToDelete = JSON.stringify(testRecipe.recipePicture);
        // console.log(dataToDelete);
        // console.log(JSON.stringify(dataToDelete));
        if(window.confirm('vous voulez supprimer cette recette?')){
            dispatch(deleteRecipe(recipeId, dataToDelete, token)).then(setModal(true)).then(()=>setTimeout(() => {
                history.push(`/recipes`)
            }, 4000)); 
        }     
    }
    // const currentRecipeComments = testRecipe && testRecipe.comments && testRecipe.comments;
    // console.log(currentRecipeComments);
    const fetchRecipe =async()=>{
        await axios.get(`${REACT_APP_WECOOK_API_RENDER}/recipes/${recipeId}`).then(response=>{
            // await axios.get(`http://localhost:8080/recipes/${recipeId}`).then(response=>{
            setTestRecipe(response.data);
        })      
    } 
    // TODO // DISPLAY RECIPENUTRIFACTS AFETR FINISH PROCESS IN BACKEND AND DATABASE 
    // testRecipe && console.log('recipeFinalIs', testRecipe);
    const idFromRecipe = testRecipe.recipeCreator;
    // idFromRecipe == userId ? console.log('okkkk'): console.log('not working')
    // const isMine = (testRecipe.recipeCreator ===user && user.id || testRecipe.recipeCreator===user && user._id) ? true : false;    
    const isMine = idFromRecipe === userId ? true : false;
    // console.log(isMine);

    const deleteComment = async(e)=>{
        // console.log(e.currentTarget.id);
        let commentId = e.currentTarget.id;
        if(window.confirm('vous voulez supprimer ce commentaire?')){
            await axios.delete(`${REACT_APP_WECOOK_API_RENDER}/comments/delete/${commentId}`, {headers:{"x-auth-token":`${token}`}})
            .then(response => setModalMessage(response.data.message))
            .then(setModal(true))
            .then(()=>setTimeout(() => {
                setModal(false)
            }, 3000))
            .then(()=>fetchRecipe())
        }
    }

    const unlikeRecipe=async()=>{
        // console.log('function unlike');
        if(!token){
            setErrorLikeMsg('Vous devez vous connecter pour liker/disliker une recette !');
            setTimeout(() => {
                setErrorLikeMsg('');
            }, 6000);
        }else{
            await axios.put(`${REACT_APP_WECOOK_API_RENDER}/recipes/unlike/${recipeId}`,{userId:userId}, {headers:{"x-auth-token":`${token}`}})
            // .then(response => console.log(response.data.message))
            .then(response => setModalMessage(response.data.message))
                .then(setModal(true))
                .then(()=>setTimeout(() => {
                    setModal(false)
                }, 2000))
                .then(()=>fetchRecipe())
            } 
    }

    const likeRecipe=async()=>{
        // console.log('function like');
        if(!token){
            setErrorLikeMsg('Vous devez vous connecter pour liker/disliker une recette !');
            setTimeout(() => {
                setErrorLikeMsg('');
            }, 6000);
        }else{
            await axios.put(`${REACT_APP_WECOOK_API_RENDER}/recipes/like/${recipeId}`,{userId:userId}, {headers:{"x-auth-token":`${token}`}})
            // .then(response => console.log(response))
            .then(response => setModalMessage(response.data.message))
                .then(setModal(true))
                .then(()=>setTimeout(() => {
                    setModal(false)
                }, 2000))
                .then(()=>fetchRecipe())
            }
    }

    const generatePDFFunction = ()=>{
        generateRecipePDF(testRecipe, htmlInstructions)
    }

    useEffect(()=>{
        fetchRecipe();
        localStorage.getItem('userToken');
        // const { pathname } = window.location;
        // dispatch(getOneRecipe(recipeId));
        // getUser();
        // setCurrentPath(pathname);     
        // if(JSON.parse(localStorage.getItem('thisRecipe'))){
        //     const recipeFromStorage = JSON.parse(localStorage.getItem('thisRecipe'));
        //     setTestRecipe(recipeFromStorage); 
        // }
        
        // console.log(currentPath)
    },[]);     

    // useEffect(()=>{
    //     localStorage.setItem('myUser', JSON.stringify(user)); 
    // }, [user]);   

    // console.log(isMine);
    // console.log('comments are: ',testRecipe.comments)
    // if(!testRecipe){
    //     return (
    //         <p>Nothing to show</p>
    //     )
    // }
    return(
        <div className="col-12 m-2">
            <div >
                <h3 className="text-center" >{testRecipe.recipeName}</h3>
                <p>
                    Creation de : <Link to={{pathname: `/chef/${testRecipe.recipeCreator}`}} style={{color:'#a1d80a'}}>{testRecipe.recipeCreatorName}</Link>
                    {/* <img 
                        src={}
                    /> */}
                </p>
                <div className="containerImg">
                    <div className="imgDetailDiv">
                        <img
                        className="imgDetailRecipe"
                            // src={`https://mern-recipes.herokuapp.com${testRecipe.recipePicture}`}
                            src={testRecipe.recipePicture}
                            alt="recipe illustration"
                            />
                        <div className="likeDiv">
                            {testRecipe.likes? (
                                <>
                                    {/* {testRecipe.likes.length}&nbsp;&nbsp;{testRecipe.likes.length ===1 ? 'LIKE' : 'LIKES'}  */}
                                    {testRecipe.likes.includes(userId)?(
                                        <div>
                                            {testRecipe.likes.length -1 ===0 ?
                                                <p><AiOutlineLike onClick={unlikeRecipe} style={{color:'#0ed4f7', fontSize:'30px'}}/> Vous aimez</p> :
                                                <p><AiOutlineLike onClick={unlikeRecipe} style={{color:'#0ed4f7', fontSize:'30px'}}/>vous et {testRecipe.likes.length -1 ===1? <span> 1 autre personne</span>:<span>{testRecipe.likes.length -1 }&nbsp;autres personnes</span>}</p>
                                            }                                           
                                        </div>
                                        // <AiOutlineLike onClick={unlikeRecipe} style={{color:'#0ed4f7', fontSize:'30px'}}/>
                                        ):
                                            <p>{testRecipe.likes && testRecipe.likes.length}&nbsp;<AiOutlineLike onClick={likeRecipe} style={{color:'grey', fontSize:'30px'}}/></p>
                                    }                                 
                                </>                                
                                ):
                                <>
                                    <p>0&nbsp;<AiOutlineLike onClick={likeRecipe} style={{color:'grey', fontSize:'30px'}}/></p>        
                                </>    
                            }  
                        </div>  
                    </div>            
                </div>
                <p style={{color:'#f00'}}>{errorLikeMsg}</p>
                <p>
                    <GiAlarmClock style={{color:'#0f0', fontSize:'32px'}}/>&nbsp;&nbsp;&nbsp;
                    <span>Preparation : {testRecipe.recipePreparationTime}&nbsp;Min</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>Cuisson : {testRecipe.recipeCookingTime}&nbsp;Min</span>
                </p> 
                {testRecipe.recipeNutriFacts && testRecipe.recipeNutriFacts.length > 0 ? (
                    <div>
                        <h5>Informations nutritionnelles pour 100 g de recette*</h5>
                        {testRecipe && testRecipe.nutriFactsStatus === "GIVED" ? 
                            (<p style={{fontSize:"small", color:"#ffff00"}}>*Infos fournis par le createur de la recette</p>):null
                        }     
                        <div className="m-4 col-md-6 col-lg-4 col-xs-10" >
                            <DoghChart nutriFacts={testRecipe && testRecipe.recipeNutriFacts}/>
                        </div>
                    </div>
                    ):null
                }   
                <h3 className="text-center">Liste des ingredients</h3>
                <div className="listIngDetailRecipe">
                    {ingredients && ingredients.map((ing, index)=> (
                        <ul className="ingr" key={index}>{ing.ingredientName}: {ing.quantity} {ing.ingredientUnity && ing.ingredientUnity} </ul>
                    ))}
                </div>
               
                {/* <p>{myRecipe.recipeDescription}</p> */}
                <div className="instructionsDetail">
                    <h4 className="text-center" >Les instructions</h4>
                    {/* <div dangerouslySetInnerHTML={{__html: currentRecipe.recipeDescription}} />  */}
                    <div dangerouslySetInnerHTML={{__html: htmlInstructions}} />      
                </div>   
            </div>
            <div>
                <button onClick={()=>generatePDFFunction()}>TELECHARGER EN PDF</button>
                {/* {generateRecipePDF()} */}
            </div>
            <div className="commentsDiv col-12" >
                <Form onSubmit={sendComment} >
                    {/* <Label for="comment">Les commentaires</Label> */}
                    <Input type="textarea" name="comment" id="comment" value={commentContent} placeholder="Votre commentaire ici..." onChange={handleChangeComment} />
                    <Button>Poster</Button>
                    <span style={{color:'red'}}>{errorComment}</span>
                </Form>
                <div style={{border:'solid 2px gold', margin:'5px'}}> 
                    {testRecipe && testRecipe.comments && testRecipe.comments.length > 0? 
                    (
                        // console.log('comments are: ',testRecipe.comments)
                        <>
                        <h4>Les commentaires</h4>
                        { testRecipe.comments.map((comment, index)=>
                            (
                                    <div key={index} style={{color:'#0ff8ff'}}>
                                        <Card id="commentCard">
                                            <div>
                                                <img
                                                    src={comment && comment.userId && comment.userId.profilePicture}
                                                    className="commentImage"
                                                    alt="comments user Illustration" 
                                                    /> 
                                                {comment.userId && comment.userId.username}&nbsp;{formatDate(comment.postedAt)}
                                            </div> 
                                            <div className="col-12" >
                                                <p className="d-inline-block col-10 ">{comment.commentText}</p>{' '}
                                                {(comment && comment.userId && comment.userId._id) === userId ? (
                                                <Button className="d-inline-block offset-1"  size="sm" id={comment._id} onClick={deleteComment}>
                                                    <GiTrashCan style={{color:'#f00', fontSize:'22px'}}/>
                                                </Button> 
                                                ): null
                                                }
                                            </div> 
                                        </Card>     
                                    </div>
                                )                                             
                            )}
                        </>                   
                    ): 
                    (
                        <div>
                            <p>Pas de commentaires, postez un</p>
                        </div>
                    ) 
                    }
                </div>
            </div>
            
            { (token && isMine)? 
            <div className="btnsDeleteUpdate">
                {/* <Button onClick={deleteThisRecipe}>Update</Button> */}
                <Link to={{pathname: `/updateRecipe/${testRecipe._id}`, state:{testRecipe}}} >
                    <Button color="warning" size="sm">Modifier cette recette</Button>
                    {/* <span style={{color:'#fff'}}>Modifier</span> */}
                </Link>
                <Button onClick={deleteThisRecipe} color="danger" size="sm">SUPPRIMER</Button>  
            </div>       
            : null}

            <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                <ModalBody>
                    {modalMessage}       
                </ModalBody>
                <ModalFooter>
                <Button color="primary"  onClick={toggle}>OK</Button>
                </ModalFooter>
            </Modal>          
        </div>        
    )
}

export default RecipeDetails;