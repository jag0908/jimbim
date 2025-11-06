// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    userid:'',
    pwd:'',
    /*
    name:'',
    email:'',
    phone:'',
    zip_num:'',
    address1:'',
    address2:'',
    address3:'',
    indate:'',
    provider:'',
    snsid:'',
    roleNames:[],
    accessToken:'',
    refreshToken:'',
    */
}

// 쿠키에 저장된 로그인 유저 정보를 읽어와서 리턴해주는 함수
const getLoginUser=()=>{
    const member = cookies.get('user')
    if( member && member.userid ){
        member.userid = decodeURIComponent( member.userid );
        member.pwd = decodeURIComponent( member.pwd );
        /*
        member.name = decodeURIComponent( member.name );
        member.phone = decodeURIComponent( member.phone );
        member.email = decodeURIComponent( member.email );
        member.zip_num = decodeURIComponent( member.zip_num );
        member.address1 = decodeURIComponent( member.address1 );
        member.address2 = decodeURIComponent( member.address2 );
        member.address3 = decodeURIComponent( member.address3 );
        member.indate = decodeURIComponent( member.indate );
        member.provider = decodeURIComponent( member.provider );
        member.snsid = decodeURIComponent( member.snsid );
        member.roleNames = decodeURIComponent( member.roleNames );
        member.accessToken = decodeURIComponent( member.accessToken );
        member.refreshToken = decodeURIComponent( member.refreshToken );
        */
    }
    return member
}

export const userSlice = createSlice(
    {
        name:'user',
        initialState : getLoginUser() || initialState,
        reducers:{
            loginAction : (state, action)=>{
                state.userid = action.payload.userid;
                state.pwd = action.payload.pwd;
                /*
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
                state.zip_num = action.payload.zip_num;
                state.address1 = action.payload.address1;
                state.address2 = action.payload.address2;
                state.address3 = action.payload.address3;
                state.indate = action.payload.indate;
                state.provider = action.payload.provider;
                state.snsid = action.payload.snsid;
                state.roleNames = action.payload.roleNames;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                */
            },
            logoutAction : (state)=>{
                state.userid = '';
                state.pwd  = '';
                /*
                state.name = '';
                state.email = '';
                state.phone = '';
                state.zip_num = '';
                state.address1 = '';
                state.address2 = '';
                state.address3 = '';
                state.indate = '';
                state.provider = '';
                state.snsid = '';
                state.roleNames = [];
                state.accessToken = '';
                state.refreshToken = '';
                */
            }
        }
    }
)

export const { loginAction, logoutAction, } = userSlice.actions
export default userSlice.reducer