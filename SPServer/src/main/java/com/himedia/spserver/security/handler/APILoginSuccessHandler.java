package com.himedia.spserver.security.handler;

import com.google.gson.Gson;
import com.himedia.spserver.dto.MemberDTO;
import com.himedia.spserver.security.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // authentication 매개변수에 전달된 memberDTO 를 꺼내고
        MemberDTO memberDTO = (MemberDTO)authentication.getPrincipal();
        // claims 추출하고
        Map<String, Object> claims = memberDTO.getClaims();

        // 토큰을 생성하고
        String accessToken = JWTUtil.generateToken(claims, 1);
        String refreshToken = JWTUtil.generateToken(claims, 60*24);

        // claims 에 토큰 추가
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // 클라이언트로 전송합니다
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();

    }
}
