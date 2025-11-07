// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    userid:'',
    pwd:'',
    name:'',
    email:'',
    phone:'',
    rrn:'',
    provider:'',
    profile_img:'',
    profile_msg:'',
    terms_agree:'',
    personal_agree:'',
    blacklist:'',
    indate:'',
    roleNames:[],
    accessToken:'',
    refreshToken:'',
}

// 쿠키에 저장된 로그인 유저 정보를 읽어와서 리턴해주는 함수
const getLoginUser=()=>{
    const member = cookies.get('user')
    if( member && member.userid ){
        member.userid = decodeURIComponent( member.userid );
        member.pwd = decodeURIComponent( member.pwd );
        member.name = decodeURIComponent( member.name );
        member.phone = decodeURIComponent( member.phone );
        member.email = decodeURIComponent( member.email );
        member.rrn = decodeURIComponent( member.rrn );
        member.provider = decodeURIComponent( member.provider );
        member.profileImg = decodeURIComponent( member.profile_img );
        member.profileMsg = decodeURIComponent( member.profile_msg );
        member.terms_agree = decodeURIComponent( member.terms_agree );
        member.personal_agree = decodeURIComponent( member.personal_agree );
        member.blacklist = decodeURIComponent( member.blacklist );
        member.indate = decodeURIComponent( member.indate );
        member.roleNames = decodeURIComponent( member.roleNames );
        member.accessToken = decodeURIComponent( member.accessToken );
        member.refreshToken = decodeURIComponent( member.refreshToken );
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
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.phone = action.payload.phone;
                state.rrn = action.payload.rrn;
                state.provider = action.payload.provider;
                state.profileImg = action.payload.profile_img;
                state.profileMsg = action.payload.profile_msg;
                state.terms_agree = action.payload.terms_agree;
                state.personal_agree = action.payload.personal_agree;
                state.blacklist = action.payload.blacklist;
                state.indate = action.payload.indate;
                state.roleNames = action.payload.roleNames;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            },
            logoutAction : (state)=>{
                state.userid = '';
                state.pwd  = '';
                state.name = '';
                state.email = '';
                state.phone = '';
                state.rrn = '';
                state.provider = '';
                state.profile_img = '';
                state.profile_msg = '';
                state.terms_agree = '';
                state.personal_agree = '';
                state.blacklist = '';
                state.indate = '';
                state.roleNames = [];
                state.accessToken = '';
                state.refreshToken = '';
            }
        }
    }
)

export const { loginAction, logoutAction, } = userSlice.actions
export default userSlice.reducer