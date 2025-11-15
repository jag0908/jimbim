import axios from 'axios'
import {Cookies} from 'react-cookie'
const jaxios = axios.create()
const cookies = new Cookies()

const beforeReq = (config) => {
  let loginUser = cookies.get('user');

  if (!loginUser) {
    console.warn('⚠️ 로그인 정보 없음 — Authorization 헤더 추가 안함');
    return config;
  }

  if (typeof loginUser === 'string') {
    try {
      loginUser = JSON.parse(loginUser);
    } catch (e) {
      console.error('❌ 쿠키 파싱 실패:', e);
      return config;
    }
  }

  // 여기서 토큰 payload 확인
  if (loginUser.accessToken) {
    try {
      const token = loginUser.accessToken;
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log("token payload:", payload);
      //console.log("exp:", new Date(payload.exp * 1000));  // 만료 시간
    } catch (err) {
      console.error("❌ 토큰 디코딩 실패:", err);
    }
  } else {
    console.warn('⚠️ accessToken 없음 — Authorization 헤더 추가 안함');
    return config;
  }

  config.headers = { ...config.headers, Authorization: `Bearer ${loginUser.accessToken}` };
  return config;
};



const requestFail=(err)=>{
    console.log("reqeust fail error.............")
    return Promise.reject(err);
}

const beforeRes= async (res)=>{
    // jaxios로 보낸 요청에 대해 서버에서 응답을 보내면
    // 토큰에러에 대한 응답인지를 체크해서 , 토큰 에러라면 토큰을 갱신하고 현재요청을 재요청합니다
    
    let loginUser = cookies.get('user');
        if (typeof loginUser === 'string') {
            try {
                loginUser = JSON.parse(loginUser);
            } catch (e) {
                console.error('쿠키 파싱 실패:', e);
            }
        }
    // 응답 내용을 꺼내서 data 변수에 저장    
    const data = res.data
    if(data && data.error ==='ERROR_ACCESS_TOKEN'){
        // 토큰이 기간 만료된경우
        const result = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,  {headers: {"Authorization":`Bearer ${loginUser.accessToken}`} } )

        // 위요청의 응답은 갱신되었거나 유효기간이 지나지 않은 원래 토큰이 담겨서 옵니다
        loginUser.accessToken = result.data.accessToken;
        loginUser.refreshToken = result.data.refreshToken;
        cookies.set('user', JSON.stringify({
            userid: loginUser.userid,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
        }), { path: '/' });
        const originalRequest = res.config
        originalRequest.headers = {...originalRequest.headers,Authorization: `Bearer ${loginUser.accessToken}`,};
        return await jaxios(originalRequest)  // 새로운 요청을 보내고 받은 응답을 리턴
    }
    return res   // 원래의 요청에 대한 응답을 리턴
}

const responseFail=(err)=>{
    console.log("response fail error.............")
    return Promise.reject(err);
}


jaxios.interceptors.request.use( beforeReq, requestFail)
jaxios.interceptors.response.use( beforeRes, responseFail)

export default jaxios