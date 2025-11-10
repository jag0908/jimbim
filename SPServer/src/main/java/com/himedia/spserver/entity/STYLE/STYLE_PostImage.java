package com.himedia.spserver.entity.STYLE;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class STYLE_PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PK

    private String imagePath; // 업로드된 이미지 경로 (ex: /uploads/uuid_filename.jpg)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id") // STYLE_post 테이블의 PK와 FK 매핑
    private STYLE_post post;
}
