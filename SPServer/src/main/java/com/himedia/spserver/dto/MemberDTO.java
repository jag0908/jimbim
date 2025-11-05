package com.himedia.spserver.dto;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MemberDTO extends User {
    public MemberDTO(  // 생성자
                       String username, String password, List<String> roleNames
    ) {
            super(   // 부모클래스 생성자 호출
                    username, password,  roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_"+str)).collect(Collectors.toList())
                    // List의 내용들에  ROLE_ 를 앞에 붙여서 다시 리스트로 구성);
            );
            // 멤버변수들 값 대입
            this.userid = username; this.pwd = password; this.roleNames = roleNames;
    }

    private Integer member_id;
    private String userid;
    private String pwd;
    private String name;
    private String profileImg;
    private String profileMsg;
    private String phone;
    private String email;
    private String rrn; //주민번호
    private String terms_agree;
    private String personal_agree;
    private Timestamp indate;
    private Integer blacklist;
    private String provider;
    private List<String> roleNames = new ArrayList<String>();



    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("pwd",pwd);
        dataMap.put("userid", userid);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);
        dataMap.put("pwd",pwd);

        dataMap.put("roleNames", roleNames);
        return dataMap;
    }
}
