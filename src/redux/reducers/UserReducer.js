
const initialState = {
    user: null,
    userMetaData:{},
    professionnals:[],
    userToken: null,
    isUserLogged: false,
    modalBody:"",
    modalTitle: "",
    modalButtonDisabled: false,
    conditionsAccepted: false,
    showModale: false,
    modalImage: null,
    redirect: false,
    successMsgPasswordChange: "",
    modalBodyDeleteUser:""
}

export const userReducer = (state = initialState, action) =>{
    switch(action.type){
        case "REGISTER-SUCCES":
            return {
                ...state,
                user: action.user,
                userToken: action.token,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
                modalButtonDisabled: action.modalButtonDisabled,
                modalImage:action.modalImage,
                isUserLogged: action.isUserLogged
            };
        case "REGISTER-FAILLUR":
            return{
                ...state,
                user:null,
                userToken: null,
                showModale: action.showModale,
                modalTitle: action.modalTitle,
                modalBody: action.modalBody,
                modalImage:action.modalImage,
                isUserLogged: action.isUserLogged

            }
        case "SHOW_CONDITIONS":
            return {
                ...state,
                showModale: action.showModale,
                modalTitle:action.modalTitle,
                modalBody:action.modalBody,
                modalButtonDisabled: action.modalButtonDisabled,
            } 

        case "LOGIN":
            return{
                ...state,
                user: action.user,
                userToken: action.token,
                isUserLogged: true,
                redirect: action.redirect,
                // showModale:action.showModale,
                // modalTitle:action.modalTitle,
                modalBody:action.modalBody
                // modal: true
            }; 

        case "LOGIN_FAIL":
            return{
                ...state,
                user: null,
                userToken: null,
                isUserLogged: action.isUserLogged,
                redirect: action.redirect,
                // showModale:action.showModale,
                // modalTitle:action.modalTitle,
                modalBody:action.modalBody 
            };
            
        case "GET-USERMETADATA-SUCCESS":
            return{
                ...state,
                userMetaData: action.userMetaData
            };

        case "GET-PRO-SUCCESS":
            return{
                ...state,
                professionnals: action.professionnals
            };

        case "LOGOUT":
            return{
                ...state,
                user: action.user,
                userToken: action.token,
                isUserLogged: action.isUserLogged,
                modalBody: action.modalBody
                // redirect: action.redirect
            };
        case "CHANGE-PASSWORD-SUCCESS":
            // console.log(initialState.modalBody)
            return{
                ...state,
                successMsgPasswordChange:action.successMsgPasswordChange
            }
        case "DELETE-USER-SUCCESS":
            return{
                ...state,
                modalBodyDeleteUser: action.modalBodyDeleteUser
            }
        case "DELETE-USER-FAILURE":
            return{
                ...state,
                modalBodyDeleteUser: action.modalBodyDeleteUser
            }                     
        default:
            return state;
    }
} 