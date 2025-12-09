package com.himedia.spserver.entity.SHOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore     // product에서 option 찾고 option 에서 product 찾고 다시 product에서 option... 방지
    // 단 사이즈를 먼저 찾고 나중에 상품을 검색하는 경우는 에러가 생길수 있음
    private SHOP_Product product;

    @OneToMany(mappedBy = "option")
    @JsonIgnore
    private List<SHOP_SellList> sellList;
}
