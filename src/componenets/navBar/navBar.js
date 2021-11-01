import React, { useState } from 'react';
import { useDispatch} from "react-redux";
import {logOut} from "../../redux";
import {useHistory, withRouter, Link} from "react-router-dom";
import {Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Button} from 'reactstrap';
import {GoSignIn} from 'react-icons/go';
import {RiLogoutBoxLine, RiUserFill, RiUserAddFill } from 'react-icons/ri';
import {GiCook} from 'react-icons/gi';
import avatar from "../../../src/assets/avatar-unisex.png";
import "./navBar.css";

const NavBar = (props)=>{

  const dispatch = useDispatch(); 
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('myUser'));
  // const isLogged = useSelector(state=>state.userReducer.isUserLogged);
  // console.log(isLogged);
  // console.log(logged);
  // console.log('token from navBar', token);
  // const user = localStorage.getItem('myUser')
  // console.log(user);
  // const logoutfrom = dispatch(logOut());
  let history = useHistory();
   const closeNavBar =(e)=>{
    if(isOpen && ! e.target.classList.contains('navbar-toggler')){
      setIsOpen(false);
    }
    
  }

  const logoutFromNavBar = (e)=>{
      // localStorage.removeItem('userToken');
      dispatch(logOut());
      closeNavBar(e);
      history.push("/");
  }
  // useEffect(()=>{
  //     // localStorage.getItem('userToken');
  //     setLogged(isLogged);
  // }, [])

    return(
        <div className="navBarDiv" >
          <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/">WECOOK</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <Link to="/recipes/" onClick={closeNavBar} >Recettes</Link>
                </NavItem>
                <NavItem>
                  <Link to="/create-recipes/" onClick={closeNavBar}>Creer votre recette</Link>
                </NavItem>
                <NavItem>
                  <Link to="/chefs/" onClick={closeNavBar} >Chefs<GiCook style={{color:'#fff', fontSize:'22px'}}/></Link>
                </NavItem>
              </Nav>
              {user && token ? 
                  (
                    <div>
                      <Link to={{pathname:`/profile/${user.id}`}} ><Button className="d-inline-block" onClick={closeNavBar}>
                        {/* <RiAccountPinBoxLine style={{color:'#ddff13', fontSize:'22px'}}/> */}
                        <img className="profilePic"
                          // src={user && `https://mern-recipes.herokuapp.com${user.profilePicture}`}
                          src={user && user.profilePicture ? user.profilePicture : avatar}
                          style={{width:'24px', height:'24px'}}
                          alt="user profilePicture"
                          />
                        My info</Button></Link>
                      <Button onClick={logoutFromNavBar}> <RiLogoutBoxLine style={{color:'#f00', fontSize:'22px'}} onClick={closeNavBar}/>DECONNEXION</Button>
                    </div>         
                  )
                  :
                  (
                    <div>
                      <Link to='/login' ><Button className="d-inline-block" size="sm" onClick={closeNavBar}>SE CONNECTER<GoSignIn style={{color:'#0f0', fontSize:'22px'}}/> <RiUserFill/></Button></Link>
                      <Link to='/create-account' ><Button className="d-inline-block" size="sm" onClick={closeNavBar}>CREER UN COMPTE<RiUserAddFill style={{color:'#0f0', fontSize:'22px'}}/></Button></Link>
                    </div>     
                  )
              }       
            </Collapse>
          </Navbar>
        </div>
      )
}

export default withRouter (NavBar);