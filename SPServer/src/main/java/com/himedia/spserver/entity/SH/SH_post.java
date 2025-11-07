package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.sql.Timestamp;

@Data
@Entity
public class SH_post {  // second hand
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer post_id;
    @Column(nullable = false, length = 50)
    private String title;
    @Column(nullable = false, length = 2000)
    private String content;
    private String sh_image;
//    @Column( columnDefinition="DATETIME default now()" )
//    private Timestamp indate;
    @Column(nullable = false, updatable = false)
    private Timestamp indate = new Timestamp(System.currentTimeMillis());
    @Column(nullable = false)
    private Integer price;
    @Column(nullable = false)
    @ColumnDefault("'N'")
    private String delivery_yn;
    @Column(nullable = false)
    @ColumnDefault("'0'")
    private Integer delivery_price;
    @Column(nullable = false)
    @ColumnDefault("'N'")
    private String direct_yn;
    @Column(nullable = false)
    private String category;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;


    @ManyToOne
    @JoinColumn(name = "file_id")
    File file;
}
