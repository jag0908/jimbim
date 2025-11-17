package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SH_zzim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SH_post post;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;
}
