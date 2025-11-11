import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function UpdateForm(props) {
    const loginUser = useSelector( state=>state.user )

	const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const {
		prePwd, setPrePwd,
        pwd, setPwd,
        pwdChk, setPwdChk,
        name, setName,
        email, setEmail,
        phone1, setPhone1,
        phone3, setPhone3,
        phone2, setPhone2,
        rrn1, setRrn1,
        rrn2, setRrn2,

        profileImg, setProfileImg,
        preview, setPreview,

        profileMsg, setProfileMsg,

        file, setFile,
        type, setType,
		edit
    } = props.form

    function fileupload(e) {
        /// 단일파일 업로드용으로 바꿨음 ///
        if(!e.target) {return}

        let newfile = e.target.files[0];
        setFile(newfile)

        // 브라우저에서 바로 미리보기 URL 생성
        const url = URL.createObjectURL(newfile);

        setPreview(url)
    };

    // 파일 삭제
    const handleRemoveFile = () => {
        setFile({});
        // 미리보기도 같이 갱신
        setPreview('');
    };

    // 파일 업로드시 formData 추가
    async function createFormData() {
        if(!file.name) return;
        const formData = new FormData();
        formData.append('image', file);
        let filename;
        await jaxios.post( '/api/member/fileupload', formData)
        .then((result)=>{
            setProfileImg(result.data.filename);
            filename=result.data.filename
        }).catch((err)=>{console.error(err)})
        return filename
    }

	// 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        e.target.value = e.target.value.replaceAll(/\D/g, "");
    };

    // 주민번호 검사
    function checkrrn(rrn1, rrn2){
        const lastRrn= (Number)(rrn2);
        let year = (Number)(rrn1.substr(0,2))
        if(lastRrn==1 || lastRrn==2){
            year += 1900;
        }else if(lastRrn==3 || lastRrn==4){
            year += 2000;
        }

        const month = (Number)(rrn1.substr(2,2))
        const day = (Number)(rrn1.substr(4,2))

        if(lastRrn<1 || lastRrn>4) return false;    // 뒷자리가 1~4가 아니면 금지
        if(month==0 || day==0) return false;    // 월이나 일이 0이면 금지
        
        switch(month){                          // 월에 따라 일이 초과하면 금지
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                if(day>31) return false;
                break;
            case 4: case 6: case 9: case 11:
                if(day>30) return false;
                break;
            case 2:
                if(year%4==0 && year%100!=0 || year%400==0){
                    if(day>29) return false;
                }else{
                    if(day>28) return false;
                }
                break;
            default: return false;              // 월이 13 이상이면 금지
        }
        return true
    }
    async function onSubmit(){
		/*
        if(type=='join'){
            if(!userid){ return alert('아이디를 입력하세요')}
            if( !pwd ){return alert('패스워드를 입력하세요')}

            if( pwd !== pwdChk){return alert('패스워드 확인이 일치하지 않습니다')}
            if( reid !== userid){return alert('아이디 중복을 체크해주세요')}
        }

        if( !name ){return alert('이름을 입력하세요')}
        
        if( !email ){return alert('이메일을 입력하세요')}
        // 유효이메일 양식 체크
        let regix = email.match( /\w+@(\w+[.])+\w+/g );
        if( !regix ){  return alert('유효한 이메일을 입력하세요'); }

        if( !phone1 && !phone2 && !phone3 ){return alert('전화번호를 입력하세요')}

        if( !rrn1 && !rrn2 ){return alert('주민등록번호를 입력하세요')}
        if(!checkrrn(rrn1, rrn2)){return alert('유효한 주민등록번호를 입력하세요')};
        
        const phone = phone1+"-"+phone2+"-"+phone3
        const rrn = rrn1+"-"+rrn2+"******"

        let url = await createFormData()

        if(type=='join'){
            await axios.post('/api/member/join', {userid, pwd, name, email, phone, rrn, profileImg:url, profileMsg, terms_agree, personal_agree})
            .then(()=>{ 
                alert('회원가입이 완료되었습니다. 로그인하세요');
                navigate('/login')
            } ).catch((err)=>{console.error(err)})

        }else if(type=='kakao'){

            if(!url) url = kakaoMember.profileImg
            await axios.post('/api/member/kakaoIdFirstEdit', {userid, name, email, phone, rrn, profileImg:url, profileMsg, terms_agree, personal_agree })
            .then((result)=>{
                alert('정보 입력이 완료되었습니다');
            } ).catch((err)=>{console.error(err)})

            await axios.post('/api/member/login', null, {params:{ username:userid, password:'KAKAO'}})
            .then((result)=>{
                if( result.data.error == 'ERROR_LOGIN' ){
                    return alert("이메일 또는 패스워드 오류입니다");
                }else{
                    dispatch( loginAction( result.data ) );
                    cookies.set('user', JSON.stringify(result.data), {path:'/',});
                    navigate('/');
                }
            })
        }
		*/
    }

	return (
		<>
			<div><input type='text'/></div>
            <button onClick={()=>{edit('')}}>취소</button>
		</>
	)
}

export default UpdateForm