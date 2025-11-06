package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class STYLE_post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer spost_id;

    private String title;
    private String content;
    private Timestamp indate;
    private String s_image;
    private String s_like;
    private String s_reply;

    @ManyToOne
    @JoinColumn(name = "file_id")
    File file;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;


}
