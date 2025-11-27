package com.himedia.spserver.entity.Community;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class C_Category {
    @Id
    private Integer categoryId;
    private String categoryName;

    private Integer id;
}
