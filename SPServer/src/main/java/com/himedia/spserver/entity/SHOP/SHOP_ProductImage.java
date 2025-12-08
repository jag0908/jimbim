package com.himedia.spserver.entity.SHOP;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_ProductImage {

    @Id
    @GeneratedValue
    private Long id;

    private String fileName;
    private String filePath;

    @ManyToOne
    @JsonIgnore         // 어드민 페이지에서 추가
    private SHOP_Product product;
}
