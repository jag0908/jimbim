package com.himedia.spserver.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
public class ShMemberDto {
    private Integer memberId;
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

}
