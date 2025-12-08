package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
public class SHOP_Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String title;
    private String content;
    private Integer deliveryPrice;

    @Column(columnDefinition = "int default 0")
    private Integer viewCount;

    @CreationTimestamp
    private Timestamp indate;

    @ManyToOne
    private SHOP_Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<SHOP_ProductImage> images;

    @OneToMany(mappedBy = "product")
    private List<SHOP_ProductOption> options;

    @OneToMany(mappedBy = "product")
    private List<SHOP_SellList> sellLists;
}

