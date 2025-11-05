package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SHOP_Category {
    @Id
    private Integer category_id;
    private String category_name;
}
