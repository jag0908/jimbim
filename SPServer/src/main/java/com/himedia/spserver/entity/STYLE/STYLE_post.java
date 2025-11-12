package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
public class STYLE_post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer spostId;

    private String title;
    private String content;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    @Column(nullable = false)
    private int viewCount = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<File> files;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;



}
