import {useState, useEffect, React} from 'react'
import axios from "axios";
import '../index.css';

function ChatBot() {

    const [chatView, setChatView] = useState('')
    const [chatStyle, setChatStyle] = useState({display:'none'})

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')


    useEffect(
        ()=>{
            if(chatView){
                setChatStyle(
                    {
                        position: 'fixed',
                        width:'390px',
                        height:'650px',
                        right:'0px',
                        top:'85px',
                        border:'2px solid black',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '20px',
                        boxSizing: 'border-box',
                        backgroundColor: 'white',
                    }
                )
            }else{
                setChatStyle({display:'none'})
            }
        },[chatView]
    )


    function onsubmit(){
        if(!question) return alert('질문을 입력하세요');
        appendMessage('User', question)
        axios.post('/api/question', null, {params:{question}})
        .then((result)=>{
            appendMessage('ChatBot', result.data.answer)
            setQuestion('')
        })
        .catch((err)=>{console.error(err)})
    }


    function appendMessage(sender, content){
        setAnswer(prev => {
            if(sender === 'User'){
                return prev + `<div class="userMessage"><div class="senderUser">
                        User
                    </div><div class="userContent">
                        ${content}
                    </div></div><br />`
            }else{
                return prev + `<div class="botMessage"><div class="senderBot">
                        ChatBot
                    </div><div class="botContent">
                        ${content}
                    </div></div><br />`
            }
        })
        setQuestion('')
    }
  return (
    <div>
        <div className='chatBot' onClick={()=>{setChatView(!chatView)}}>ChatBot</div>
        <div className='chatbotbox' style={chatStyle}>
            <h1 className="text-center">RAG기반 AI 챗봇 서비스</h1>
                <div className="chat-box" id="chatBox"  dangerouslySetInnerHTML={{ __html: answer }} ></div>
                 <div className="userQuestion">
                    <input type='text' id="messageInput" className="question" placeholder="Type your message..." value={question} onChange={(e)=>{ setQuestion(e.currentTarget.value)}} />
                    <button className="sendBtn" onClick={()=>{onsubmit()}}>Send</button>
                </div>
        </div>
    </div>
  )
}

export default ChatBot