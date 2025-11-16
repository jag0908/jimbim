package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Data
@Entity
public class SH_post {  // second hand
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @CreationTimestamp
    private Timestamp indate;

    private Timestamp updateDate;

    @Column(nullable = false)
    private Integer price;

    @ColumnDefault("'N'")
    private String deliveryYN;

    @ColumnDefault("'0'")
    private Integer deliveryPrice;

    @ColumnDefault("'N'")
    private String directYN;

    @Column(nullable = false)
    private Integer categoryId;

    @Column(nullable = false)
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberid")
    private Member member;

}
