package com.himedia.spserver.entity;
import com.himedia.spserver.entity.Community.C_post;
import com.himedia.spserver.entity.STYLE.STYLE_post;
import com.himedia.spserver.entity.SH.SH_post;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spostId") // STYLE_post의 PK (spost_id)와 연결
    private STYLE_post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpostId") // C_post의 PK (cpost_id)와 연결
    private C_post cpost;

    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

}
