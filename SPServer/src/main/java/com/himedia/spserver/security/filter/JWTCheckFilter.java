package com.himedia.spserver.security.filter;

import com.google.gson.Gson;
import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;


public class JWTCheckFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 전송된 요청(request)에 담긴 header 로 "사용자 정보"와 "토큰"을 점검
        String authHeaderStr = request.getHeader("Authorization");
        // axios.post('URL', null, {params:{}, header:{ 'Athoriztion':`Bearer ${accessToken}`  } )
        try{
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            System.out.println("JWT claims: " + claims);

            Integer member_id = (Integer) claims.get("member_id");
            String userid=(String)claims.get("userid");
            String pwd = (String) claims.get("pwd");
            String name = (String) claims.get("name");
            String phone = (String) claims.get("phone");
            String email = (String) claims.get("email");
            String provider = (String) claims.get("provider");
            String profileImg = (String) claims.get("profileImg");
            String profileMsg = (String) claims.get("profileMsg");
            String rrn = (String) claims.get("rrn");
            String terms_agree = (String) claims.get("terms_agree");
            String personal_agree = (String) claims.get("personal_agree");
            Object indateObj = claims.get("indate");
            Timestamp indate = null;
            if (indateObj instanceof Long) {
                indate = new Timestamp((Long) indateObj);
            } else if (indateObj instanceof Integer) {
                indate = new Timestamp(((Integer) indateObj).longValue());
            }
            Integer blacklist = (Integer) claims.get("blacklist");
            List<String> roleNames = (List<String>) claims.get("roleNames");

            MemberDTO memberDTO = new MemberDTO(userid, pwd, member_id, name, profileImg, profileMsg, phone,
                    email, rrn, terms_agree, personal_agree, indate, blacklist, provider, roleNames
            );

            UsernamePasswordAuthenticationToken authenticationToken
            = new UsernamePasswordAuthenticationToken(memberDTO, pwd , memberDTO.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        }catch(Exception e){
            System.out.println("JWT Check Error..............");
            System.out.println(e.getMessage());
            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }

    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        System.out.println("check uri : " + path);

        if(request.getMethod().equals("OPTIONS"))
            return true;

        // 로그인 없이 동작하게할 주소를 여기에 추가

        if(path.startsWith("/profile_img/"))
            return true;

        if(path.startsWith("/sh_img/"))
            return true;

        if(path.startsWith("/member/login"))
            return true;

        if(path.startsWith("/member/idcheck"))
            return true;

        if(path.startsWith("/member/join"))
            return true;

        if(path.startsWith("/member/kakaostart"))
            return true;

        if(path.startsWith("/member/kakaoLogin"))
            return true;

        if(path.startsWith("/member/getKakaoMember"))
            return true;

        if(path.startsWith("/member/kakaoIdFirstEdit"))
            return true;

        if(path.startsWith("/member/fileupload"))
            return true;

        if(path.startsWith("/member/findid"))
            return true;

        if(path.startsWith("/member/confirmCode"))
            return true;

        if(path.startsWith("/member/sendMail"))
            return true;

        if(path.startsWith("/member/resetPwd"))
            return true;

        if(path.startsWith("/member/refresh"))
            return true;

        if(path.startsWith("/favicon.ico"))
            return true;


        if(path.startsWith("/style/StyleFeed"))
            return true; // 공개 피드
        if(path.startsWith("/style/posts"))
            return true;   // 목록 보기 공개
        if (path.startsWith("/style/post/"))
            return true;

        if (path.startsWith("/style/fileupload")) return true;



        if (path.startsWith("/api/style/StyleFeed")) return true;
        if (path.startsWith("/api/style/posts")) return true;
        if (path.startsWith("/api/style/post/")) return true;
        if (path.startsWith("/api/style/fileupload")) return true;

        return false;
    }
}
