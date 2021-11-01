import React from 'react';
// import axios from "axios";
import {Form, Input, Button} from 'reactstrap';
import "./login.css";


const SendUrlReset =(props)=>{

    // const [email, setEmail] = useState('');
    // const [errorEmailExistes, setErrorEmailExistes]= useState('');
    // const onChangeValue=(event)=>{
    //     event.preventDefault();
    //     setEmail(event.target.value)
    // };
    // console.log(email);
    // const sendUrl=async(e)=>{
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post(`http://localhost:8080/sendEmailReset/${email}`);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.log(error.response.data)
    //     }
    //     await axios.post(`http://localhost:8080/sendEmailReset/${email}`)
    //     .then((res)=>{console.log(res.data)
    //     setErrorEmailExistes(res.data.message)}
    //     )
    //     .catch((error)=>{console.log(error.message)
    //         // setErrorEmailExistes(error)
    //     })
    // }

    // console.log(props.messageResponse);
    return(
        <div>
            <h4>Modifier votre mot de passe</h4>
            <Form >
                <Input type="email" name={props.name} id="email" placeholder="Votre Email" value={props.value} onChange={props.handleChange} />
                <Button id="btn_sendUrlReset" onClick={props.sendUrl} type="submit" color="success" size="sm">Envoyer</Button>
                <span style={{color:'#f00'}}>{props.messageResponse && props.messageResponse}</span>
                <span style={{color:'#f00'}}>{props.errorEmailReset}</span>
            </Form>
            
        </div>
        
    )
}

export default SendUrlReset;