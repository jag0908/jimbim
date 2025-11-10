// KakaoIdFirstEdit.js
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import MemberForm from './MemberForm';

function KakaoIdFirstEdit() {

    const {userid} = useParams()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [rrn1, setRrn1] = useState('');
    const [rrn2, setRrn2] = useState('');
    const [profileImg, setProfileImg] = useState('')
    const [preview, setPreview] = useState('')

    const [profileMsg, setProfileMsg] = useState('')
    
    const [terms_agree, setTerms_agree] = useState('N')
    const [personal_agree, setPersonal_agree] = useState('N')

    const [kakaoMember, setKakaoMember] = useState({})

    const [file, setFile] = useState({});

    const type = 'kakao'

    const form = {
        userid,
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

        terms_agree, setTerms_agree,
        personal_agree, setPersonal_agree,

        kakaoMember, setKakaoMember,

        file, setFile,
        type
    }

    useEffect(
        ()=>{
            axios.post('/api/member/getKakaoMember', null, {params:{ userid}})
            .then((result)=>{
                console.log(result.data)
                setKakaoMember(result.data.member)
                setName(result.data.member.name)
                setProfileImg(result.data.member.profileImg)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    return (
        <article>
            <MemberForm form={form}/>
        </article>
    )
}

export default KakaoIdFirstEdit