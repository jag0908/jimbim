package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_zzim {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private SHOP_Product product;

    @ManyToOne
    private Member member;
}
