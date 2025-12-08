package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SHOP_Category {
    @Id
    @Column(name = "category_id")
    private Long categoryId;

    private String category_name;
}
