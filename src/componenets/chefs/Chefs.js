import React, { useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardSubtitle, CardText} from "reactstrap";
import {getProfessionnals} from "../../redux/actions/UserActions";
import avatar from "../../../src/assets/avatar-unisex.png";
import "./chefs.css";



const Chefs = ()=>{

    const token = localStorage.getItem('userToken');
    const config = {headers: {
        'Authorisation': `Bearer ${token}`,
        "x-auth-token":`${token}`
    }};

    const dispatch = useDispatch();
    const allProfessionals = useSelector(state=>state.userReducer.professionnals);
    console.log(allProfessionals);

   useEffect(()=>{
       dispatch(getProfessionnals(config));  
   }, [])

    return (
        <div className="chefsDiv " >
            <h2>Nos chefs</h2>
            {allProfessionals && allProfessionals.map((chef, index)=>{
                return (
                    <Card className="chefCrad col-md-3" key={index}>
                        <Link to={{pathname: `/chef/${chef._id}`, state:{chef}}}>
                            <CardTitle style={{color:'#fff', textAlign:'center'}}>
                                {chef.username} 
                            </CardTitle>
                            <img className="img-fluid chefPic"
                                // src={`https://mern-recipes.herokuapp.com${chef.profilePicture}`}
                                src={chef.profilePicture? chef.profilePicture : avatar}
                                alt="illustration-profile-chef"
                            />
                            {chef.recipes.length ===0 ?(
                                <CardText className="textCard">
                                    0 recettes
                                </CardText>
                            ):chef.recipes.length ===1?(
                                <CardText className="textCard">
                                    1 recette
                                </CardText>
                            ):
                                <CardText className="textCard">
                                    {chef.recipes.length} recettes
                                </CardText>
                            }        
                        </Link>            
                    </Card>
                )
            })}
        </div>
    )
}

export default Chefs;