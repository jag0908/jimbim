package com.himedia.spserver.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class ShPostDto {
    private Integer postId;
    private String title;
    private String content;
    private Integer price;
    private Timestamp indate;
    private String category;
    private Integer viewCount;

    private String direct_yn;   // 직거래 가능 여부
    private String delivery_yn; // 배송 가능 여부
    private Integer delivery_price;

    private ShFileDto representFile; // 대표 이미지

    private Integer member_id;
    private String member_name;
    private String member_profileImg;
    private String member_profileMsg;
    private Integer member_blacklist;

    private List<ShFileDto> files;
}
