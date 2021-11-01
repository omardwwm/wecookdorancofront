import React from "react";
import axios from "axios";
import modalImgFailed from "../../images/400-bad-request-.jpg";
import modalImgSuccess from "../../images/signup-reg.jpg";
import Conditions from "../../componenets/conditions/Conditions";

export const registerUser = (formData, Headers)=>{
    return async(dispatch)=>{
        try {
            // const formData = new FormData();
            // console.log(formData);
            const response =  await axios.post('https://mern-recipes.herokuapp.com/users/register', formData, Headers);
            // console.log(response);
            dispatch({
                type: "REGISTER-SUCCES",
                user: response.data.savedNewUser,
                token: response.data.token,
                showModale:true,
                modalBody: response.data.message,
                modalTitle: "Welcome redux test",
                modalButtonDisabled: false,
                modalImage:modalImgSuccess,
                isUserLogged: true
            });
            localStorage.setItem("userToken", response.data.token);
            localStorage.setItem("myUser", JSON.stringify(response.data.savedNewUser));
        } catch (error) {
            console.log(error)
            dispatch({
                type: "REGISTER-FAILLUR",
                showModale:true,
                modalTitle: "Sever error redux test",
                modalBody: error.response.data.message,
                modalImage:modalImgFailed,
                isUserLogged: false           
            })
            
        }
    }
}

export const showConditionsPolicy =()=>{
    return async(dispatch) => {
      dispatch({
          type: "SHOW_CONDITIONS",
          showModale: true,
          modalTitle: 'Our policy confidential',
          modalBody: <Conditions/>
      })
    }
}

export const login =(email, password)=>{
    return async(dispatch) =>{
        try {
            const response = await axios
            .post(`https://mern-recipes.herokuapp.com/users/login`, {
            email: email,
            password: password
        });
        // console.log(response);
        dispatch({
            type: "LOGIN",
            user: response.data.user,
            token: response.data.token,
            isUserLogged: true,
            redirect: true,
            // showModale:true,
            modalBody: response.data.message,
            // modalTitle: "login succes test"
        })
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("myUser", JSON.stringify(response.data.user));
        } catch (error) {
            console.log(error)
            dispatch({
                type: "LOGIN_FAIL",
                isUserLogged:false,
                redirect: false,
                // showModale:true,
                modalBody: error.response.data.message,
                // modalTitle: "login failure test"     
            })            
        }
    }
}

export const getUserMetaData =(userId)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.get(`https://mern-recipes.herokuapp.com/users/metadata/${userId}`);
            dispatch({
                type: "GET-USERMETADATA-SUCCESS",
                userMetaData: response.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

// Update password 
export const changePassword=(userId, token, newPassword, newPasswordConfirm)=>{
    return async(dispatch)=>{
        try {
            const headers = {
                Accept:'*/*',
                'content-type':'application/json' ,
                // 'Authorisation': `Bearer ${token}`,
                "x-auth-token":`${token}`
                };
                const data = {
                    newPassword: newPassword,
                    newPasswordConfirm: newPasswordConfirm
                }
            const response = await axios.put(`https://mern-recipes.herokuapp.com/users/changePassword/${userId}`, data,
            {headers}
            );
            dispatch({
                type:"CHANGE-PASSWORD-SUCCESS",
                successMsgPasswordChange:response.data.message
            })    
        } catch (error) {
            console.log(error)
        }
    }
}

export const logOut =()=>{
    return  async(dispatch)=>{
        try {
            // await localStorage.setItem('userToken', null);
        //    await localStorage.setItem('myUser', null)
           dispatch({
            type: "LOGOUT",
            isUserLogged: false,
            user: null,
            token: null,
            modalBody:''
           });
           localStorage.clear();
        //    localStorage.setItem('userToken', null);
        //    localStorage.setItem('myUser', null)
        } catch (error) {
            console.log(error);
        }
    }
}

export const getProfessionnals = (config)=>{
    return async(dispatch)=>{
        try {
            const response = await axios.get(`https://mern-recipes.herokuapp.com/users/professionnals`, config);
            // console.log(response)
            dispatch({
                type: "GET-PRO-SUCCESS",
                professionnals: response.data

            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const deletUser =(userId, myCurrentProfilePicture, token)=>{
    return async(dispatch)=>{
        try {
            const data ={
                myCurrentProfilePicture: myCurrentProfilePicture
            }
            const response = await axios.delete(`https://mern-recipes.herokuapp.com/users/delete/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "x-auth-token": token
                  }, 
                data:data
            })
            // console.log(response);
            dispatch({
                type: "DELETE-USER-SUCCESS",
                modalBodyDeleteUser: response.data.message
            })
            localStorage.clear();
        } catch (error) {
            console.log(error);
            dispatch({
                type: "DELETE-USER-FAILURE",
                modalBodyDeleteUser: `Erreur survenue from server : ${error.response.data.message}`,
            })
        }
    }
}