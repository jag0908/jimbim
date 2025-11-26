import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';

function QnaDetail() {
    const loginUser = useSelector( state=>state.user)
    const { qnaId } = useParams();
    const [qna, setQna] = useState({});
    const [reply, setReply] = useState('');
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getQna', {params:{qnaId}})
            .then((result)=>{ 
                setQna(result.data.qna) 
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    async function onSubmit(){
        if(!reply){ return alert('답변을 입력하세요')}

        await jaxios.post('/api/admin/writeReply', null, {params:{qnaId, reply}})
        .then(()=>{ 
            alert('답변 작성이 완료되었습니다.');
        } ).catch((err)=>{console.error(err)})

        await jaxios.get('/api/admin/getQna', {params:{qnaId}})
        .then((result)=>{ 
            setQna(result.data.qna) 
            console.log(result.data.qna)
        })
        .catch((err)=>{console.error(err)})
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={'qna'}/>
            <div className='productTable'>
                <div className='title'>Q & A</div>
                {(qna.member)?
                (<>
                <div className='row'>
                    <div className='col'>글제목</div>
                    <div className='col'>{qna.title}</div>
                </div>
                <div className='row'>
                    <div className='col'>게시자</div>
                    <div className='col'>{qna.member.userid}</div>
                </div>
                <div className='row'>
                    <div className='col'>작성일</div>
                    <div className='col'>{qna.indate.substring(0, 10)}</div>
                </div>
                <div>
                    {qna.content}
                </div>
                {(qna.reply)?
                (qna.reply):
                (<div>
                    <div>
                        <textarea value={reply} onChange={(e)=>{setReply( e.currentTarget.value )}} maxLength={2000}></textarea>
                    </div>
                    <div>
                        <button onClick={()=>{onSubmit()}}>작성</button>
                    </div>
                </div>)}
                
                </>):(<></>)}
                <div>
                    <button onClick={()=>{navigate('/qnaList')}}>뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default QnaDetail