package com.himedia.spserver.dto;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
public class AlramZzimResDto {
    private Long id;

    private String startUserId;
    private String startUserProfileImg;

    private Integer endUserId;

    private Integer postId;
    private String postTitle;
    private String targetType;

    private Boolean isRead = false;

    private Timestamp indate;
}
