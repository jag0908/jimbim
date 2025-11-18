import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil'
import { useNavigate, useParams } from 'react-router-dom'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import ChatRoom from '../chat/ChatRoom';



const settings = {
    dots:true,
    arrows:false,
    infinite:true,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

function ShView() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const  loginUser = useSelector(state=>state.user);

    const {id} = useParams();
    const navigate = useNavigate();

    const [postDetail, setPostDetail] = useState(null);
    const [category, setCategory] = useState(null);

    const [disPlayYN, setDisplayYN] = useState({display: "none"}); 

    async function viewed() {
        // 1. 조회수 증가
        try {
            await jaxios.post(`/api/sh-page/sh-view-count`, { postId: id, memberId: loginUser.member_id });
        } catch (err) {
            console.error(err);
        }
        // 2. 데이터 가져오기 (조회수 증가 후)
        try {
            const res = await jaxios.get(`/api/sh-page/sh-view/${id}`);
            console.log(res.data)
            setPostDetail(res.data.post);
            setCategory(res.data.category.category_name);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=> {
        viewed();
    }, [])

    function formatDateTime(indate) {
        const date = new Date(indate);
        const now = new Date();

        // 시간 제외하고 날짜만 비교하기 위해 00:00 기준으로 변환
        const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffMs = now - date;
        const diffMinutes = Math.floor(diffMs / 1000 / 60);
        const diffHours = Math.floor(diffMinutes / 60);

        const diffDays = Math.floor((startOfNow - startOfDate) / (1000 * 60 * 60 * 24));

        // 오늘일 경우
        if (diffDays === 0) {
            if (diffHours > 0) return `${diffHours}시간 전`;
            if (diffMinutes > 0) return `${diffMinutes}분 전`;
            return `방금 전`;
        }

        // 1달(30일) 미만
        if (diffDays < 30) {
            return `${diffDays}일 전`;
        }

        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) {
            return `${diffMonths}달 전`;
        }

        // 1년 이상은 날짜 출력
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    function formatPrice(num) {
      return num.toLocaleString('ko-KR');
    }



    // 채팅
    // oneToOneChat
    // chatRoomList
    const [openChatState, setOpenChatState] = useState(null);
    const [chatRoomData, setChatRoomData] = useState(null);
    const [chatListData,setChatListData] = useState(null);
    function openChat() {
        setDisplayYN({display: "flex"});
        if(window.confirm("판매자와 연락 하시겠습니까?")) {
            jaxios.post("/api/chat/createChatRoom", {
                sellerId:postDetail.member.memberId, 
                sellerName:postDetail.member.name,
                sellerProfileImg:postDetail.member.profileImg,
                buyerId:loginUser.member_id,
                buyerName:loginUser.name,
                postId: id,
                postTitle: postDetail.title,
            }).then((result)=> {
                    console.log(result);
                    if(result.data.msg == "ok") {
                        setOpenChatState("oneToOneChat");
                        setChatRoomData(result.data.resDto);
                    } else {
                        return alert("요청이 실패하였습니다.");
                    }
                }).catch(err=>console.error(err));
        }
    }
    function openChatRoomList() {
        setDisplayYN({display: "flex"});
        jaxios.get("/api/chat/chatRoomList").then((result)=> {
            console.log(result);
            if(result.data.msg == "ok") {
                setOpenChatState("chatRoomList");
                setChatListData(result.data.resDto);
            } else {
                return alert("요청이 실패하였습니다.");
            }
        }).catch(err=>console.error(err));
    }
    function openClickChat(chatRoom) {
        setDisplayYN({display: "flex"});
        setChatRoomData(chatRoom);
        setOpenChatState("oneToOneChat");
    }

  return (
    <div className='shView'>
        <div className='viewWrap'>
            <div className='top'>
                <div className='catetory'>[{category && category}]</div>
                <h4 className='tit'>{postDetail?postDetail.title:<Lodding />}</h4>
            </div>

            <div className='rayoutWrap'>
                <div className='leftBox'>
                    <Slider className='imgGroup' {...settings}>
                        {
                            postDetail && postDetail.files.map((file, i)=> {
                                return(
                                <div className='imgBox'>
                                    <img src={file.path} />
                                </div>  
                                )
                            })
                        }
                    </Slider>
                    <div className='userWrap'>
                        <div className='userProfile'>
                            <div className='profileImg'>
                            {
                                (postDetail && postDetail.member.profileImg)
                                ? 
                                (<img src={postDetail.member.profileImg} />)
                                : 
                                (<img src={`${baseURL}/sh_img/1.png`} />)
                            }
                            </div>

                            <div className='profileInfo'>
                            <span className='nickname'>
                                {
                                    postDetail?
                                    postDetail.member.name:
                                    <Lodding/>
                                }
                            </span>
                            <span className='etc'>
                                {
                                    postDetail?
                                    postDetail.member.profileMsg:
                                    <Lodding/>
                                }
                            </span>
                            </div>
                        </div>

                        <div className='userState'>
                            매너단계: 
                            <span>
                                {
                                    postDetail?
                                    postDetail.member.blacklist:
                                    <Lodding/>
                                }
                            </span>
                        </div>
                    </div>

                </div>
                <div className='rightBox'>
                    <div className='dataBoxWrap'>
                        <h2 className='mainTitle'>
                            {
                                postDetail?
                                postDetail.title:
                                <Lodding/>
                            }
                        </h2>
                    </div>
                    <div className='dataBoxWrap dobule'>
                        <div className='catetory'>[{category && category}]</div>
                        <div className='date'>{postDetail && formatDateTime(postDetail.indate)}</div>
                    </div>
                    <div className='dataBoxWrap'>
                        <span className='dataBox price'>
                            {
                                postDetail?
                                 formatPrice(postDetail.price):
                                <Lodding/>
                            }
                            원
                        </span>
                    </div>
                    <div className='dataBoxWrap'>
                        <textarea id='dataTTA' className='tta' readOnly disabled 
                        value={
                                postDetail?
                                postDetail.content:
                                <Lodding/>
                            }
                        ></textarea>
                    </div>

                    <div className='dataBoxWrap'>
                        <div className='util'>
                            <span className='tit'>채팅</span>
                            <span className='dataBox srt'>0</span>
                        </div>
                        <div className='util'>
                            <span className='tit'>관심</span>
                            <span className='dataBox srt'>0</span>
                        </div>
                        <div className='util'>
                            <span className='tit'>조회수</span>
                            <span className='dataBox srt'>
                                {
                                    postDetail?
                                    postDetail.viewCount:
                                    <Lodding/>
                                }
                            </span>
                        </div>

                    </div>

                    <div className='eventArea'>
                        {
                            postDetail &&
                            postDetail.member.memberId == loginUser.member_id &&
                            <button className='btnEvent btnChat' onClick={()=> {openChatRoomList()}}>내 채팅 보기</button>
                        }
                        {
                            postDetail &&
                            postDetail.member.memberId != loginUser.member_id &&
                            <button className='btnEvent btnChat' onClick={()=> {openChat()}}>1:1 채팅하기</button>
                        }
                        
                        <button className='btnEvent btnBuy'>구매하기</button>
                        <button className='btnEvent btnZZim'>찜</button>
                        <button className='btnEvent btnLike'>좋</button>
                    </div>

                    <div className='line'></div>
                    
                    <div className='dataBoxWrap'>
                        <h4 className='tit'>직거래</h4>
                        <span className='dataBox srt'>
                            {
                                postDetail?
                                (
                                    postDetail.directYN === "N" ? "불가능" :
                                    "가능"
                                ):
                                <Lodding/>
                            }
                        </span>

                        <div></div><div></div><div></div>

                        <h4 className='tit'>택배거래</h4>
                        <span className='dataBox srt'>
                            {
                                postDetail?
                                (
                                    postDetail.deliveryYN === "N" ? "불가능" :
                                    "가능"
                                ):
                                <Lodding/>
                            }
                        </span>
                    </div>

                    <div className={
                            `dataBoxWrap ${postDetail && postDetail.deliveryYN=="N"?
                                "display-none":
                                "display-block"
                            }`
                        }>
                        <h4 className='tit'>택배비</h4>
                        <span className='dataBox price srt'>
                            {
                                postDetail?
                                postDetail.deliveryPrice:
                                <Lodding/>
                            }
                            원</span>
                    </div>
                </div>
            </div>
            
        </div>
        <div className='btnWrap'>
            {
                postDetail &&
                postDetail.member.memberId == loginUser.member_id &&
                <button className='navBtn pointBtn' onClick={() => navigate(`/sh-page/sh-update/${id}`)}>
                수정하기
                </button>
                
            }
            
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>

        {
            loginUser &&
            loginUser?.accessToken &&
            postDetail &&
            openChatState &&
            
            <PopupLayer 
                disPlayYN={disPlayYN} 
                token={loginUser.accessToken} 
                loginUser={loginUser}
                sellerId={postDetail.member.memberId} 
                buyerId={loginUser.member_id} 
                openChatState={openChatState}
                setOpenChatState={setOpenChatState}
                chatRoomData={chatRoomData}
                chatListData={chatListData}
                onOpenClickChat={openClickChat}
            />
        }
    </div>
  )
}

// 로딩
function Lodding() {
    return <span style={{fontSize:"14px"}}>불러오는중...</span>
}

// 팝업창열림
function PopupLayer({disPlayYN, openChatState, setOpenChatState, loginUser, chatRoomData, chatListData, onOpenClickChat}) {           
    return (
        <>
            <div className='popupWrap' style={disPlayYN}>
                <div className='popupHeader'>
                    <h3 className='pTitle'>채팅</h3>
                    <button className='bthClose' onClick={()=>{window.location.reload();}}>X</button>
                </div>
                {
                    openChatState && 
                    openChatState=="oneToOneChat" &&
                    
                    <ChatRoomCP chatRoomData={chatRoomData} loginUser={loginUser}/>

                }
                {
                    openChatState && 
                    openChatState=="chatRoomList" &&

                    <ChatRoomList chatListData={chatListData} loginUser={loginUser} setOpenChatState={setOpenChatState} onOpenClickChat={onOpenClickChat}/>
                }
            </div> 
        </>
    )
}

// 채팅룸 리스트
function ChatRoomList({chatListData, loginUser, setOpenChatState, onOpenClickChat}) {

    // useEffect(()=> {
    //     jaxios.get("/api/chat/chatRoomList", {params: {buyerId}})
    //         .then((result)=> {
    //             console.log(result);
    //         }).catch(err=>console.error(err));
    // }, [])

    return (
        <div className='pChatListWrap'>
                {
                    chatListData && chatListData.map((chatRoom, i)=> {
                        return(
                            
                            <div className='pChatList' key={i} onClick={()=>{onOpenClickChat(chatRoom)}}>
                                <div className='chl left'>
                                    <img src={chatRoom.sellerProfileImg} alt="이미지" />
                                </div>
                                <div className='chl center'>
                                    <div className='pdTitle'>
                                        {chatRoom.buyerName}
                                    </div>
                                    <div className='rMsg'>
                                        최근 메세지입니다.
                                    </div>
                                </div>
                                <div className='chl right'>
                                    <div className='rTime'>
                                        오후 5:44
                                    </div>
                                    <div className='alram'>
                                        1
                                    </div>
                                </div>
                            </div>  
                            
                        )
                    })
                }
        </div>
    )
}

// 채팅방
function ChatRoomCP({chatRoomData, loginUser}) {
    
    const [isOpen, setIsOpen] = useState(false);
    const [chatRoomInfo, setChatRoomInfo] = useState(null);

    useEffect(()=> {
        jaxios.get(`/api/chat/detailChatRoom/${chatRoomData.chatRoomId}`)
            .then((result)=> {
                console.log(result);
                if(result.data.msg == "ok") {
                    setIsOpen(true);
                    setChatRoomInfo(result.data.resDto);
                } else {
                    alert("요청이 실패했습니다.");
                }
            
            }).catch(err=>console.error(err));
    }, [])

    return (
        <>
            <div className='chatRoom'>
                <div className='buyerInfo'>
                    <div className='imgBox'>
                        <img src={chatRoomInfo && chatRoomInfo.sellerProfileImg} />
                    </div>
                    <div className='buyerName'>
                        {chatRoomInfo && chatRoomInfo.sellerName}
                    </div>
                </div>
                <div className='bindingChatRoom'>
                    <span className='hello'>환영합니다.</span>
                    {/* 웹소켓 */}
                    {
                        chatRoomInfo && isOpen &&
                        <ChatRoom roomId={chatRoomInfo && chatRoomInfo.chatRoomId} loginUser={loginUser} />                          
                    }
                    {
                        !chatRoomInfo && !isOpen && <span style={{fontSize:"14px"}}>불러오는중...</span>
                    }
                </div>
                <div className='util'>

                </div>
            </div>
        </>
    )
}

export default ShView