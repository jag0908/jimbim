import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityWrite.css';
// 수정필요 : 이미지 뜨지않음
// 링크 클릭시 undefind로 이동됨
// Ctrl + F '수정필요' 찾아가기
const baseURL = process.env.REACT_APP_BASE_URL;

function WriteCommunity() {
    const loginUser = useSelector(state => state.user);

    const [userid, setUserid] = useState('');
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pass, setPass] = useState("");
    const [image, setImage] = useState("");
    const [savefilename, setSavefilename] = useState("");
    const [imgSrc, setImgSrc] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: 'none' });
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [fileArr, setFileArr] = useState([]);
    const [fileLength, setFileLength] = useState(0);
    
    const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL 배열

    const navigate = useNavigate();

    const categories = [
        { id: 1, name: "자유게시판" },
        { id: 2, name: "질문게시판" },
        { id: 3, name: "살말" },
        { id: 4, name: "팔말" },
        { id: 5, name: "시세" },
        { id: 6, name: "정품 감정" },
        { id: 7, name: "핫딜" }
    ];

    useEffect(() => {
        if (loginUser && loginUser.userid) {
            setUserid(loginUser.userid);
        }
    }, [loginUser]);

    // 파일 미리보기 만들기
    function fileupload(e) {
        if(!e.target) {return}  // input file에서 파일을 올리지 않으면 취소됨

        let newfiles = Array.from(e.target.files);  // newfiles :  input file 에서 새로 올린 파일

        const allFiles = [...fileArr, ...newfiles]; // 기존 파일(allFiles)과 새 파일(newfiles) 합치기

        if (allFiles.length > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 단 최대개수를 초과하면 초기화
            return;
        };

        setFileLength(allFiles.length); // 최대개수를 초과하지 않았으면 state 변수에 저장
        setFileArr(allFiles);           // fileLength : 파일배열의 수, fileArr : 파일배열의 실제값

        
        const urls = allFiles.map(file => URL.createObjectURL(file));   // S3에 업로드하지 않고 브라우저에서 바로 미리보기 URL 생성
        setPreviewUrls(urls);                                           // state변수 previewUrls로 url 확인가능

        console.log('allfiles', allFiles, 'urls', urls)
        e.target.value = null;      // 실제 업로드 될 내용은 이미 fileArr에 담았으므로, input file에 있는 내용은 비워버려도 됨
        // 비우지 않을 경우 파일을 업로드 >> 업로드 취소 >> 취소한 파일 다시 업로드 할때 오류가 생김
    };

    // 파일 삭제
    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);       // fileArr에서 파일 내용을 하나씩 확인하여 삭제버튼을 누른쪽의 파일을 찾아 fileArr에서 지움

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);
        setFileLength(fileLength-1)     // 페이지에서 n/10 형태로 표기될 파일 업로드 제한수
    };

    // 게시물 생성시 파일 S3에 업로드
    async function createFormData(fileArr) {
        // createFormData()는 onSubmit()의 안에서 같이 실행
        // 즉 게시물 생성되는 시기에 이미지가 업로드 된다는 뜻
        if(!fileArr[0].name) return;    // fileArr에 값이 없을경우 createFormData()는 실행되지 않음

        const formData = new FormData();
        // 파일 데이터 저장
        Object.values(fileArr).forEach((fileArr) => formData.append("imageList", fileArr));
        // spring에서 (@RequestParam("imageList") MultipartFile[] file) 의 형태로 fileArr 값을 사용할 수 있음

        try{
            await jaxios.get("/api/communityList/getNewCommunity", formData)
            .then((result)=> {
                console.log(result.data);
                formData.append("cpostId", result.data.community.cpostId);
                // result.data 의 내용 : imageList(경로가 제외된 파일이름), savefilenameList(경로가 포함된 파일이름)
            })

            await jaxios.post("/api/communityList/fileupload", formData)
            .then((result)=> {
                
            })
        }catch(err){
            console.error(err)
        }
    }

    async function onSubmit() {
        if (!title) return alert('제목을 입력하세요');
        if (!content) return alert('내용을 입력하세요');
        if (!selectedCategoryId) return alert('카테고리를 선택하세요');

        // 익명 선택 시 userid를 '익명'으로 설정
        const postData = {
            userid: isAnonymous ? '익명' : userid,
            pass,
            title,
            content,
            image,
            savefilename,
            categoryId: selectedCategoryId
        };

        await jaxios.post(`api/communityList/createCommunity`, postData)
            .then(() => {
            })
            .catch((err) => { console.error(err) });
            
        await createFormData(fileArr)

        
        alert('게시물이 작성되었습니다');
        navigate('/communityList');
        
    }

    return (
        <div className='writeCommunity'>
            <h2>COMMUNITY WRITE</h2>
            <div className='field'>
                <label>작성자</label>
                {loginUser && loginUser.userid ? (
                    <input type='text' value={userid} readOnly />
                ) : (
                    <input type='text' value={userid} placeholder='익명으로 작성하려면 비워두세요' onChange={(e) => setUserid(e.currentTarget.value)} />
                )}
                <div>
                    <label>
                        <input type='checkbox' checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                        익명으로 작성
                    </label>
                </div>
            </div>
            <div className='field'>
                <label>카테고리</label>
                <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(Number(e.target.value))}>
                    <option value={0}>선택하세요</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </div>
            <div className='field'>
                <label>내용</label>
                <textarea rows='10' value={content} onChange={(e) => setContent(e.currentTarget.value)}></textarea>
            </div>
            <div className='inputWrap file'>
                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                {/* 파일업로드 인풋 */}
                <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                {/* 미리보기 이미지 */}
                <div className="previewContainer">
                    {previewUrls.map((url, i) => (
                        <div className='imgBox' key={i} >
                            <img src={url} alt={`preview-${i}`} />
                            <div className={`removeBtn removeBtn_${i}`}onClick={()=> {
                                handleRemoveFile(i);
                            }}>X</div>
                        </div>    
                    ))}
                </div>
            </div>
            <div className='btns'>
                <button onClick={onSubmit}>작성완료</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>
        </div>
    )
}

export default WriteCommunity;
