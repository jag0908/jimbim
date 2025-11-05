package com.himedia.spserver.entity.Mypage;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data

public class SHOP_Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_id;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    private String receiver;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SHOP_post post_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member_id;
}
