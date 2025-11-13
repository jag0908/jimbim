package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@Entity
public class SH_post {  // second hand
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="post_id")
    private Integer postId;
    @Column(nullable = false, length = 50)
    private String title;
    @Column(nullable = false, length = 2000)
    private String content;
    @CreationTimestamp
    private Timestamp indate;
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

    @Column(nullable = false)
    private Integer viewCount = 0;


    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "represent_file_id")
    private File representFile;

}
