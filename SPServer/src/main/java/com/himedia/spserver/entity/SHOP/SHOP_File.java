package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer file_id;

    private String fileName;   // 서버에 저장된 파일명
    private String filePath;   // 경로

    @ManyToOne
    @JoinColumn(name = "suggest_id")
    private SHOP_Suggest suggest;
}
