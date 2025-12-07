package com.himedia.spserver.entity.SHOP;

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
    private SHOP_Product product;
}
