package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Member;
import com.himedia.spserver.entity.SH.SH_Hashtag;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_zzim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SHOP_post post_id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member_id;
}
