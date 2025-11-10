package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
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
    private List<String> s_images;
    private Integer likeCount;
    private Integer replyCount;
    private String userid;
    private String profileImg;

    private Boolean liked;     // 로그인한 사용자의 좋아요 여부
    private Boolean followed;  // 로그인한 사용자의 팔로우 여부

    private List<String> hashtags;
}
