import React from 'react';
import {FormGroup, Label ,Input} from 'reactstrap';

const Conditions = (props)=>{
   
    return (
        <div className="m-4">
            <h2>Conditions d'utilisation et traitement des donnees</h2>
            <p style={{color:'#00f'}}>
            These Terms of Service (“Terms”) are a contract between you and this website. They govern your use of My site (wecook), services, mobile apps, products, and content (“Services”).
            By using this cooking/recipes, you agree to these Terms. If you don’t agree to any of the Terms, you can’t use wecook.

            By using wecook, you agree to these Terms. If you don’t agree to any of the Terms, you can’t use wecook.

            We can change these Terms at any time. We keep a historical record of all changes to our Terms. If a change is material, we’ll let you know before they take effect. By using this website on or after that effective date, you agree to the new Terms. If you don’t agree to them, you should delete your account before they take effect, otherwise your use of the site and content will be subject to the new Terms.
            </p>
            <p style={{color:'#f00'}}>
                Ne pas prendre en considération ce texte que j'ai adapté juste pour la forme.
            </p>
            <FormGroup check>
                <Label check>
                <Input type="checkbox" onClick={props.onClick}/>{' '}
                  J'accepte   <br></br>
                {/* <Button color="secondary" style={{margin:5}} onClick={}>Learn more about our policy</Button> */}
                </Label>
            </FormGroup>

        </div>
    )
}

export default Conditions;