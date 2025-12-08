package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class SHOP_SellList {

    @Id
    @GeneratedValue
    private Long sellId;

    @ManyToOne
    private SHOP_Product product;

    @ManyToOne
    private SHOP_ProductOption option;

    @ManyToOne
    private Member seller;

    private Integer price;

    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    @ColumnDefault("'N'")
    private String status; // selling, soldout
}
