import React, {useState, useEffect} from 'react';
import axios from "axios";
import {useHistory} from "react-router-dom"
import {FormGroup, Input, Button, Form} from 'reactstrap';
import jwt from "jsonwebtoken";


const ResetPassword =(props)=>{

    const [submitError, setSubmitError] = useState('');
    const [resResetMessage, setResResetMessage] = useState('');
    const [tokenExpired, setTokenExpired] = useState(false);
    const history = useHistory();
    const {id, token} = props.match.params;
    // console.log(props.match.params)

    const [form, setForm] = useState({
        newPassword:"",
        newPasswordConfirm: "",
        errors:{
            passwordError: "",
            passwordConfirmError: ""
        }
    })

    // const decodedToken = decode(token);
    useEffect(() => {
        const {id, token} = props.match.params;
        // console.log(token);
       if(token){
           const decodedToken = jwt.decode(token);
        //    console.log(decodedToken.exp*1000);
        //    console.log(new Date().getTime());
           if(decodedToken.exp * 1000 < new Date().getTime()){
               setTokenExpired(true);
           }
       }
    }, []);

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

    const resetPassword=async(e)=>{
        e.preventDefault();
        try {
            const newPassword = form.newPassword;
            const newPasswordConfirm = form.newPasswordConfirm;   
            // console.log(form);
            const data = {
                newPassword: form.newPassword,
                newPasswordConfirm: form.newPasswordConfirm
            }
            // console.log(newPassword);
            // console.log(newPasswordConfirm);
            if(newPassword && newPasswordConfirm){
                // console.log('test Reset function')
                const headers = {
                    Accept:'*/*',
                    'content-type':'application/json' 
                    };
                // const response = await axios.put(`https://mern-recipes.herokuapp.com/reset/change-password/${id}/${token}`, data, {headers} );
                const response = await axios.put(`http://localhost:8080/reset/change-password/${id}/${token}`, data, {headers} );
                // console.log(response.data);
                setResResetMessage(response.data.message);
                // setTimeout(() => {
                //     history.push('/login');       
                // }, 4000);
                setTimeout(() => {
                    setForm({
                        ...form,
                        newPassword:"",
                        newPasswordConfirm: "",
                    });
                    // setIsOpen(false); implemente later with modal
                    history.push('/login')
                }, 4000);
                // setSuccessMsg('');    
            }else{
                setSubmitError('Vous devez remplir tous les champs')
            }   
        } catch (error) {
            // console.log(error && error.response && error.response.data.message);
            // setErrorResetMessage(error.response.data.message)
            setResResetMessage(error.response.data.message)
        }  
    }

    // console.log(resResetMessage);
    // tokenExpired?
    return(
        <div>
            {tokenExpired ?
               ( 
                   <>
                    <h3>Lien n'est plus valide, Token expired, refaire une demande de reset</h3>
                    <p style={{color:'#fff'}}>Reponse de serveur : {resResetMessage && resResetMessage}</p>
                   </>               
                ):
               (
                   <>
                <h3>Form reste password</h3>
                <Form onSubmit={resetPassword}>
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
                    <p style={{color:'#000'}}>{resResetMessage && resResetMessage}</p>
                </Form>
                </>    
               )
            }
            
        </div>
    )
}

export default ResetPassword;