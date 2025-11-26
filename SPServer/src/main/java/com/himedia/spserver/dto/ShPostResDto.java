package com.himedia.spserver.dto;

import com.himedia.spserver.entity.Member;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class ShPostResDto {
    private Integer postId;
    private String title;
    private String content;
    private Integer price;
    private Integer categoryId;
    private String directYN;
    private String deliveryYN;
    private Integer deliveryPrice;
    private Integer viewCount;
    private Timestamp indate;
    private Timestamp updateDate;
    private Integer sellEx;

    private List<ShFileDto> files;
    private String firstFilePath;

    private ShMemberDto member;

}
