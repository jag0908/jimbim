import React ,{useState, useEffect} from 'react'
import '../../style/login.css';
import MemberForm from './MemberForm';

function Join() {

    const [userid, setUserid] = useState('')

    const [reid, setReid]=useState('')
    const [message, setMessage]=useState('')
    const [idCheckMsgStyle, setIdCheckMsgStyle] = useState({})

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

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

    const [file, setFile] = useState({});
    const type = 'join'

    const form = {
        userid, setUserid,
        reid, setReid,
        message, setMessage,
        idCheckMsgStyle, setIdCheckMsgStyle,
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

        terms_agree, setTerms_agree,
        personal_agree, setPersonal_agree,

        file, setFile,
        type
    }
    return (
        <article>
            <MemberForm form={form}/>
        </article>
    )
}

export default Join