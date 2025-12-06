package com.himedia.spserver.entity.Community;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

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
    @ColumnDefault("0")
    private Integer c_like = 0;
    private String c_reply;
    @ColumnDefault("'N'")
    private String isAnonymous; // 익명글 여부, Y면 익명, N이면 익명아님


    @ColumnDefault("'N'")
    private String isNotice="N"; // 공지사항 여부, Y면 공지사항, 관리자페이지에서 설정가능


    @Column(nullable = false)
    private Integer readcount = 0;

    @OneToMany(mappedBy = "cpost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<C_File> fileList;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private C_Category category;

    @Transient
    private long replyCount;


}
