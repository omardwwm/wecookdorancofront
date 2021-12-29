import React, {useState, useEffect} from "react";
// import axios from "axios";
import { useDispatch, useSelector} from "react-redux";
import {registerUser, showConditionsPolicy} from "../../redux";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {useHistory} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Conditions from '../conditions/Conditions';
// import imgRegister from '../../images/signup-reg.jpg';
// import badReqImg from '../../images/400-bad-request-.jpg';
import './Signup.css';


const Signup =(props)=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password:"",
        passwordConfirm: "",
        role: [],
        isPro: false,
        errors:{
            usernameError: "",
            emailError: "",
            passwordError: "",
            passwordConfirmError: ""
        }
    })
    // const showModale = useSelector(state => state.userReducer.showModale)
    // console.log(showModale);
    const modalImage = useSelector(state => state.userReducer.modalImage)
    const [modal, setModal] = useState(false);
    const toggle = () =>{
        // setModal(!showModale);
        setModal(!modal);
    } 
    // const [modalBody, setModalBody] = useState("");
    const modalBody = useSelector(state=>state.userReducer.modalBody)
    // const [ModalTitle, setModalTitle] = useState("");
    const modalTitle = useSelector(state=> state.userReducer.modalTitle);
    const modalButtonDisabled = useSelector(state=>state.userReducer.modalButtonDisabled);
    const isUserLogged = useSelector(state=>state.userReducer.isUserLogged);
    const [loginCheckMessage, setLoginCheckMessage] = useState('');
    // const [modalButtonDisabled, setModalButtonDisabled] = useState(false)
    // const [myImage, setMyImage] = useState(modalImage)
    const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
    const [profilePicture, setProfilePicture] = useState("");

    const onChangeValue=(event)=>{
        event.preventDefault();
        // TODO: add checkbox to form
        // const isCheckBox = event.target.type === "checkbox";
        // console.log(event.target.name);
        const { name, value} = event.target; 
        let errors = form.errors;
        switch (name) {
            case 'username': 
              errors.usernameError = 
                value.length < 5
                  ? 'Username doit contenir 4 caracters min!'
                  : '';
              break;
            case 'email': 
              errors.emailError = 
                validEmailRegex.test(value)
                  ? ''
                  : 'Email n\'est pas valid!';
              break;
            case 'password': 
              errors.passwordError = 
                value.length < 6
                  ? 'Mot de passe doit avoir au min 6 caracters!'
                  : '';
              break;
            case 'passwordConfirm':
                errors.passwordConfirmError =
                form.password !== value ? 
                'les mots de passes doivent etre identiques' :
                '';
                break;
            default:
              break;
          }
        setForm({
            ...form,
            errors, [name]:value
        })
            // (
            //     setForm({
            //         ...form,
            //         isPro: ! form.isPro
            //     })
            //   ):               
            //       setForm({
            //           ...form,
            //           errors, [name]: value
            //       })
              

        // console.log("myfinalformis", form);
    };

    const onCheckCheckBox =()=>{
        setForm({
            ...form,
            isPro:!form.isPro
        })
        // console.log("myfinalformis", form);
    }

    const selectImage = (event)=>{
        event.preventDefault();
        setProfilePicture(event.target.files[0]);
       
    }

    const [conditionsAccepted, setConditionsAccepted] = useState(false)

    const accepteCoditions =()=>{
        setConditionsAccepted(!conditionsAccepted)    
    }
    
    const showConditions = ()=>{
        dispatch(showConditionsPolicy());
        setModal(true);
        // setModal(true)
        // setModalTitle('Our policy confidential')
        // setModalButtonDisabled(true)
        // setModalBody(<Conditions onClick={()=>setModalButtonDisabled(!setModalButtonDisabled)} />)  
    }
// check if all form fields are complete
const checkCompleteFields =()=>{
    let formIsValid = true;
    if(!form.email){
        formIsValid = false;
        form.errors.emailError = 'L\'adresse mail est obligatoire';
    };
    if(!form.username){
        formIsValid = false;
        form.errors.usernameError = 'Ce champs est obligatoire';
    };
    if(!form.password){
        formIsValid = false;
        form.errors.passwordError = 'Le mot de passe est obligatoire';
    };
    if(!form.passwordConfirm){
        formIsValid = false;
        form.errors.passwordConfirmError = 'Vous devez confirmer le mot de passe';
    }
    return formIsValid;
}

    const userCreate = (event)=>{
        event.preventDefault();
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }};
        const formData = new FormData();
        formData.append('username',form.username);
        formData.append('email',form.email);
        formData.append('password',form.password);
        formData.append('passwordConfirm',form.passwordConfirm);
        formData.append('profilePicture',profilePicture);
        // formData.append('role',form.role);
        formData.append('isPro', form.isPro);
        if(checkCompleteFields()){
            dispatch(registerUser(formData, config));
            setModal(true);
            localStorage.getItem("userToken");
            // setTimeout(() => {
            //     setModal(false);
            //     history.push("/recipes");
            // }, 2500)
            if(isUserLogged){
                setTimeout(() => {
                    setModal(false);
                    history.push("/recipes");
                }, 2500)
            }
        }else{
            setLoginCheckMessage('Vous devez renseigner tous les champs !')
        }
        // console.log(isUserLogged);
    }
    useEffect(()=>{
        if(isUserLogged){
            setTimeout(() => {
                setModal(false);
                history.push("/recipes");
            }, 2500)
        }
    }, [isUserLogged])
    // console.log(isUserLogged);
    useEffect(()=>{
        localStorage.getItem("userToken");
        // setModal(showModale);
        setForm({
            ...form
        })
    }, [])

    // console.log(form.isPro);
    return(
        <div className="divInscription col-xs-12 col-sm-10 col-md-6 col-lg-5">
            {/* <div className="row"> */}
                <div className=" m-3">
                    <h2>CREER VOTRE COMPTE</h2>
                    <Form className="" onSubmit={userCreate} encType="multipart/form-data">
                        <FormGroup>
                            <Label for="exampleUsername">Username</Label>
                            <Input type="text" name="username" id="exampleUsername" placeholder="Choisir un Username" value={form.username} onChange={onChangeValue}/>
                        </FormGroup>
                        {form.errors.usernameError ? 
                            <div style={{color:'red'}}>
                                {form.errors.usernameError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Votre email" value={form.email} onChange={onChangeValue}/>
                        </FormGroup>
                        {form.errors.emailError ? 
                            <div style={{color:'red'}}>
                                {form.errors.emailError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="examplePassword">Mot de passe</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Votre mot de passe" value={form.password} onChange={onChangeValue} />
                        </FormGroup>
                        {form.errors.passwordError ? 
                            <div style={{color:'red'}}>
                                {form.errors.passwordError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="examplePasswordConfirm">Confirmer le mot de passe</Label>
                            <Input type="password" name="passwordConfirm" id="examplePasswordConfirm" placeholder="Confirmer votre mot de passe" value={form.passwordConfirm} onChange={onChangeValue} />
                        </FormGroup>
                        {form.errors.passwordConfirmError ? 
                            <div style={{color:'red'}}>
                                {form.errors.passwordConfirmError}
                            </div>:
                             null}

                        <FormGroup>
                            <Label for="profilePicture">Image de profile</Label>
                            <Input type="file" name="profilePicture" id="profilePicture" placeholder="Select a picture" onChange={selectImage}/>
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="exampleSelectMulti">Role choice</Label>
                            <Input type="select" name="role" id="exampleSelectMulti" multiple onChange={onChangeValue}>
                                <option value={"ROLE_USER"}>user</option>
                                <option value={"ROLE_ADMIN"}>admin</option>
                            </Input>
                        </FormGroup> */}
                        <FormGroup style={{margin:'20px', padding:'10px'}}>
                            <Label  >
                                <Input 
                                type="checkbox" label="isPro" name="isPro" id="isPro" checked={form.isPro} onChange={onCheckCheckBox}
                                /> 
                                 Etes vous un professionnel ou un chef <br></br>                       
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="checkbox" onClick={accepteCoditions}/>{' '}
                                Accepter nos conditions <br></br>
                            <Button color="secondary" style={{margin:5}} onClick={showConditions}>POLITIQUE ET CONFIDENTIALITE</Button>
                            </Label>
                        </FormGroup>
                        <Button id="btn_inscription" type="submit"  color="primary" disabled={!conditionsAccepted}>
                        Inscription 
                        <br></br>{conditionsAccepted===false? <p style={{color:'#f8d404'}}>Vous devez accepter les conditions</p>:null}
                        </Button>
                        <span style={{color:'#f00'}}>{loginCheckMessage}</span>
                    </Form>
                </div> 
            {/* </div>   */}
            {/* <div> */}
                <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                    <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {modalTitle !== 'Our policy confidential' ?
                        <div className="divImage">
                            <img className="modalImage" src={modalImage} alt="pictur response" />
                        </div>: null   
                        }
                        {modalBody}       
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" disabled={modalButtonDisabled} onClick={toggle}>OK</Button>{' '}
                    {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                    </ModalFooter>
                </Modal>
            {/* </div> */}

        </div>

    )
}

export default Signup;