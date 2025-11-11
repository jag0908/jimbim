package com.himedia.spserver.controller;

import com.google.gson.Gson;
import com.himedia.spserver.dto.KakaoProfile;
import com.himedia.spserver.dto.OAuthToken;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.security.service.CustomUserDetailService;
import com.himedia.spserver.security.util.CustomJWTException;
import com.himedia.spserver.security.util.JWTUtil;
import com.himedia.spserver.service.MemberService;
import com.himedia.spserver.service.S3UploadService;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    // /member/login 시 실행되는 코드는 CustomSecurityConfig -> securityFilterChain 에
    // 로그인 없이 동작하게할 주소는 JWTCheckFilter 의 shouldNotFilter 에 추가 필요함
    String clientUrl = "http://localhost:3000";

    @Autowired
    MemberService ms;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/idcheck")   // id 중복체크
    public HashMap<String, Object> idcheck(@RequestParam("userid") String userid ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember( userid );
        if( member == null )
            result.put("msg", "ok");
        else
            result.put("msg", "notok");
        return result;
    }

    @PostMapping("/join")      // 회원가입
    public HashMap<String, Object> join( @RequestBody Member member ) {
        HashMap<String, Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/pwdcheck")   // 비밀번호 체크
    public HashMap<String, Object> pwdcheck(@RequestParam("userid") String userid, @RequestParam("pwd") String pwd) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember( userid );
        if( passwordEncoder.matches(pwd, member.getPwd()) )
            result.put("msg", "ok");
        else
            result.put("msg", "notok");
        return result;
    }


    @PostMapping("/updateMember")      // 회원정보수정
    public HashMap<String, Object> updateMember( @RequestBody Member member ) {
        HashMap<String, Object> result = new HashMap<>();
        ms.updateMember(member);
        result.put("msg", "ok");
        return result;
    }


    /// /////////////////// 파일업로드 /////////////////////////////

//    @Autowired
//    ServletContext sc;
//
//    @PostMapping("/fileupload")
//    public HashMap<String, Object> fileUpload(  @RequestParam("image") MultipartFile file ) {
//        HashMap<String , Object> result = new HashMap<>();
//        String path = sc.getRealPath("/profile_img");
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//        String filename = file.getOriginalFilename();
//        String f1 = filename.substring(0, filename.lastIndexOf("."));
//        String f2 = filename.substring(filename.lastIndexOf("."));
//        String uploadPath = path + "/" + f1 + dt + f2;
//        try {
//            file.transferTo( new File(uploadPath) );
//            result.put("filename", f1 + dt + f2);
//        } catch (IllegalStateException | IOException e) {
//            e.printStackTrace();
//        }
//        return result;
//    }
    @Autowired
    S3UploadService sus;

    @PostMapping("/fileupload")
    public HashMap<String, Object> fileUpload(  @RequestParam("image") MultipartFile file ) {
        HashMap<String , Object> result = new HashMap<>();
        try {
            String uploadFilePathName = sus.saveFile( file );
            result.put("image", file.getOriginalFilename() );
            result.put("filename", uploadFilePathName);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }
        return result;
    }
    /// /////////////////// 파일업로드 끝  /////////////////////////////

    /*----------------카카오로그인----------------------------*/

    @Value("${kakao.client_id}")
    private String client_id;
    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @GetMapping("/kakaostart")
    public @ResponseBody String kakaostart() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/kakaoLogin")
    public void kakaoLogin(HttpServletRequest request, HttpServletResponse response ) throws IOException {
        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=" + client_id + "&";
        bodyData += "redirect_uri=" + redirect_uri + "&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
            System.out.println(input2);
        }
        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();
        System.out.println("id : " + kakaoProfile.getId());
        System.out.println("KakaoAccount-Email : " + ac.getEmail());
        System.out.println("Profile-Nickname : " + pf.getNickname());

        Member member = ms.getMember( kakaoProfile.getId() );
        if( member == null ) {
            member = new Member();
            member.setUserid(kakaoProfile.getId());
            member.setName(pf.getNickname());
            member.setPwd("KAKAO");
            member.setEmail(kakaoProfile.getId());
            member.setPhone("미설정");
            member.setName(pf.getNickname());
            member.setRrn("미설정");
            member.setProvider("KAKAO");
            member.setProfileImg(pf.getProfile_image_url());
            ms.insertMember(member);
        }
        String resulturl = (member.getPhone().equals("미설정")||member.getRrn().equals("미설정"))?
                clientUrl+"/kakaoIdFirstEdit/":clientUrl+"/kakaoIdLogin/";
        // 전화번호 또는 주민번호가 미설정이면 초기 정보수정 페이지로 이동, 초기 정보수정 완료시 바로 로그인 페이지로 이동
        response.sendRedirect(resulturl+member.getUserid());

    }

    @PostMapping("/getKakaoMember")   // id 중복체크
    public HashMap<String, Object> getKakaoMember(@RequestParam("userid") String userid ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember( userid );
        result.put("member", member);
        return result;
    }

    @PostMapping("/kakaoIdFirstEdit")
    public HashMap<String, Object> kakaoIdFirstEdit( @RequestBody Member member ) {
        HashMap<String, Object> result = new HashMap<>();
        System.out.println("kakaoIdFirstEdit" + member);
        ms.kakaoIdFirstEdit(member);
        result.put("msg", "ok");
        return result;
    }
    /*----------------카카오로그인끝----------------------------*/

    /// ///////////////// 아이디 비번 찾기 ///////////////////
    @PostMapping("/findid")
    public HashMap<String, Object> findid( @RequestParam("name") String name,  @RequestParam("phone") String phone ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMemberByNamePhone( name, phone  );
        System.out.println( name +  phone );
        if( member == null ){
            result.put("msg", "notok");
        }else{
            result.put("msg", "ok");
            result.put("userid", member.getUserid());
        }
        return result;
    }

    private int number;

    @PostMapping("/sendMail")
    public HashMap<String, Object> sendMail(@RequestParam("email") String email){
        HashMap<String, Object> result = new HashMap<>();
        number = ms.sendMail(email);
        result.put("msg", "ok");
        return result;
    }

    @PostMapping("/confirmCode")
    public HashMap<String, Object> confirmCode(@RequestParam("usercode") String usercode){
        HashMap<String, Object> result = new HashMap<>();
        if( Integer.parseInt( usercode ) == number ){
            result.put("msg", "ok");
        }else{
            result.put("msg", "notok");
        }
        return result;
    }


    @PostMapping("/resetPwd")
    public HashMap<String, Object> resetPwd( @RequestParam("pwd") String pwd, @RequestParam("userid") String userid){
        HashMap<String, Object> result = new HashMap<>();
        ms.resetPw(userid, pwd);
        result.put("msg", "ok");
        return result;
    }
    /// ///////////////// 아이디 비번 찾기 끝 ///////////////////



    /*---------------- 토큰 만료시 재발급 --------------------------*/
    @GetMapping("/refresh/{refreshToken}")
    public HashMap<String, Object> refresh(
            @PathVariable("refreshToken") String refreshToken ,
            @RequestHeader("Authorization") String authHeader   ) throws CustomJWTException {
        HashMap<String, Object> result = new HashMap<>();

        if( refreshToken == null || refreshToken.equals("") )
            throw  new CustomJWTException("NULL_REFRESH");
        if( authHeader == null || authHeader.length() < 7 )
            throw new CustomJWTException("INVALID_HEADER");

        String accessToken = authHeader.substring(7);

        // 기한 만료 체크
        boolean expiredResult = true;
        try {
            JWTUtil.validateToken( accessToken );
        } catch (CustomJWTException e) {
            if( e.getMessage().equals("Expired") ) expiredResult=false;
        }

        if( expiredResult ){  // 유효기한 만료전
            System.out.println("토큰 유효기간 만료전... 계속 사용");
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);
        }else{ // 유효기한 만료 후
            System.out.println("토큰 유효기간 만료후... 토큰 교체");
            // 리프레시 토큰에서 claims 를 추출
            Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
            // 추출한 claims 로 accessToken 재발급
            String newAccessToken = JWTUtil.generateToken(claims, 1);

            String newRefreshToken = "";
            int exp = (Integer)claims.get("exp");
            java.util.Date expDate = new java.util.Date( (long)exp * (1000));//밀리초로 변환
            long gap = expDate.getTime() - System.currentTimeMillis();//현재 시간과의 차이 계산
            long leftMin = gap / (1000 * 60); //분단위 변환
            if(  leftMin < 60  )  // 한시간 미만으로 남았으면 토큰 교체
                newRefreshToken = JWTUtil.generateToken(claims, 60*24);
            else
                newRefreshToken = refreshToken;

            result.put("accessToken", newAccessToken);
            result.put("refreshToken", newRefreshToken);
        }
        return result;
    }
}
