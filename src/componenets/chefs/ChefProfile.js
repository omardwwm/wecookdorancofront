import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getUserMetaData} from "../../redux/actions/UserActions";
import { Link } from "react-router-dom";
import {Card, CardText, CardBody, CardTitle,CardSubtitle, Button, Collapse} from 'reactstrap';
import avatar from "../../../src/assets/avatar-unisex.png";
import "./chefProfile.css";


const ChefProfile =(props)=>{

    const userId = props.match.params._id;
    // console.log(userId);
    const dispatch = useDispatch();
    const userData = useSelector(state => state.userReducer.userMetaData);
    console.log(userData);
    useEffect(()=>{
        dispatch(getUserMetaData(userId))
    }, [])

    return(
        <div className="col mt-2 py-3">

            <Card className="infos  ">
                <CardText className="profileChefName">{userData.username}</CardText> 
                <img className="imgCard"
                    src={userData.profilePicture? userData.profilePicture : avatar}
                    alt="user pictureProfile"
                />
                <CardText><span className="titleSpan">A propos de chef</span><br/>
                    {(userData.userMetaData && userData.userMetaData.userPresentation) ? (
                        <CardText>
                           { userData.userMetaData.userPresentation}
                        </CardText>
                        ):
                        <CardText>
                            A venir (le chef n'a pas encore coplété sa présentasion)
                        </CardText>
                    }
                </CardText>
                <CardText><span className="titleSpan">Ses Specialites et influences culinaires:</span>
                    {userData.userMetaData && userData.userMetaData.userKitchenStyles ? (
                        <CardText>
                            {userData.userMetaData && userData.userMetaData.userKitchenStyles && userData.userMetaData.userKitchenStyles.map((style, index)=>
                                <ul key={index}>
                                    <li> 
                                        {style}
                                    </li>
                                </ul>
                        )}
                        </CardText>
                        ):
                        <CardText>
                             A venir (le chef n'a pas encore coplété son profil)
                        </CardText>
                    }   
                </CardText>
                <CardText>
                    {userData.userMetaData && userData.userMetaData.userEstablissement?
                        (<CardText><span className="titleSpan">Son établissement:</span><br/>{userData.userMetaData.userEstablissement}</CardText>):
                        <CardText><span className="titleSpan">Son établissement:</span><br/>Le chef n'a pas communiqué d'etablissement</CardText>
                    } 
                </CardText>
            </Card>

            <Card className="profileRealisations mt-3 col-12 ">
                <CardTitle className="titleSpan" style={{color:'#000', textAlign:'center'}}>Ses réalisations</CardTitle>
                {userData.recipes && userData.recipes.length <= 0?(
                    <>
                        <Card className="profileEmptyRecipeCard">
                            <CardTitle>Ce chef n'a pas encore posté de recettes</CardTitle>
                        </Card>
                    </>                               
                    ):(
                        <div >
                            {userData.recipes && userData.recipes.map((recipe, index)=>{
                                return (
                                    <Card key={index} className="profileRecipeCard d-inline-block col-md-5" >
                                            <CardTitle id="profileTitleCardRealisation">{recipe.recipeName}</CardTitle>
                                            <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}} className="profileLinkRecipe">
                                                <img src={recipe.recipePicture} className="profileRecipeImg" alt="illustration-recipe" />
                                                <CardSubtitle className="subtitleCard">{recipe.recipeCategory}</CardSubtitle>
                                            </Link>
                                    </Card>                       
                                )
                            })}
                        </div>
                    )
                }
            </Card>
            
        </div>
    )
}


export default ChefProfile;