package com.himedia.spserver.entity.Mypage;

import com.himedia.spserver.entity.Address;
import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_post;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class SH_Orderdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderdetail_id;
    private Integer result;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
    @Column(nullable = false)
    private String address_zipnum;
    @Column(nullable = false)
    private String address_detail;
    @Column(nullable = false)
    private String address_simple;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SH_post post_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member memberId;
}
