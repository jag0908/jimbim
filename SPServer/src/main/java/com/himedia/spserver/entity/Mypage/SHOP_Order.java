package com.himedia.spserver.entity.Mypage;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data

public class SHOP_Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_id;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    private String receiver;
    @Column(nullable = false)
    private String address_zipnum;
    @Column(nullable = false)
    private String address_detail;
    @Column(nullable = false)
    private String address_simple;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member memberId;

    @OneToMany
    @JoinColumn(name = "order_id")
    private List<SHOP_Orderdetail> orderdetail;
}
