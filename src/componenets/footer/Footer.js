import React from "react";
import {ImLinkedin2} from 'react-icons/im';
import {Card, Button, Accordion} from 'react-bootstrap';
import {MdContactMail} from "react-icons/md";
import "./footer.css";


const Footer = ()=>{
    return(
        <div className="footerDiv col-12 align-items-center ">
            {/* <div className="row"> */}
                {/* <div className=""> */}
                    <div className="col-7 ">
                        <span>Tous droits réservés.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>&copy; 2021 WECOOK.</span>
                    </div>
                    <div className="contacts pr-0">
                        <Accordion>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0" className="accordionBtn">
                                        <MdContactMail style={{color:'#fff', fontSize:'22px'}}/>&nbsp;&nbsp;
                                        <ImLinkedin2 style={{color:'#fff', fontSize:'22px'}}/>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse className="footerCollaps" eventKey="0">
                                    <Card.Body>
                                        <div className="social-icons2">
                                            <a className="social-icon2 icon-linked2"
                                                href="https://www.linkedin.com/in/omar-boudraa-75818039/">
                                                <ImLinkedin2 style={{color:'#fff', fontSize:'22px'}}/>
                                            </a>
                                        </div> 
                                            
                                        <a className="mail" href="mailto:boudraa.omar@gmail.com">
                                            <strong>boudraa.omar@gmail.com</strong>
                                        </a>
                                    </Card.Body>
                                </Accordion.Collapse>    
                            </Card>
                        </Accordion>
                    </div>
                {/* </div> */}
            {/* </div> */}
        </div>       
    )
}

export default Footer;