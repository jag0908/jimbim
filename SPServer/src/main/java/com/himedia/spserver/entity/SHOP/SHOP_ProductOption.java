package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class SHOP_ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long optionId;

    private String optionName; // 예: 260, 265 또는 S/M/L

    @ManyToOne
    private SHOP_Product product;

    @OneToMany(mappedBy = "option")
    private List<SHOP_SellList> sellList;
}
