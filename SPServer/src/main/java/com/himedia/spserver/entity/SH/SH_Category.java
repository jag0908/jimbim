package com.himedia.spserver.entity.SH;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SH_Category {
    @Id
    private Integer category_id;
    private String category_name;
}
