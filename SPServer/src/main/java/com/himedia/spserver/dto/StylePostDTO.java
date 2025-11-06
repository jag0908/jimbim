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
    private String s_image;
    private Integer likeCount;
    private Integer replyCount;
    private String userid;
    private String profileImg;

    private List<String> hashtags;
}
