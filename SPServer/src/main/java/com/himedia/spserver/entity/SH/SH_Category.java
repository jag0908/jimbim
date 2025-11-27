package com.himedia.spserver.entity.SH;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SH_Category {
    @Id
    private Integer category_id;
    private String category_name;
}
