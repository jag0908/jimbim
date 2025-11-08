package com.himedia.spserver.dto;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class MemberDTO extends User {
    public MemberDTO(  // 생성자
                       String username, String password, Integer member_id, String name, String profileImg, String profileMsg, String phone,
                       String email, String rrn, String terms_agree, String personal_agree, Timestamp indate, Integer blacklist, String provider,
                       List<String> roleNames
    ) {
            super(   // 부모클래스 생성자 호출
                    username, password,  roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_"+str)).collect(Collectors.toList())
                    // List의 내용들에  ROLE_ 를 앞에 붙여서 다시 리스트로 구성);
            );
            // 멤버변수들 값 대입
            this.userid = username; this.pwd = password; this.member_id = member_id;
            this.name = name; this.profileImg = profileImg; this.profileMsg = profileMsg;
            this.phone = phone; this.email = email; this.rrn = rrn;
            this.terms_agree = terms_agree; this.personal_agree = personal_agree; this.indate = indate;
            this.blacklist = blacklist; this.provider = provider; this.roleNames = roleNames;
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
        dataMap.put("member_id",member_id);
        dataMap.put("userid", userid);
        dataMap.put("pwd", pwd);
        dataMap.put("name",name);
        dataMap.put("profileImg",profileImg);
        dataMap.put("profileMsg",profileMsg);
        dataMap.put("phone",phone);
        dataMap.put("email",email);
        dataMap.put("rrn",rrn);
        dataMap.put("terms_agree",terms_agree);
        dataMap.put("personal_agree",personal_agree);
        dataMap.put("indate",indate);
        dataMap.put("blacklist",blacklist);
        dataMap.put("provider",provider);

        dataMap.put("roleNames", roleNames);
        return dataMap;
    }
}
