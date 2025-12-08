package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Community.C_Category;
import com.himedia.spserver.entity.File;
import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Data
@Entity
public class SHOP_post {  // second hand
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;
    @Column(nullable = false, length = 50)
    private String title;
    @Column(nullable = false, length = 2000)
    private String content;

    @CreationTimestamp
    private Timestamp indate;
    @Column(nullable = false)
    private Integer price;

    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String delivery_yn;
    //@Column(nullable = false)
    @ColumnDefault("'0'")
    private Integer delivery_price;
    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String direct_yn;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private SHOP_Category category;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SHOP_File> files;
}
