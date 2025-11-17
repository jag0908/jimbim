package com.himedia.spserver.entity.Community;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class C_post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cpostId;

    private Integer cpostNum;
    private String title;
    private String content;
    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    private String c_image;
    private String c_like;
    private String c_reply;
    private Integer readcount;

    @ManyToOne
    @JoinColumn(name = "file_id")
    File file;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private C_Category category;

}
