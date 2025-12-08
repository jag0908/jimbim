import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';
import Modal from 'react-modal'

function SuggestDetail() {
    const loginUser = useSelector( state=>state.user)
    const { suggestId } = useParams();
    const [suggest, setSuggest] = useState({});
    // const [shCategoryList, setShCategoryList] = useState([]);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');

    const [categoryId, setCategoryId] = useState('1');
    const [categoryArr, setCategoryArr] = useState([]);

    const [oldFiles, setOldFiles] = useState([]); // 서버에 있는 기존 파일
    const [oldRemoveArr, setOldRemoveArr] = useState([]); // 서버에 있는 삭제할 파일들

    const [fileArr, setFileArr] = useState([]); // 새로 업로드한 파일

    const [previewUrls, setPreviewUrls] = useState([]); // 미리보기용 URL
    const [fileLength, setFileLength] = useState(0);  // 기존서버 + 현재 저장되는 파일들의 배열의 사이즈

    const [isOpen, setIsOpen]=useState(false)
    const customStyles = {
        overlay: {
            backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", 
            zIndex: "2000"
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getSuggest', {params:{suggestId}})
            .then((result)=>{ 
                if(result.data.suggest==null){
                    alert('존재하지 않는 페이지입니다')
                    navigate('/suggestList')
                }else{
                    console.log(result.data)
                    setSuggest(result.data.suggest)
                    setOldFiles(result.data.files);
                    setFileLength(result.data.files.length);

                    // setShCategoryList(result.data.shCategoryList)
                }
            })
            .catch((err)=>{console.error(err)})

            jaxios.get("/api/admin/getShopCategoryList")
            .then((result)=> {
                setCategoryArr([...result.data.categoryList]);
            }).catch(err=>console.error(err));

        },[]
    )
    async function setStatus(status){
        if(window.confirm('변경하시겠습니까?')){
            await jaxios.post('/api/admin/setStatus', null, {params:{suggestId, status}})
            .then((result)=>{ 
                alert('변경되었습니다.')
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/admin/getSuggest', {params:{suggestId}})
            .then((result)=>{
                setSuggest(result.data.suggest)
                setOldFiles(result.data.files);
                setFileLength(result.data.files.length);
            })
            .catch((err)=>{console.error(err)})
        }
    }
    function openModal(){
        setIsOpen(!isOpen)
        setTitle(suggest.title)
        setContent(suggest.content)
        setPrice(suggest.price)
    }
    // 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        e.target.value = e.target.value.replaceAll(/\D/g, "");
    };
    function fileupload(e) {   // 새로운 파일을 업로드하는 함수
        if(!e.target) {return}

        let newfiles = Array.from(e.target.files);

        // 기존 파일과 합치기
        const allFiles = [...fileArr, ...newfiles];
        console.log("@@@@ 파일 정보 @@@@" + allFiles)

        if ((allFiles.length + oldFiles.length) > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 선택 초기화
            return;
        };

        setFileLength(allFiles.length + oldFiles.length);
        setFileArr(allFiles);

        // 브라우저에서 바로 미리보기 URL 생성
        const urls = allFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        e.target.value = null;
    }

    function oldHandleRemoveFile(index, fileId) {    // 기존 서버 파일을 삭제할 수 있는 함수
        let resultArr = oldFiles.filter((_, i) => i !== index);
        setOldFiles(resultArr);

        // 삭제할 서버 디비 fileId들
        setOldRemoveArr(prev => [...prev, fileId]);
        

        // 갯수 표시 업데이트
        setFileLength(prev => prev - 1);

    }

    function handleRemoveFile(index) {    // 새로 추가판 파일을 삭제할 수 있는 함수
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);

        // 갯수 표시 업데이트
        setFileLength(prev => prev - 1);
    }

    async function writeShopPost(){
        if(!title){ return alert('제목을 입력하세요')}
        if(!content){ return alert('내용을 입력하세요')}
        if(!price){ return alert('가격을 입력하세요')}
        if(!categoryId){ return alert('카테고리를 선택하세요')}

        if(window.confirm('등록하시겠습니까?')){
            let createdPostId;
            await jaxios.post('/api/admin/writeShopPost', null, {params:{title, content, price, categoryId}})
            .then((result)=>{ 
                alert('등록이 완료되었습니다.');
                createdPostId = result.data.postId;
                setIsOpen( false )
            } ).catch((err)=>{console.error(err)})

            await createFormData(fileArr, createdPostId);

            const idList = oldFiles.map( e => e.file_id )


            await jaxios.post('/api/admin/uploadOldFile', null, {params:{idList:idList, postId:createdPostId}})
            .then((result)=>{ 

            } ).catch((err)=>{console.error(err)})

            await jaxios.post('/api/admin/setStatus', null, {params:{suggestId, status:'Y'}})
            .then((result)=>{ 
                
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/admin/getSuggest', {params:{suggestId}})
            .then((result)=>{
                setSuggest(result.data.suggest)
                setOldFiles(result.data.files);
                setFileLength(result.data.files.length);
            })
            .catch((err)=>{console.error(err)})
        }
    }
    const createFormData = async (allfileArr, postId) => {
        if (!allfileArr || allfileArr.length === 0) return;

        const formData = new FormData();
        allfileArr.forEach(file => formData.append("imageList", file));
        formData.append("postId", postId);

        try {
            await jaxios.post(`/api/admin/fileupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } catch (err) {
            console.error("파일 업로드 실패:", err);
        }
    };
    return (
        <div className='adminContainer'>
            <SubMenu type={'suggest'}/>
            <div className='productTable detailTable'>
                <div className='title'>상품정보</div>
                {(suggest.title)?
                (<>
                    <div className='row'>
                        <div className='col detailTitle'>상품명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{suggest.title}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시자</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{
                            (suggest.member)?
                            (((suggest.member.provider)?(suggest.member.userid+' ('+suggest.member.provider+')'):(suggest.member.userid))):
                            (<span className='italic'>탈퇴회원</span>)
                        }</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{suggest.indate.substring(0, 10)}</div>
                    </div>
                    {/* <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shCategoryList[shPost.categoryId-1].category_name}</div>
                    </div> */}
                    <div className='row'>
                        <div className='col detailTitle'>상품 이미지</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>추후작업예정, 상품 추가하기 버튼 누르면 이미지 나옵니다</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품설명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{suggest.content}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>가격</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{suggest.price} 원</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상태</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{
                            (suggest.isAccept)?
                            (suggest.isAccept):
                            (<>
                                <div className='detailPageBtns'>
                                    <button onClick={()=>{openModal()}} >상품 추가하기</button>
                                    <button className='redbtn' onClick={()=>{setStatus('N')}} >거절</button>
                                </div>
                            
                            </>)
                        }</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>가격</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{suggest.price} 원</div>
                    </div>
                </>):(<></>)}
                
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/suggestList')}} >뒤로</button>
                </div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <div className='writeReplyTitle'>상품 등록</div>
                    <div className='row'>
                        <div className='col detailTitle'>상품명</div>
                        <input value={title} onChange={(e)=>{setTitle( e.currentTarget.value )}}/>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <select id='dataCategory' value={categoryId} onChange={(e)=> {setCategoryId(e.currentTarget.value)}}>
                            {
                                categoryArr.map((category, i)=> {
                                    return(
                                        <option key={i} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품 이미지</div>
                        <div className='inputWrap file'>
                            <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                            {/* 파일업로드 인풋 */}
                            <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                            {/* 미리보기 이미지 */}
                            <div className="previewContainer">
                                {/* 서버이미지 */}
                                {
                                    oldFiles.map((file, i)=> {
                                        return(
                                            <div className='imgBox' key={i} >
                                                <img src={file.filePath} alt={`preview-${i}`} />
                                                <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                        oldHandleRemoveFile(i, file.file_id);  
                                                }}>X</div>
                                            </div>    
                                        )
                                    })
                                }
                                {/* 현재이미지 */}
                                {
                                    previewUrls.map((url, i) => {
                                        return(
                                            <div className='imgBox' key={i} >
                                                <img src={url} alt={`preview-${i}`} />
                                                <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                        handleRemoveFile(i);  
                                                }}>X</div>
                                            </div>    
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품설명</div>
                        <textarea value={content} onChange={(e)=>{setContent( e.currentTarget.value )}} maxLength={2000}></textarea>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>가격</div>
                        <input value={price} onInput={getNumberOnly} onChange={(e)=>{setPrice( e.currentTarget.value )}}/>
                    </div>
                    <div className='detailPageBtns'>
                        <button onClick={()=>{writeShopPost()}}>상품 등록하기</button>
                    </div>
                    <div className='detailPageBtns'>
                        <button className='graybtn' onClick={()=>{ setIsOpen(false) }}>닫기</button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default SuggestDetail