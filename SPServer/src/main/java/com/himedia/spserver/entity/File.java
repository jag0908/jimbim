package com.himedia.spserver.entity;

import com.himedia.spserver.entity.STYLE.STYLE_post;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer file_id;
    @Column(nullable = false, length = 200)
    private String originalname;
    @Column(nullable = false)
    private Long size;
    @Column(nullable = false, length = 500)
    private String path;
    @Column(nullable = false)
    private String contentType;
    private String post_id; //Style post는 Post_id가 아니라 spost_id라 null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spostId", nullable = false) // STYLE_post의 PK (spost_id)와 연결
    private STYLE_post post;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

}
