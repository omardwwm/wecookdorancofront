import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from "react-redux";
import {deletUser} from "../../redux/actions/UserActions";
import {useHistory} from "react-router-dom";
import {changePassword, getUserMetaData} from "../../redux/actions/UserActions";
import {Card, CardText, CardBody, CardTitle, Button, Collapse, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import axios from 'axios';
import avatar from "../../../src/assets/avatar-unisex.png";
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
import "./profile.css";


const Profile = ()=>{
    const {REACT_APP_WECOOK_API_RENDER} = process.env;
    const dispatch = useDispatch();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('myUser'));
    // const [userData, setUserData] = useState([]);
    const userData = useSelector(state => state.userReducer.userMetaData);
    const token = localStorage.getItem('userToken');
    const userId = (user && user.id) ? user.id : user && user._id;
    const [newProfilePicture, setNewProfilePicture] = useState("");
    // console.log(user);
    // const [successMsg, setSuccessMsg] = useState(useSelector(state=>state.userReducer.successMsgPasswordChange));
    const successMsg = useSelector(state=>state.userReducer.successMsgPasswordChange);
    const modalBody = useSelector(state=>state.userReducer.modalBodyDeleteUser);
    const [modal, setModal] = useState(false);
    const [test, setTest] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [errorUpdateImg, setErrorUpdateImg] = useState('');
    const [form, setForm] = useState({
        newPassword:"",
        newPasswordConfirm: "",
        errors:{
            passwordError: "",
            passwordConfirmError: ""
        }
    });

    // console.log(userData.userMetaData && userData.userMetaData);
    const [formUserData, setFormUserData] = useState({
        userPresentation:'',
        userEstablissement:'',
        userKitchenStyle:''
    });

    const [newFormUserData, setNewFormUserData] = useState({
        newUserPresentation:'',
        newUserEstablissement:'',
        newUserKitchenStyle:''
    });
    const [newKitchenTypes, setNewKitchenTypes] = useState([]);
    useEffect(()=>{
        if(userData.userMetaData){
            setNewFormUserData({
                ...newFormUserData,
                newUserPresentation:userData.userMetaData.userPresentation,
                newUserEstablissement:userData.userMetaData.userEstablissement,
                newUserKitchenStyle:''
            });
            setNewKitchenTypes(userData.userMetaData.userKitchenStyles)
        }
    }, [userData])
// console.log(newKitchenTypes);
    const toggleModal = () =>{
        setModal(!modal);
    } 
     // config
     const config = {headers: {
        Accept:'*/*',
        'Content-Type': 'multipart/form-data; application/json; boundary=<calculated when request is sent>',
        "x-auth-token":`${token}`
    }};
    // const config = {headers: {
    //     Accept:'application/json, text/plain, */*',
    //     'Content-Type': '*',
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [isPicOpen, setIsPicOpen] = useState(false);
    const togglePic = () => setIsPicOpen(!isPicOpen);
    const [isPresentationOpen, setIsPresentationOpen]=useState(false)
    const togglePresentation = ()=> setIsPresentationOpen(!isPresentationOpen);
    const deleteMyAccount =()=>{
        // console.log(token);
        const myCurrentProfilePicture = user.profilePicture;
        if(window.confirm('Vous etes sur de vouloir supprier votre compte?')){
            dispatch(deletUser(userId, myCurrentProfilePicture, token)).then(setModal(true)).then(()=>setTimeout(() => {
                history.push("/");
                setModal(false);
                }, 4000))
            }      
    }

    const onchangeUserData =(event) =>{
        event.preventDefault();
        const { name, value} = event.target; 
        setFormUserData({
            ...formUserData,
            [name]: value
        })

    }

    const onchangeNewUserData =(event)=>{
        event.preventDefault();
        const { name, value} = event.target;
        setNewFormUserData({
            ...newFormUserData,
            [name]: value
        })
    }
    const onChangeValue=(event)=>{
        event.preventDefault();
        const { name, value} = event.target; 
        let errors = form.errors;
        setSubmitError('')
        switch (name) {
            case 'newPassword': 
              errors.passwordError = 
                value.length < 6
                  ? 'Password must be 6 characters long!'
                  : '';
              break;
            case 'newPasswordConfirm':
                errors.passwordConfirmError =
                form.newPassword !== value ? 
                'Password must be the same' :
                '';
                break;
            default:
              break;
          }
        setForm({
            ...form,
            errors, [name]:value
        })
        // console.log(form)
    }

    const selectImage = (event)=>{
        event.preventDefault();
        setErrorUpdateImg('');
        setNewProfilePicture(event.target.files[0]);     
    }

// add type kitchen
const [kitchenTypes, setKitchenTypes] = useState([]);
const [kitchenDtyelError, setKitchenDtyelError] = useState('');
const addKitchenTypes =(event)=>{
    event.preventDefault();
    if(userData.userMetaData){
        if(newFormUserData.newUserKitchenStyle ===""){
            setKitchenDtyelError("Vous devez saisir un style de cuisine avant de l'ajouter")
        }else{
            const newType = newFormUserData.newUserKitchenStyle;
            const newTypes = [...newKitchenTypes, newType];
            setNewKitchenTypes(newTypes);
            setNewFormUserData({
                ...newFormUserData,
                newUserKitchenStyle:''
            })
            setKitchenDtyelError("");
        }      
    }else{
        if(formUserData.userKitchenStyle ===""){
            setKitchenDtyelError("Vous devez saisir un style de cuisine avant de l'ajouter")
        }else{
            const newKitchenType = formUserData.userKitchenStyle;
            const newKitchenTypes = [...kitchenTypes, newKitchenType];
            setKitchenTypes(newKitchenTypes);
            setFormUserData({
                ...formUserData,
                userKitchenStyle:''
            })
            // setIngredientName("");
            setKitchenDtyelError("");
        }      
    }
} 

const removeKitchenType =(index)=>{
    if(userData.userMetaData){
        let filtredArray = [...newKitchenTypes];
        if(index > -1){
           filtredArray.splice(index, 1) 
        }
        setNewKitchenTypes(filtredArray);
    }else{
        let filtredArray = [...kitchenTypes];
        filtredArray.splice(index, 1)
        setKitchenTypes(filtredArray);
        }
}
// send userData
const sendUserData =async(e)=>{
    e.preventDefault();
    try {
        // const kitchenTypesToSend = JSON.stringify(kitchenTypes);
        // const userDataForm = new FormData();
        // userDataForm.append('userPresentation',formUserData.userPresentation);
        // userDataForm.append('userKitchenStyles',kitchenTypes );
        // userDataForm.append('userEstablissement',formUserData.userEstablissement);
        const data = { 
                userPresentation : formUserData.userPresentation,
                userKitchenStyles : kitchenTypes,
                userEstablissement: formUserData.userEstablissement  
        }
        const response = await axios.post(`${REACT_APP_WECOOK_API_RENDER}/users/metadata/add/${userId}`, data, { headers: {
            Accept:'*/*',
            'Content-Type': 'application/json',
            "x-auth-token":`${token}`
            }
        });
        // console.log(response);
        dispatch(getUserMetaData(userId))
        // userMetaData();
        // console.log(formUserData);
        // console.log(kitchenTypes);
    } catch (error) {
        console.log(error);
    }

} 
// UpdateUserMetaData
const updateUserMetaData=async(e)=>{
    e.preventDefault();
    e.preventDefault();
    try {
        const data = {
                userPresentation : newFormUserData.newUserPresentation,
                userKitchenStyles : newKitchenTypes,
                userEstablissement: newFormUserData.newUserEstablissement  
        }
        const response = await axios.put(`${REACT_APP_WECOOK_API_RENDER}/users/metadata/update/${userId}`, data, { headers: {
            Accept:'*/*',
            'Content-Type': 'application/json',
            "x-auth-token":`${token}`
            }
        });
        // console.log(response);
        dispatch(getUserMetaData(userId))
        // userMetaData();
        setTimeout(() => {
            setIsPresentationOpen(false)
        }, 1500);
        // console.log(formUserData);
        // console.log(kitchenTypes);
    } catch (error) {
        console.log(error);
    }
}
// get user metaData
// const userMetaData = async()=>{
//     await axios.get(`https://mern-recipes.herokuapp.com/users/metadata/${userId}`).then(response=>{
//         // console.log(response);
//         setUserData(response.data);
//     })
// }
// console.log(userData)
    useEffect(()=>{
        setTest(successMsg);
    }, [successMsg]);
    // console.log('testIs: ', test)
    const updatePassword=async(e)=>{
        e.preventDefault();
        const newPassword = form.newPassword;
        const newPasswordConfirm = form.newPasswordConfirm;
        const userId = user.id
        if(newPassword && newPasswordConfirm){
            // console.log(successMsg);
            dispatch(changePassword(userId, token, newPassword, newPasswordConfirm));
            setTimeout(() => {
                setForm({
                    ...form,
                    newPassword:"",
                    newPasswordConfirm: "",
                });
                setTest('');
                setIsOpen(false);
                // history.push('/')
            }, 4000);
            // setSuccessMsg('');    
        }else{
            setSubmitError('Vous devez remplir tous les champs')
        }   
    }

    // Function to update image of profile
    const [msgUpdateImgSuccess, setMsgUpdateImgSuccess] = useState('')
    const sendNewImage=async(e)=>{
        e.preventDefault();
        
        const formData = new FormData();
        if(newProfilePicture){
            formData.append('profilePicture',newProfilePicture);
            formData.append('oldProfilePicture',user.profilePicture);

             await axios.put(`${REACT_APP_WECOOK_API_RENDER}/users/updatePicture/${userId}`, formData, config)
            .then(res=>{
                // console.log(res);
                setMsgUpdateImgSuccess(res.data.message);
                localStorage.setItem('myUser', JSON.stringify(res.data.updatedUser))
            }).then(()=>setTimeout(() => {
                setIsPicOpen(false);
                setMsgUpdateImgSuccess('');
            }, 3000))
        }else{
            // formData.append('oldProfilePicture',user.profilePicture); 
            setErrorUpdateImg('Vous devez choisir une image')
        }
    }
    // console.log(msgUpdateImgSuccess);

    useEffect(()=>{
        JSON.parse(localStorage.getItem('myUser'));
        localStorage.getItem('userToken');
        dispatch(getUserMetaData(userId))
        // userMetaData();
        setTest('');   
    }, [])

    // console.log('successMessage is:', successMsg); 
    // console.log(submitError);
    // console.log(modalBody);
    return(
        <>
            <h2>Mes infos</h2>
            <Card id="profileCardParent" >
                <Card className="profileCard col-md-7 col-xs-12">
                    <CardBody>
                        <CardTitle tag="h5">{user.username}</CardTitle>
                        <CardText>Email: {user.email}</CardText>
                        <img className="imgCard"
                            // src={`https://mern-recipes.herokuapp.com${user.profilePicture}`}
                            src={user.profilePicture? user.profilePicture : avatar}
                            alt="user pictureProfile"
                            />
                        <Button onClick={togglePic} size="sm">Changer votre photo</Button>
                        <Collapse isOpen={isPicOpen}>
                            <Card className="collapsCard col-md-11 col-sm-12">
                                <CardBody>
                                <Form onSubmit={sendNewImage}>
                                    <FormGroup>
                                        <Label for="newProfilePicture">Choisir une autre photo</Label>
                                        <Input type="file" name="newProfilePicture" id="newProfilePicture" placeholder="Select a picture" onChange={selectImage}/>
                                        <CardText>{msgUpdateImgSuccess}</CardText>
                                        <CardText style={{color:'#0f0'}}>{errorUpdateImg}</CardText>
                                        <Button id="btn_newPicture" type="submit" color="primary" size="sm">Envoyer</Button>
                                    </FormGroup>
                                </Form>
                                </CardBody>
                            </Card>
                        </Collapse>
                        <Button onClick={toggle} color="warning" size="sm">Modifier mon mot de passe</Button>
                        <Collapse isOpen={isOpen}>
                            <Card className="collapsCard col-md-9 col-sm-12">
                                <CardBody>
                                    <Form onSubmit={updatePassword}>
                                        <FormGroup>
                                            {/* <Label for="examplePassword">Nouveau mot de passe</Label> */}
                                            <Input type="password" name="newPassword" id="examplePassword" placeholder="Entrer le nouveau mot de passe" value={form.newPassword} onChange={onChangeValue} />
                                            {form.errors.passwordError ? 
                                            <div style={{color:'red'}}>
                                                {form.errors.passwordError}
                                            </div>:
                                            null}                                   
                                        </FormGroup>
                                        <FormGroup>
                                            {/* <Label for="examplePasswordConfirm">Confirmer le Nouveau mot de passe</Label> */}
                                            <Input type="password" name="newPasswordConfirm" id="examplePasswordConfirm" placeholder="Confirmation du mot de passe" value={form.newPasswordConfirm} onChange={onChangeValue} />
                                            {form.errors.passwordConfirmError ? 
                                            <div style={{color:'red'}}>
                                                {form.errors.passwordConfirmError}
                                            </div>:
                                            null}
                                        </FormGroup>
                                        <p style={{color:'#f0f'}}>{submitError && submitError}</p>
                                        
                                        <Button id="btn_password" type="submit" color="primary" size="sm">Envoyer</Button>
                                        <p style={{color:'#000'}}>{test && test}</p>
                                    </Form>    
                                </CardBody>
                            </Card>
                        </Collapse>
                    </CardBody>   
                </Card>
                <Card className="presentationCard col-md-5 col-xs-12" >
                    <CardBody>
                        <CardText>Infos complementaires.</CardText>
                        {userData.userMetaData ? (
                            <>
                                <CardText>A propos de moi:</CardText>
                                <CardText>{userData.userMetaData && userData.userMetaData.userPresentation}</CardText>
                                <>Mes Specialites et influences culinaires:{userData.userMetaData.userKitchenStyles && userData.userMetaData.userKitchenStyles.map((style, index)=>
                                    <ul key={index}>
                                        <li> 
                                            {style}
                                        </li>
                                    </ul>
                                )}</>
                                {userData.userMetaData && userData.userMetaData.userEstablissement?
                                    (<CardText>Mon etablissement:<br/>{userData.userMetaData.userEstablissement}</CardText>):
                                    null
                                } 
                                <Button onClick={togglePresentation} color="warning" size="sm">Modifier mes info culinaires</Button>
                                <Collapse isOpen={isPresentationOpen}>
                                    <Card>
                                        <CardBody>
                                            <Form encType="multipart/form-data" onSubmit={updateUserMetaData}>
                                                <FormGroup>
                                                    <Input type="textarea" name="newUserPresentation" id="newUserPresentation" value={newFormUserData.newUserPresentation} onChange={onchangeNewUserData} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input type="text" name="newUserKitchenStyle" id="userKitchenStyle" placeholder="entrer une specialite" value={newFormUserData.newUserKitchenStyle} onChange={onchangeNewUserData} />
                                                </FormGroup>
                                                <Button className="mb-4" onClick={addKitchenTypes}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter un type de cuisine</Button>
                                                {kitchenDtyelError?(
                                                    <div style={{color:'red'}}>
                                                        <p>{kitchenDtyelError}</p>
                                                    </div>
                                                )
                                                :null}
                                                {newKitchenTypes && newKitchenTypes.length >0 ?
                                                    (<div className=" p-0 m-auto col-sm-12 col-lg-9" style={{color:'#000'}}>
                                                        <h5>Aperçu des specialites</h5>
                                                        <ol>
                                                            {newKitchenTypes.map((type, index)=>(
                                                                <div className="p-0 m-0" key={index}>
                                                                    <li className="d-inline-block">
                                                                        {type}
                                                                        <Button className="btnRemoveIngr" onClick={()=>removeKitchenType(index)}><RiDeleteBin6Fill /></Button>
                                                                    </li>
                                                                </div>                       
                                                            ))}
                                                        </ol>
                                                    </div>) : null
                                                }
                                                <FormGroup>
                                                    <Input type="text" name="newUserEstablissement" id="userEstablissement" value={newFormUserData.newUserEstablissement} onChange={onchangeNewUserData} />
                                                </FormGroup>
                                                <Button id="btn_updateMesInfosProfile" type="submit" color="primary" size="sm">Mettre a jour mes infos</Button>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </>
                            ):<div>
                                Completer votre profil
                                <Form encType="multipart/form-data" onSubmit={sendUserData}>
                                    <FormGroup>
                                        <Input type="textarea" name="userPresentation" id="userPresentation" placeholder="Presentez vous" value={formUserData.userPresentation} onChange={onchangeUserData} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input type="text" name="userKitchenStyle" id="userKitchenStyle" placeholder="Votre type de cuisine" value={formUserData.userKitchenStyle} onChange={onchangeUserData} />
                                    </FormGroup>
                                    <Button className="mb-4" onClick={addKitchenTypes}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/>Ajouter un type de cuisine</Button>
                                    {kitchenDtyelError?(
                                        <div style={{color:'red'}}>
                                            <p>{kitchenDtyelError}</p>
                                        </div>
                                    )
                                    :null}
                                    {kitchenTypes.length >0 ?
                                        (<div className="listIng p-0 m-auto col-sm-12 col-lg-9">
                                            <h5>Aperçu des specialites</h5>
                                            <ol>
                                                {kitchenTypes.map((type, index)=>(
                                                    <div className="p-0 m-0" key={index}>
                                                        <li className="d-inline-block ">
                                                            {type}
                                                            <Button className="btnRemoveIngr" onClick={removeKitchenType}><RiDeleteBin6Fill /></Button>
                                                        </li>
                                                    
                                                    </div>                       
                                                ))}
                                            </ol>
                                        </div>) : null
                                    }
                                    <FormGroup>
                                        <Input type="text" name="userEstablissement" id="userEstablissement" placeholder="votre restaurent" value={formUserData.userEstablissement} onChange={onchangeUserData} />
                                    </FormGroup>
                                    <Button type="submit" color="primary" size="sm">Envoyer</Button>
                                </Form>
                            </div>
                        }
                        
                    </CardBody>
                </Card>
            </Card>
            {/* <div> */}         
                <Button onClick={deleteMyAccount} color="danger" size="sm">Supprimer mon compte</Button>
            {/* </div> */}
            <Modal isOpen={modal} toggle={toggleModal} >
                    <ModalHeader toggle={toggleModal}>Triste de vous voir partir</ModalHeader>
                    <ModalBody>
                        {modalBody && modalBody}       
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={toggleModal}>OK</Button>{' '}
                    </ModalFooter>
                </Modal>
        </>
    )
} 

export default Profile;