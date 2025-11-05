package com.himedia.spserver.entity.SH;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SH_Hashtag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tag_id;
    private String word;
}
