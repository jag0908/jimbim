package com.himedia.spserver.controller;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.security.util.CustomJWTException;
import com.himedia.spserver.security.util.JWTUtil;
import com.himedia.spserver.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    // 로그인 없이 동작하게할 주소는 JWTCheckFilter 의 shouldNotFilter 에 추가 필요함

    @Autowired
    MemberService ms;

    @PostMapping("/idcheck")
    public HashMap<String, Object> idcheck(@RequestParam("userid") String userid ) {
        HashMap<String, Object> result = new HashMap<>();
        Member member = ms.getMember( userid );
        if( member == null )
            result.put("msg", "ok");
        else
            result.put("msg", "notok");
        return result;
    }

    @PostMapping("/join")
    public HashMap<String, Object> join( @RequestBody Member member ) {
        HashMap<String, Object> result = new HashMap<>();
        ms.insertMember(member);
        result.put("msg", "ok");
        return result;
    }

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
            java.util.Date expDate = new java.util.Date( (long)exp * (1000 ));//밀리초로 변환
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
