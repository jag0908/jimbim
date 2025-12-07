package com.himedia.spserver.dto;

import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
public class AlramShSuggestResDto {
    private Long id;

    private String startUserId;
    private String startUserProfileImg;

    private Integer endUserId;

    private Integer postId;
    private String postTitle;

    private String targetType;

    private Integer price;

    private Integer approved;

    private Boolean isRead = false;

    private Timestamp indate;
}

