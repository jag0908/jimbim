package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class StylePostDTO {
    private Integer spost_id;
    private String title;
    private String content;
    private Timestamp indate;
    private List<String> s_images = new ArrayList<>();
    private Integer likeCount = 0;
    private Integer replyCount = 0;
    private String userid;
    private String profileImg;
    private int viewCount = 0;

    private Boolean liked = false;     // 로그인한 사용자의 좋아요 여부
    private Boolean followed = false;  // 로그인한 사용자의 팔로우 여부

    private List<String> hashtags = new ArrayList<>();
}
