package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Timestamp;

@Entity
@Data
public class AlramZzim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String startUserId;
    private String startUserProfileImg;

    @Comment("받은 유저 자기자신")
    private Integer endUserId;

    @Comment("알람 대상의 게시물아이디")
    private Integer postId;
    private String postTitle;
    @Comment("알람 대상의 타입")
    private String targetType;



    @Comment("알람 읽기 여부")
    private Boolean isRead = false;

    @CreationTimestamp
    private Timestamp indate;
}
