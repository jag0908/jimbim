package com.himedia.spserver.entity.Community;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class C_Category {
    @Id
    private Integer categoryId;
    private String categoryName;

    private Integer id;
}
